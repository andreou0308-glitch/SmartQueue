const serviceRepository = require("../repositories/serviceRepository");

async function getActiveServices(request, response, next) {
    try {
        const services = await serviceRepository.findActiveServices();

        response.status(200).json({
            status: "success",
            data: services
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getActiveServices
};