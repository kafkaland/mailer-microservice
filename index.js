const kafka = require('kafka-node');

/**
 * Init kafka consumer
 */

const consumer = new kafka.Consumer(
  new kafka.Client(),
  [
    {topic: 'user.registration'},
    {topic: 'order.creation'}
  ],
  {autoCommit: true}
);

/**
 * Init kafka producer
 */

const producer = new kafka.Producer(new kafka.Client());

/**
 * Fire in the hole!
 */

consumer.on('message', (message)=> {

  const actions = {
    'user.registration': function () {
      return 'User has been registered: ' + message.value;
    },
    'order.creation': function () {
      return 'Order has been created: ' + message.value;
    }
  };

  producer.send([{
    topic: 'email',
    messages: [actions[message.topic]()]
  }], function (err) {
    if (err) console.log(err);
  });

});

