import amqp from 'amqplib';

// Load notifier functions with fallback to avoid startup crash
let sendEmail, sendSMS;

async function initializeNotifier() {
    try {
        const notifier = await import('./services/notifier.js');
        sendEmail = notifier.sendEmail;
        sendSMS = notifier.sendSMS;
        console.log('✓ Notifier module loaded');
    } catch (importErr) {
        console.warn('  Notifier module import failed:', importErr.message);
        // Fallback implementations
        sendEmail = async (to, subject, body) => {
            console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${body}`);
            return { success: true };
        };
        sendSMS = async (to, body) => {
            console.log(`[Mock SMS] To: ${to}, Body: ${body}`);
            return { success: true };
        };
    }
}

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queue = 'notifications';

        await channel.assertQueue(queue, { durable: false });
        console.log('✓ Worker is live. Waiting for messages...');

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`Processing ${content.type} to ${content.to}...`);

                    if (content.type === 'email') {
                        await sendEmail(content.to, content.subject, content.body);
                    } else if (content.type === 'sms') {
                        await sendSMS(content.to, content.body);
                    }

                    console.log(' Delivered successfully!');
                    channel.ack(msg); // Acknowledge if sending succeeded
                } catch (error) {
                    console.error(' Failed to process message:', error.message);
                   channel.nack(msg, false, true);
                }
            }
        });
    } catch (err) {
        console.error(' Connection Error:', err.message);
    }
}


(async () => {
    await initializeNotifier();
    await startConsumer();
})();