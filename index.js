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
  const payload = JSON.parse(message.value);

  const actions = {
    'user.registration': function () {
      return {
        to: payload.email,
        subject: 'Welcome aboard!',
        text: 'nice to meet you'
      }
    },
    'order.creation': function () {
      return {
        to: payload.email,
        subject: 'New Order',
        text: 'Congrats!'
      }
    }
  };

  producer.send([{
    topic: OUT_TOPIC,
    messages: JSON.stringify(actions[message.topic]())
  }], function (err) {
    if (err) console.log(err);
  });

});

