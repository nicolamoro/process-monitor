const {workerData, parentPort} = require('worker_threads');
const pidusage = require('pidusage');

const id = workerData.id;
const pid = workerData.pid;
const refreshInterval = workerData.refreshInterval;
const totalRunTime = workerData.totalRunTime;
const startUnixTime = workerData.startUnixTime;

console.log(`Starting worker ${id} at ${startUnixTime}`);

const handler = function() {
  const currentUnixTime = Math.floor(Date.now() / 1000);

  if (currentUnixTime > startUnixTime + totalRunTime) {
    console.log(`Job ${id} expired at ${currentUnixTime}`);
    parentPort.postMessage({
      action: 'delete',
      id: id,
    });

    pidusage.clear();
    return;
  }

  pidusage(pid, (err, stats) => {
    if (stats === undefined) {
      console.log(`Process ${pid} has been killed at ${currentUnixTime}`);
      parentPort.postMessage({
        action: 'delete',
        id: id,
      });

      pidusage.clear();
      return;
    }

    console.log(`Process ${pid} need refresh at ${currentUnixTime}`);
    parentPort.postMessage({
      action: 'update',
      id: id,
      totalProcessorTime: Math.floor(stats.ctime * 1000),
      memoryConsumption: Math.floor(stats.memory / 1048576),
      lastRefreshUnixTime: currentUnixTime,
    });

    setTimeout(handler, refreshInterval * 1000);
  });
};

handler();
