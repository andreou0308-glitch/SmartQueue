const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (request, response) => {
    response.status(200).json({
        status: "success",
        message: "SmartQueue API is running"
    });
});

app.use((request, response) => {
    response.status(404).json({
        status: "error",
        message: "Route not found"
    });
});

module.exports = app;