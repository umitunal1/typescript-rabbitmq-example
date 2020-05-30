import amqp = require('amqplib');

const queue: string = process.argv[2]

class Publisher {
    message: { second: number } = {
        "second": +queue
    };
    connection: any;
    channel: any;
    assertion: any;

    constructor() {
    }

    async connect_rabbitmq() {
        this.connection = await amqp.connect("amqp://127.0.0.1:5672");
        this.channel = await this.connection.createChannel();
        this.assertion = await this.channel.assertQueue(queue);

        return new Promise((resolve: any) => { resolve(true) });
    }

    sendMessage() {
        setInterval(()=>{
            let dateTime = new Date();           
            this.message.second = dateTime.getUTCSeconds();
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(this.message)));
            console.log("Message has been sent! Second is -->" + this.message.second);
        },1000);        
    }
}

let publisherInstance = new Publisher();
publisherInstance.connect_rabbitmq().then(() => {
    publisherInstance.sendMessage();
});

