import amqp from 'amqplib';

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queue = 'notifications';

        await channel.assertQueue(queue, { durable: false });
        console.log('Waiting for messages in queue:', queue);

        channel.consume(queue, (msg) => {
            if (msg === null) {
                return;
            }

            try {
                const content = JSON.parse(msg.content.toString());

                console.log('[Consumer] Received a new request:');
                console.log(`- Type: ${String(content.type || '').toUpperCase()}`);
                console.log(`- To: ${content.to}`);
                console.log(`- Message: ${content.body}`);

                // Message processed successfully, acknowledge it and delete from the queue
                channel.ack(msg);
            }
            catch (error) {
                console.error('Failed to process message:', error);
                channel.ack(msg, false, false);
            }
        });
    }
    catch (error) {
        console.error('Failed to start consumer:', error);
    }
}

startConsumer();