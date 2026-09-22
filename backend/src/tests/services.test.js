jest.mock("../config/database", () => ({
    query: jest.fn()
}));

const request = require("supertest");

const pool = require("../config/database");
const app = require("../app");

describe("Services API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /api/services returns active services", async () => {
        pool.query.mockResolvedValue({
            rows: [
                {
                    id: "1",
                    name: "Γενική Εξυπηρέτηση",
                    code: "A",
                    description: "Γενικές πληροφορίες",
                    average_service_minutes: 10
                }
            ]
        });

        const response = await request(app).get("/api/services");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].code).toBe("A");
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test("GET /api/services returns 500 when database fails", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        pool.query.mockRejectedValue(
            new Error("Database unavailable")
        );

        const response = await request(app).get("/api/services");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "Internal server error"
        });

        consoleErrorSpy.mockRestore();
    });
});