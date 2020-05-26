import amqp = require('amqplib');

const queue: string = process.argv[2];

class Consumer {
    connection: any;
    channel: any;
    assertion: any;

    constructor() {
        console.log("Consumer constructed");
    }

    async connect_rabbitmq() {
        this.connection = await amqp.connect("amqp://127.0.0.1:5672");
        this.channel = await this.connection.createChannel();
        this.assertion = await this.channel.assertQueue(queue);

        this.channel.consume(queue, (message: any) => {
            const messageInfo = JSON.parse(message.content.toString());
            console.log("Received message! second is --> " + messageInfo.second);
            this.channel.ack(message);
        });
    }
}

let consumerInstance = new Consumer();
consumerInstance.connect_rabbitmq().then(() => {
    consumerInstance.listenChannel();
});