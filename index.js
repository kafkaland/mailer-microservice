const kafka = require('kafka-node');

const IN_TOPICS = [
  {topic: 'user.registration'},
  {topic: 'order.creation'}
];
const OUT_TOPIC = 'email';

/**
 * IN: kafka consumer
 */

const consumer = new kafka.Consumer(
  new kafka.Client(),
  IN_TOPICS,
  {autoCommit: true}
);

/**
 * OUT: kafka producer
 */

const producer = new kafka.Producer(new kafka.Client());

/**
 * I'm in Position
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
    topic: OUT_TOPIC,
    messages: [actions[message.topic]()]
  }], function (err) {
    if (err) console.log(err);
  });

});

