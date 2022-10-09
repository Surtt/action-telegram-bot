const EventEmitter = require('events');

const myEmitter = new EventEmitter();

let firstNum = process.argv[2];
let secondNum = process.argv[3];
const operation = process.argv[4];

myEmitter.on('add', (a, b) => {
  const firstNum = parseFloat(a);
  const secondNum = parseFloat(b);
  myEmitter.emit('result', console.log(firstNum + secondNum));
});

myEmitter.on('multiply', (a, b) => {
  const firstNum = parseFloat(a);
  const secondNum = parseFloat(b);
  myEmitter.emit('result', console.log(firstNum * secondNum));
});

myEmitter.on('subtraction', (a, b) => {
  const firstNum = parseFloat(a);
  const secondNum = parseFloat(b);
  myEmitter.emit('result', console.log(firstNum - secondNum));
});

myEmitter.on('division', (a, b) => {
  const firstNum = parseFloat(a);
  const secondNum = parseFloat(b);
  myEmitter.emit('result', console.log(firstNum / secondNum));
});

myEmitter.emit(operation, firstNum, secondNum);
myEmitter.on('result', (result) => result);
