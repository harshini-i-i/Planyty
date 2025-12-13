const { consumer } = require('../config/kafka');

const startKafkaConsumer = async () => {
  try {
    if (!consumer.connect) {
      console.log('⚠️  Skipping Kafka consumer (mock mode)');
      return;
    }

    await consumer.connect();
    console.log('✅ Kafka consumer connected');

    // Subscribe to topics
    await consumer.subscribe({ 
      topics: [
        'user-events',
        'project-events', 
        'task-events',
        'invitation-events',
        'email-notifications',
        'activity-logs'
      ],
      fromBeginning: false
    });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value.toString());
          console.log(`📥 Kafka message from ${topic}:`, value.type || 'event');
        } catch (error) {
          console.error(`❌ Error processing message from ${topic}:`, error);
        }
      }
    });

    console.log('✅ Kafka consumer started successfully');
  } catch (error) {
    console.error('⚠️  Kafka consumer failed:', error.message);
    // Don't throw error, just log it
  }
};

module.exports = { startKafkaConsumer };
