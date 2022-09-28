let nodePath = process.argv[0];
let appPath = process.argv[1];
let firstNum = process.argv[2];
let secondNum = process.argv[3];
const operation = process.argv[4];

switch (operation) {
  case 'add': {
    const add = require('./add.js');
    add(firstNum, secondNum);
    break;
  }
  case 'multiply': {
    const multiply = require('./multiply.js');
    multiply(firstNum, secondNum);
    break;
  }
  case 'subtraction': {
    const subtraction = require('./subtraction.js');
    subtraction(firstNum, secondNum);
    break;
  }
  case 'division': {
    const division = require('./division.js');
    division(firstNum, secondNum);
    break;
  }
  default:
    return operation;
}
