const EventEmitter = require('events');

const myEmitter = new EventEmitter();

const logDbConnection = () => {
  console.log('DB connected');
}

myEmitter.addListener('connected', logDbConnection);
myEmitter.emit('connected');
