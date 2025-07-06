// src/events/publisher.js
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  // ✅ Declarar exchange tipo topic
  await channel.assertExchange('user', 'topic', { durable: true });
}

function publishUserRegisteredEvent(user) {
  if (!channel) {
    throw new Error('RabbitMQ channel no inicializado');
  }

  const payload = {
    type: 'user.registered',
    data: {
      id: user._id.toString(),  // importante si tu consumer necesita el ID
      name: user.name,
      email: user.email,
      password: user.password, // hashed
      role: user.role,
      timestamp: new Date().toISOString()
    }
  };

  // ✅ Publicar en el exchange con routing key
  channel.publish(
    'user',
    'user.registered',
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  console.log('📤 Evento publicado:', payload);
}

module.exports = { connectRabbitMQ, publishUserRegisteredEvent };
