const JobController = require('./controllers/job.controller');

exports.routesConfig = (app) => {
  app.post('/jobs', [
    JobController.insert,
  ]);
  app.get('/jobs/:id', [
    JobController.getById,
  ]);
};
