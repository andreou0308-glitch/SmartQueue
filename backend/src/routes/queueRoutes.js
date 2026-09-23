const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.post("/call-next", async (request, response, next) => {
    const serviceId = Number(request.body.serviceId);
    const counterId = Number(request.body.counterId);

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
        return response.status(400).json({
            status: "error",
            message: "A valid serviceId is required"
        });
    }

    if (!Number.isInteger(counterId) || counterId <= 0) {
        return response.status(400).json({
            status: "error",
            message: "A valid counterId is required"
        });
    }

    let client;

    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const counterResult = await client.query(
            `SELECT id, name
             FROM counters
             WHERE id = $1 AND is_active = TRUE`,
            [counterId]
        );

        if (counterResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return response.status(404).json({
                status: "error",
                message: "Active counter not found"
            });
        }

        const currentTicketResult = await client.query(
            `SELECT id
             FROM queue_tickets
             WHERE counter_id = $1
               AND ticket_date = CURRENT_DATE
               AND status = 'CALLED'
             LIMIT 1`,
            [counterId]
        );

        if (currentTicketResult.rows.length > 0) {
            await client.query("ROLLBACK");

            return response.status(409).json({
                status: "error",
                message: "Counter is already serving a ticket"
            });
        }

        const waitingTicketResult = await client.query(
            `SELECT id
             FROM queue_tickets
             WHERE service_id = $1
               AND ticket_date = CURRENT_DATE
               AND status = 'WAITING'
             ORDER BY daily_number ASC
             FOR UPDATE SKIP LOCKED
             LIMIT 1`,
            [serviceId]
        );

        if (waitingTicketResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return response.status(404).json({
                status: "error",
                message: "No waiting tickets found"
            });
        }

        const ticketId = waitingTicketResult.rows[0].id;

        const updatedTicketResult = await client.query(
            `UPDATE queue_tickets
             SET status = 'CALLED',
                 counter_id = $1,
                 called_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, service_id, counter_id, daily_number,
                       ticket_number, ticket_date, status,
                       issued_at, called_at`,
            [counterId, ticketId]
        );

        await client.query("COMMIT");

        return response.status(200).json({
            status: "success",
            message: "Next ticket called successfully",
            data: {
                ticket: updatedTicketResult.rows[0],
                counter: counterResult.rows[0]
            }
        });
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }

        next(error);
    } finally {
        if (client) {
            client.release();
        }
    }
});
router.patch("/tickets/:ticketId/complete", async (request, response, next) => {
    const ticketId = Number(request.params.ticketId);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
        return response.status(400).json({
            status: "error",
            message: "A valid ticketId is required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE queue_tickets
             SET status = 'COMPLETED',
                 completed_at = CURRENT_TIMESTAMP
             WHERE id = $1
               AND status = 'CALLED'
             RETURNING id, service_id, counter_id, daily_number,
                       ticket_number, ticket_date, status,
                       issued_at, called_at, completed_at`,
            [ticketId]
        );

        if (result.rows.length === 0) {
            return response.status(404).json({
                status: "error",
                message: "Called ticket not found"
            });
        }

        return response.status(200).json({
            status: "success",
            message: "Ticket completed successfully",
            data: {
                ticket: result.rows[0]
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;