const request = require("supertest");
const app = require("../app");

describe("POST /api/tickets", () => {
    test("returns 400 when serviceId is missing", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe(
            "A valid serviceId is required"
        );
    });

    test("returns 400 when serviceId is invalid", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send({ serviceId: -1 });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
    });
});