const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { connectKafka } = require('./src/config/kafka');
const { startKafkaConsumer } = require('./src/services/kafka.consumer');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to Database
    await connectDB();
    console.log('✅ Database connected successfully');

    // Try to connect to Kafka (won't fail if it doesn't work)
    const kafka = await connectKafka();
    console.log(kafka.producer.send ? '✅ Kafka ready' : '⚠️  Using mock Kafka');

    // Try to start Kafka consumer (won't fail)
    try {
      await startKafkaConsumer();
    } catch (consumerError) {
      console.log('⚠️  Kafka consumer failed:', consumerError.message);
    }

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📁 MySQL: localhost:3307`);
      console.log(`🔗 Kafka: localhost:9092`);
      console.log(`📈 Kafka UI: http://localhost:9000`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
