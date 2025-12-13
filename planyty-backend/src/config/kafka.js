const { Kafka } = require('kafkajs');
require('dotenv').config();

let kafka, producer, consumer;

try {
  kafka = new Kafka({
    clientId: process.env.CLIENT_ID || 'planyty-backend',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    connectionTimeout: 5000, // 5 seconds timeout
    requestTimeout: 10000,
    retry: {
      initialRetryTime: 300,
      retries: 5
    }
  });

  producer = kafka.producer();
  consumer = kafka.consumer({ 
    groupId: 'planyty-consumer-group',
    sessionTimeout: 30000
  });
  
  console.log('✅ Kafka client initialized');
} catch (error) {
  console.warn('⚠️  Kafka initialization error:', error.message);
  // Create mock objects if initialization fails
  producer = { 
    send: async () => { 
      console.log('Mock Kafka: Message sent');
      return true;
    },
    connect: async () => console.log('Mock Kafka: Connected'),
    disconnect: async () => console.log('Mock Kafka: Disconnected')
  };
  consumer = {
    connect: async () => console.log('Mock Kafka consumer: Connected'),
    disconnect: async () => console.log('Mock Kafka consumer: Disconnected'),
    subscribe: async () => console.log('Mock Kafka: Subscribed'),
    run: async () => console.log('Mock Kafka: Consumer running')
  };
}

const connectKafka = async () => {
  try {
    if (!producer.connect) {
      console.log('⚠️  Using mock Kafka (initialization failed)');
      return { producer, consumer };
    }
    
    await producer.connect();
    console.log('✅ Kafka producer connected successfully');
    
    return { producer, consumer };
  } catch (error) {
    console.warn('⚠️  Kafka connection failed:', error.message);
    console.log('⚠️  Continuing with mock Kafka');
    
    // Return mock objects
    return {
      producer: { 
        send: async () => { 
          console.log('Mock Kafka: Message sent');
          return true;
        },
        connect: async () => {},
        disconnect: async () => {}
      },
      consumer: {
        connect: async () => {},
        disconnect: async () => {},
        subscribe: async () => {},
        run: async () => {}
      }
    };
  }
};

module.exports = { 
  kafka: kafka || {}, 
  producer, 
  consumer, 
  connectKafka 
};
