const JobModel = require('../models/jobs.model.js');
const pidusage = require('pidusage');
const JobsRunner = require('../workers/runner.js');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management.
 */

/**
 * @swagger
 * path:
 *  /jobs/:
 *    post:
 *      summary: Create a new monitoring job.
 *      tags: [Jobs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobCreateRequest'
 *      responses:
 *        "201":
 *          description: Monitoring job has been created. Return the guid og the new job.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/JobCreateResponse'
 *        "400":
 *          description: If input parameters are invalid, or PID is not found.
 */

exports.insert = (req, res) => {
  const pid = req.body.pid;
  const refreshInterval = req.body.refreshInterval;
  const totalRunTime = req.body.totalRunTime;

  if (pid === undefined ||
    refreshInterval === undefined ||
    totalRunTime === undefined) {
    res.status(400).send('Invalid input parameters');
    return;
  }

  if (refreshInterval > 60 || refreshInterval <= 0) {
    res.status(400).send('Value for Refresh Interval must be between 0 and 60 seconds');
    return;
  }

  if (totalRunTime > 3600 || totalRunTime <= 0) {
    res.status(400).send('Value for Total Run Time must be between 0 and 3600 seconds');
    return;
  }

  pidusage(pid, (err, stats) => {
    if (stats === undefined) {
      res.status(400).send('PID not found');
      return;
    }

    JobModel.createJob({
      pid: pid,
      refreshInterval: refreshInterval,
      totalRunTime: totalRunTime,
      memoryConsumption: Math.floor(stats.memory / 1048576),
      totalProcessorTime: Math.floor(stats.ctime * 1000),
      startUnixTime: Math.floor(Date.now() / 1000),
      lastRefreshUnixTime: Math.floor(Date.now() / 1000),
    })
        .then((result) => {
          const id = String(result._id);
          res.status(201).send({id: id});
          JobsRunner.run({
            id: id,
            pid: pid,
            refreshInterval: refreshInterval,
            totalRunTime: totalRunTime,
            startUnixTime: Math.floor(Date.now() / 1000),
          });
        });
  });
};

/**
 * @swagger
 * path:
 *  /jobs/{jobGuid}:
 *    get:
 *      summary: Get last data of a monitoring job by guid.
 *      tags: [Jobs]
 *      parameters:
 *        - in: path
 *          name: jobGuid
 *          schema:
 *            type: string
 *          required: true
 *          description: Guid of the monitoring job.
 *      responses:
 *        "200":
 *          description: Return last monitoring job data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/JobReadResponse'
 *        "404":
 *          description: Job guid is not found.
 */

exports.getById = (req, res) => {
  JobModel.findById(req.params.id)
      .then((result) => {
        if (!result) {
          res.status(404).send('GUID not found');
        } else {
          delete result.pid;
          delete result.refreshInterval;
          delete result.totalRunTime;
          delete result.startUnixTime;
          delete result.id;
          res.status(200).send(result);
        }
      });
};
