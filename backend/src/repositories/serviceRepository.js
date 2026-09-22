const pool = require("../config/database");

async function findActiveServices() {
    const result = await pool.query(`
        SELECT
            id,
            name,
            code,
            description,
            average_service_minutes
        FROM services
        WHERE is_active = TRUE
        ORDER BY name
    `);

    return result.rows;
}

module.exports = {
    findActiveServices
};