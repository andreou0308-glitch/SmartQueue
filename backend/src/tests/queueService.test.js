const {
    formatTicketNumber,
    calculateEstimatedWait
} = require("../services/queueService");

describe("Queue Service", () => {
    describe("formatTicketNumber", () => {
        test("formats a ticket number with leading zeros", () => {
            expect(formatTicketNumber("A", 1)).toBe("A001");
            expect(formatTicketNumber("B", 25)).toBe("B025");
            expect(formatTicketNumber("C", 125)).toBe("C125");
        });

        test("normalizes the service code", () => {
            expect(formatTicketNumber(" a ", 7)).toBe("A007");
        });

        test("rejects an empty service code", () => {
            expect(() => formatTicketNumber("", 1))
                .toThrow("Service code is required");
        });

        test("rejects an invalid daily number", () => {
            expect(() => formatTicketNumber("A", 0))
                .toThrow("Daily number must be a positive integer");

            expect(() => formatTicketNumber("A", 1.5))
                .toThrow("Daily number must be a positive integer");
        });
    });

    describe("calculateEstimatedWait", () => {
        test("calculates the estimated waiting time", () => {
            expect(calculateEstimatedWait(4, 10)).toBe(40);
            expect(calculateEstimatedWait(0, 10)).toBe(0);
        });

        test("rejects invalid values", () => {
            expect(() => calculateEstimatedWait(-1, 10))
                .toThrow(
                    "People ahead must be a non-negative integer"
                );

            expect(() => calculateEstimatedWait(2, 0))
                .toThrow(
                    "Average service minutes must be positive"
                );
        });
    });
});