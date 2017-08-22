const kafka = require('kafka-node');
const assert = require('assert');
require('pretty-error').start();

const producer = new kafka.Producer(new kafka.Client());
let consumer;

describe('Integration Tests', ()=> {

  before(function (done) {
    producer.on('ready', () => {
      producer.createTopics(['user.registration', 'order.creation', 'email'], () => {

        // start the flow when topics are created
        require('./index');

        // create a consumer when topics are created
        consumer = new kafka.Consumer(new kafka.Client(), [{topic: 'email'}]);
        done();
      });
    })
  });

  after(done => consumer.close(done));
  after(done => producer.close(done));

  it('should work like a boss', (done)=> {

    // arrange & assert
    let arr = [];
    consumer.on('message', function (message) {
      arr.push(JSON.parse(message.value).to);

      if (arr.length == 2) {
        assert.deepEqual(arr.sort(), ['one@localhost', 'two@localhost']);
        consumer.commit(done);
      }
    });

    // act
    var messages = [
      {topic: 'user.registration', messages: JSON.stringify({email: 'one@localhost', name: 'Old MacDonald'})},
      {topic: 'order.creation', messages: JSON.stringify({email: 'two@localhost', amount: 10})},
    ];
    producer.send(messages, (err)=> {
      if (err) console.log(err);
    });

  });

});
