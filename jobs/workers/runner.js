const {Worker: WorkerThreads} = require('worker_threads');
const JobModel = require('../models/jobs.model.js');

const messageCallback = (message) => {
  if (message.action === 'delete') {
    JobModel.removeById(message.id)
        .then((result) => {
          console.log(`Job ${message.id} deleted`);
        });
  } else if (message.action === 'update') {
    JobModel.patchJob(message.id, {
      totalProcessorTime: message.totalProcessorTime,
      memoryConsumption: message.memoryConsumption,
      lastRefreshUnixTime: message.lastRefreshUnixTime,
    })
        .then((result) => {
          console.log(`Job ${message.id} updated`);
        });
  }
};

const errorCallback = (id, err) => {
  console.error(`Worker ${id} error: ${err}`);
};

const exitCallback = (id, code) => {
  console.log(`Worker ${id} exited with code: ${code}`);
};

exports.run = (param) => {
  const worker = new WorkerThreads('./jobs/workers/worker.js', {
    workerData: param,
  });
  worker.on('message', messageCallback);
  worker.on('error', (error) => {
    errorCallback(param.id, error);
  });
  worker.on('exit', (code) => {
    exitCallback(param.id, code);
  });
};

exports.restartAll = () => {
  console.log('Restarting suspended jobs');
  JobModel.listAll()
      .then((result) => {
        result.forEach((element) => {
          const id = String(element._id);
          const pid = element.pid;
          const refreshInterval = element.refreshInterval;
          const totalRunTime = element.totalRunTime;
          const startUnixTime = element.startUnixTime;

          console.log(`Restarting job ${id}`);
          this.run({
            id: id,
            pid: pid,
            refreshInterval: refreshInterval,
            totalRunTime: totalRunTime,
            startUnixTime: startUnixTime,
          });
        });
      });
};
