const config = require('./env.config.js');

exports.options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Process Monitor",
      version: "1.0.0",
      description:
        "A Process Monitor service that exhibits ReST API interface, uses asyncronous threads, fetch system process informations and store it in a persistence layer.",
      contact: {
        name: "Nicola Moro",
        email: "nikimoro@gmail.com"
      }
    }
  },
  apis: [
    './jobs/models/jobs.model.js',
    './jobs/controllers/job.controller.js'
  ]
};