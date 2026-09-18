const request = require("supertest");

const app = require("../app");

describe("SmartQueue API", () => {
    test("GET /api/health returns API status", async () => {
        const response = await request(app).get("/api/health");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            message: "SmartQueue API is running"
        });
    });

    test("Unknown route returns 404", async () => {
        const response = await request(app).get("/api/unknown");

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            status: "error",
            message: "Route not found"
        });
    });
});