const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const serviceRoutes = require("./routes/serviceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/services", serviceRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/api/health", (request, response) => {
    response.status(200).json({
        status: "success",
        message: "SmartQueue API is running"
    });
});
app.get("/api/health/database", async (request, response) => {
    try {
        const result = await pool.query(
            "SELECT CURRENT_DATABASE() AS database_name"
        );

        response.status(200).json({
            status: "success",
            message: "Database connection is working",
            database: result.rows[0].database_name
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});
app.use("/api/services", serviceRoutes);

app.use((request, response) => {
    response.status(404).json({
        status: "error",
        message: "Route not found"
    });
});
app.use((error, request, response, next) => {
    console.error("Unhandled error:", error.message);

    response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});

module.exports = app;