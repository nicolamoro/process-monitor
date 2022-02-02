const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

/**
 * @swagger
 *  components:
 *    schemas:
 *      JobCreateRequest:
 *        type: object
 *        required:
 *          - pid
 *          - refreshInterval
 *          - totalRunTime
 *        properties:
 *          pid:
 *            type: integer
 *            description: PID of the process to be monitored.
 *          refreshInterval:
 *            type: integer
 *            description: time interval (in seconds) between process monitoring. Must be between 1s and 60s.
 *        example:
 *          pid: 17
 *          refreshInterval: 2
 *          totalRunTime: 30
 *      JobCreateResponse:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: GUID of the monitoring job.
 *        example:
 *          id: 5e61079f70e21605208baff2
 *      JobReadResponse:
 *        type: object
 *        properties:
 *          memoryConsumption:
 *            type: integer
 *            description: memory consuption of the process (in MB).
 *          totalProcessorTime:
 *            type: integer
 *            description: total processor time (in milliseconds) used by process.
 *          lastRefreshUnixTime:
 *            type: integer
 *            description: last refresh time (Unix time) for the monitoring job data.
 *        example:
 *          memoryConsumption: 27
 *          totalProcessorTime: 1094000
 *          lastRefreshUnixTime: 1583417287
 */

const jobSchema = new Schema({
  pid: Number,
  refreshInterval: Number,
  totalRunTime: Number,
  memoryConsumption: Number,
  totalProcessorTime: Number,
  startUnixTime: Number,
  lastRefreshUnixTime: Number,
});

jobSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
jobSchema.set('toJSON', {
  virtuals: true,
});

jobSchema.findById = (cb) => {
  return this.model('Jobs').find({id: this.id}, cb);
};

const Job = mongoose.model('Jobs', jobSchema);

exports.findById = (id) => {
  return Job.findById(id)
      .then((result) => {
        if (!result) {
          return null;
        }

        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
      });
};

exports.createJob = (jobData) => {
  const job = new Job(jobData);
  return job.save();
};

exports.listPaged = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Job.find()
        .limit(perPage)
        .skip(perPage * page)
        .exec((err, jobs) => {
          if (err) {
            reject(err);
          } else {
            resolve(jobs);
          }
        });
  });
};

exports.listAll = () => {
  return new Promise((resolve, reject) => {
    Job.find()
        .exec((err, jobs) => {
          if (err) {
            reject(err);
          } else {
            resolve(jobs);
          }
        });
  });
};

exports.patchJob = (id, jobData) => {
  return new Promise((resolve, reject) => {
    Job.findById(id, (err, job) => {
      if (err) reject(err);
      for (const i in jobData) {
        if ({}.hasOwnProperty.call(jobData, i)) {
          job[i] = jobData[i];
        }
      }
      job.save((err, updatedJob) => {
        if (err) return reject(err);
        resolve(updatedJob);
      });
    });
  });
};

exports.removeById = (jobId) => {
  return new Promise((resolve, reject) => {
    Job.deleteOne({_id: jobId}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

exports.disconnect = () => {
  mongoose.disconnect();
};
