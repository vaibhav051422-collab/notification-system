import amqp from 'amqplib';
async function sendNotification(data){
    try{
        const connection=await amqp.connect('amqp://localhost:5672');
        const channel=await connection.createChannel();
        const queue='notifications';
        await channel.assertQueue(queue,{durable:false});
        const message = JSON.stringify(data);
        channel.sendToQueue(queue, Buffer.from(message));
        console.log('Notification sent:', message);
        setTimeout(async () => {
            await channel.close();
            await connection.close();
        }, 500);

    }
    catch(error){
        console.error('Failed to send notification:', error);
    }
}
sendNotification({
    type: 'email',
    to: 'user@example.com',
    subject: 'Welcome!',
    body: 'Thanks for signing up for our Notification System.'
});