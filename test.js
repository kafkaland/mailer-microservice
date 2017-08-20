const kafka = require('kafka-node');
const assert = require('assert');
require('pretty-error').start();

const producer = new kafka.Producer(new kafka.Client());
const consumer = new kafka.Consumer(new kafka.Client(),
  [{topic: 'email'}], {autoCommit: true});


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
    consumer.once('message', function (message) {
      assert.equal(message.value, 'User has been registered: Old MacDonald');
      done();
    });

    // act
    var message = [{topic: 'user.registration', messages: ['Old MacDonald']}];
    producer.send(message, (err)=> {
      if (err) console.log(err);
    });

  })

});
