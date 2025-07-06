const amqp = require('amqplib');
const AuthUser = require('../models/AuthUser');

async function startAuthConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange('user', 'topic', { durable: true });

    // ─── Queue para user.registered ──────────────
    const registerQueue = 'user.registered.auth';
    await channel.assertQueue(registerQueue, { durable: true });
    await channel.bindQueue(registerQueue, 'user', 'user.registered');

    // ─── Queue para user.role.updated ─────────────
    const roleUpdateQueue = 'user.role.updated.auth';
    await channel.assertQueue(roleUpdateQueue, { durable: true });
    await channel.bindQueue(roleUpdateQueue, 'user', 'user.role.updated');

    console.log('📥 [AUTH] Escuchando eventos user.registered y user.role.updated...');

    // ─── CONSUMIDOR: user.registered ─────────────
    channel.consume(registerQueue, async (msg) => {
      try {
        const message = JSON.parse(msg.content.toString());
        const { id, name, email, password, role } = message.data;

        if (!id || !name || !email || !password || !role) {
          console.warn('⚠️ [AUTH] Evento user.registered malformado:', message);
          return channel.ack(msg);
        }

        const exists = await AuthUser.findOne({ email });
        if (exists) {
          console.warn('⚠️ [AUTH] Usuario ya existe:', email);
          return channel.ack(msg);
        }

        await AuthUser.create({ _id: id, name, email, password, role });
        console.log('✅ [AUTH] Usuario guardado en authdb con rol:', role);
      } catch (err) {
        console.error('❌ [AUTH] Error procesando user.registered:', err.message);
      } finally {
        channel.ack(msg);
      }
    });

    // ─── CONSUMIDOR: user.role.updated ────────────
    channel.consume(roleUpdateQueue, async (msg) => {
      try {
        const message = JSON.parse(msg.content.toString());
        const { userId, newRole } = message;

        if (!userId || !newRole) {
          console.warn('⚠️ [AUTH] Evento user.role.updated malformado:', message);
          return channel.ack(msg);
        }

        await AuthUser.findByIdAndUpdate(userId, { role: newRole });
        console.log(`🔄 [AUTH] Rol actualizado a '${newRole}' para el usuario ${userId}`);
      } catch (err) {
        console.error('❌ [AUTH] Error procesando user.role.updated:', err.message);
      } finally {
        channel.ack(msg);
      }
    });

  } catch (error) {
    console.error('❌ Error al iniciar consumidor AUTH:', error.message);
  }
}

module.exports = { startAuthConsumer };
