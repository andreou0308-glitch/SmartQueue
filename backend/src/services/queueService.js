function formatTicketNumber(serviceCode, dailyNumber) {
    if (
        typeof serviceCode !== "string" ||
        serviceCode.trim() === ""
    ) {
        throw new Error("Service code is required");
    }

    if (
        !Number.isInteger(dailyNumber) ||
        dailyNumber <= 0
    ) {
        throw new Error("Daily number must be a positive integer");
    }

    const formattedNumber = String(dailyNumber).padStart(3, "0");

    return `${serviceCode.trim().toUpperCase()}${formattedNumber}`;
}

function calculateEstimatedWait(
    peopleAhead,
    averageServiceMinutes
) {
    if (
        !Number.isInteger(peopleAhead) ||
        peopleAhead < 0
    ) {
        throw new Error(
            "People ahead must be a non-negative integer"
        );
    }

    if (
        !Number.isFinite(averageServiceMinutes) ||
        averageServiceMinutes <= 0
    ) {
        throw new Error(
            "Average service minutes must be positive"
        );
    }

    return peopleAhead * averageServiceMinutes;
}

module.exports = {
    formatTicketNumber,
    calculateEstimatedWait
};