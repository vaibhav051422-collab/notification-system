# Notification Service (RabbitMQ + Email/SMS)

A simple Node.js notification pipeline using RabbitMQ.

- `producer.js` publishes notification jobs to the `notifications` queue.
- `consumer.js` consumes jobs and dispatches them through email or SMS.
- `services/notifier.js` handles providers:
  - Email via Nodemailer (Gmail transport)
  - SMS via Twilio

## Project Structure

- `connect.js` - basic RabbitMQ connection check and queue assertion
- `producer.js` - sends test notification messages to queue
- `consumer.js` - worker that processes queue messages
- `services/notifier.js` - email and SMS sender functions

## Prerequisites

- Node.js 18+
- RabbitMQ running locally or remotely
- Gmail credentials (for email)
- Twilio account (for SMS)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
RABBITMQ_URL=amqp://localhost:5672

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1xxxxxxxxxx
```

Notes:
- Use a Gmail App Password if 2FA is enabled.
- `consumer.js` has mock fallbacks if `services/notifier.js` fails to import, but real sends still require valid env values.

## Run the Service

1. Verify RabbitMQ connection:

```bash
node connect.js
```

2. Start the consumer worker (keep this terminal open):

```bash
node consumer.js
```

3. In another terminal, publish a test notification:

```bash
node producer.js
```

## Message Format

Email message example:

```json
{
  "type": "email",
  "to": "user@example.com",
  "subject": "Welcome!",
  "body": "Thanks for signing up for our Notification System."
}
```

SMS message example:

```json
{
  "type": "sms",
  "to": "+15551234567",
  "body": "Your verification code is 123456"
}
```

## Troubleshooting

- RabbitMQ connection errors:
  - Ensure RabbitMQ is running and `RABBITMQ_URL` is correct.
- Email send failures:
  - Verify Gmail credentials and app password.
- Twilio send failures:
  - Check SID/token/phone number and account SMS permissions.

## Dependencies

- `amqplib`
- `dotenv`
- `nodemailer`
- `twilio`
