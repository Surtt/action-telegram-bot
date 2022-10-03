const {parentPort, workerData} = require('worker_threads');

const compute = ({ array }) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 3 === 0) {
      result.push(array[i]);
    }
  }
  return result;
};

parentPort.postMessage(compute(workerData))
