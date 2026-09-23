const request = require("supertest");
const app = require("../app");

describe("POST /api/queue/call-next", () => {
    test("returns 400 when serviceId is missing", async () => {
        const response = await request(app)
            .post("/api/queue/call-next")
            .send({ counterId: 1 });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe(
            "A valid serviceId is required"
        );
    });

    test("returns 400 when counterId is missing", async () => {
        const response = await request(app)
            .post("/api/queue/call-next")
            .send({ serviceId: 1 });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe(
            "A valid counterId is required"
        );
    });
    test("returns 400 when ticketId is invalid", async () => {
    const response = await request(app)
        .patch("/api/queue/tickets/invalid/complete");

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe(
        "A valid ticketId is required"
    );
});
});