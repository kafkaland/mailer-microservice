const kafka = require('kafka-node');
const assert = require('assert');
require('pretty-error').start();

const producer = new kafka.Producer(new kafka.Client());
const consumer = new kafka.Consumer(new kafka.Client(), [{topic: 'email'}], {autoCommit: true});

describe('Integration Tests', ()=> {

  before(function (done) {
    producer.on('ready', () => {
      producer.createTopics(['user.registration', 'order.creation', 'email'], () => {
        require('./index'); // start flow when topic is created
        done();
      });
    })
  });

  it('should work like a boss', (done)=> {

    // arrange & assert
    let arr = [];
    consumer.on('message', function (message) {
      arr.push(message.value);

      if (arr.length == 2) {
        assert.deepEqual(arr.sort(), ['Order has been created: had a farm', 'User has been registered: Old MacDonald']);
        consumer.close();
        producer.close();
        done();
      }

    });

    // act
    var message = [
      {topic: 'user.registration', messages: ['Old MacDonald']},
      {topic: 'order.creation', messages: ['had a farm']},
    ];
    producer.send(message, (err)=> {
      if (err) console.log(err);
    });

  });

});
