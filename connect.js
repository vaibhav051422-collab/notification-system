import amp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();


async function connect() {
    try {
        const connection = await amp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queue = 'notifications';

        // If queue does not exist, create it.
        await channel.assertQueue(queue, { durable: false });

        console.log('Successfully connected to RabbitMQ!');
        return { connection, channel, queue };
    }
    catch (error) {
        console.error('Connection failed:', error);
    }
}

connect();