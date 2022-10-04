const notifier = require('node-notifier');

const timer = process.argv[2];

setTimeout(() => notifier.notify({
  message: 'Таймер сработал!',
  sound: true,
}), timer);
