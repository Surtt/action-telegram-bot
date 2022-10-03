const getArray = () => {
  const arr = [];
  for (let i = 1; i < 300000; i++) {
    arr.push(i);
  }
  return arr;
}

const compute = (array) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 3 === 0) {
      result.push(array[i]);
    }
  }
  return result;
};

const main = () => {
  performance.mark('start');
  const res = compute(getArray());
  console.log(res.length);
  performance.mark('end');
  performance.measure('main', 'start', 'end');
  console.log(performance.getEntriesByName('main').pop());
}

main();

