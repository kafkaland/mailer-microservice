const kafka = require('kafka-node');
const assert = require('assert');
require('pretty-error').start();

const producer = new kafka.Producer(new kafka.Client());
let consumer;


describe('Integration Tests', ()=> {

  before(function () {
    consumer = new kafka.Consumer(new kafka.Client(), [{topic: 'email'}], {autoCommit: true});
  });

  after(function (done) {
    consumer.close(done);
  });

  before(function (done) {
    producer.on('ready', () => {
      producer.createTopics(['user.registration', 'order.creation', 'email'], () => {
        require('./index'); // start flow when topic is created
        done();
      });
    })
  });


  it('should publish a new Email when `user.registration` events is consumed', (done)=> {

    // arrange & assert
    consumer.once('message', function (message) {

      // assert.equal(message.value, 'User has been registered: Old MacDonald');
      // assert.equal(message.value, 'Order has been created: had a farm');
      done();
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
