const { Worker } = require('worker_threads');

const getArray = () => {
  const arr = [];
  for (let i = 1; i < 300000; i++) {
    arr.push(i);
  }
  return arr;
}
const sum = getArray() / 8;
console.log(sum)
const compute = (array) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: {
        array,
      }
    });
    worker.on('message', (msg) => {
      console.log(worker.threadId);
      resolve(msg);
    });

    worker.on('error', (err) => {
      reject(err);
    });

    worker.on('exit', () => {
      console.log('Completed');
    });
  })
};

const main = async () => {
  try {
    performance.mark('start');
    const result = await compute(getArray());
    console.log(result.length)
    performance.mark('end');
    performance.measure('main', 'start', 'end');
    console.log(performance.getEntriesByName('main').pop());
  } catch (e) {
    console.error(e.message);
  }
}

main();
