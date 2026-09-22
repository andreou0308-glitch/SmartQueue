const express = require("express");
const pool = require("../config/database");
const {
    formatTicketNumber,
    calculateEstimatedWait
} = require("../services/queueService");

const router = express.Router();

router.post("/", async (request, response, next) => {
    const serviceId = Number(request.body.serviceId);

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
        return response.status(400).json({
            status: "error",
            message: "A valid serviceId is required"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const serviceResult = await client.query(
            `SELECT id, name, code, average_service_minutes
             FROM services
             WHERE id = $1 AND is_active = TRUE`,
            [serviceId]
        );

        if (serviceResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return response.status(404).json({
                status: "error",
                message: "Active service not found"
            });
        }

        const service = serviceResult.rows[0];

        await client.query(
            "SELECT pg_advisory_xact_lock($1::bigint)",
            [serviceId]
        );

        const numberResult = await client.query(
            `SELECT COALESCE(MAX(daily_number), 0) + 1 AS next_number
             FROM queue_tickets
             WHERE service_id = $1
               AND ticket_date = CURRENT_DATE`,
            [serviceId]
        );

        const dailyNumber = Number(numberResult.rows[0].next_number);
        const ticketNumber = formatTicketNumber(
            service.code,
            dailyNumber
        );

        const waitingResult = await client.query(
            `SELECT COUNT(*)::integer AS waiting_count
             FROM queue_tickets
             WHERE service_id = $1
               AND ticket_date = CURRENT_DATE
               AND status = 'WAITING'`,
            [serviceId]
        );

        const waitingCount = waitingResult.rows[0].waiting_count;
        const estimatedWaitMinutes = calculateEstimatedWait(
            waitingCount,
            service.average_service_minutes
        );

        const ticketResult = await client.query(
            `INSERT INTO queue_tickets
                (service_id, daily_number, ticket_number)
             VALUES ($1, $2, $3)
             RETURNING id, service_id, daily_number, ticket_number,
                       ticket_date, status, issued_at`,
            [serviceId, dailyNumber, ticketNumber]
        );

        await client.query("COMMIT");

        return response.status(201).json({
            status: "success",
            message: "Queue ticket created successfully",
            data: {
                ticket: ticketResult.rows[0],
                service: {
                    id: service.id,
                    name: service.name
                },
                peopleAhead: waitingCount,
                estimatedWaitMinutes
            }
        });
    } catch (error) {
        await client.query("ROLLBACK");
        next(error);
    } finally {
        client.release();
    }
});

module.exports = router;