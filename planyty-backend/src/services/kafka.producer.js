const { producer } = require('../config/kafka');

const sendKafkaMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            ...message,
            timestamp: new Date().toISOString(),
            service: 'planyty-backend',
            environment: process.env.NODE_ENV
          })
        }
      ]
    });
    console.log(`📤 Kafka message sent to ${topic}:`, message.type || 'event');
    return true;
  } catch (error) {
    console.error(`❌ Error sending Kafka message to ${topic}:`, error);
    return false;
  }
};

// User events
const sendUserEvent = async (eventType, userData, metadata = {}) => {
  return sendKafkaMessage('user-events', {
    type: eventType,
    userId: userData.id,
    email: userData.email,
    role: userData.role,
    ...metadata
  });
};

// Project events
const sendProjectEvent = async (eventType, projectData, userId, metadata = {}) => {
  return sendKafkaMessage('project-events', {
    type: eventType,
    projectId: projectData.id,
    projectName: projectData.name,
    userId,
    ...metadata
  });
};

// Task events
const sendTaskEvent = async (eventType, taskData, userId, metadata = {}) => {
  return sendKafkaMessage('task-events', {
    type: eventType,
    taskId: taskData.id,
    taskTitle: taskData.title,
    projectId: taskData.project_id,
    userId,
    ...metadata
  });
};

// Invitation events
const sendInvitationEvent = async (eventType, invitationData, metadata = {}) => {
  return sendKafkaMessage('invitation-events', {
    type: eventType,
    invitationId: invitationData.id,
    email: invitationData.email,
    role: invitationData.role,
    invitedBy: invitationData.invited_by,
    ...metadata
  });
};

// Email notifications (for async email sending)
const sendEmailNotification = async (emailType, toEmail, data, metadata = {}) => {
  return sendKafkaMessage('email-notifications', {
    type: emailType,
    to: toEmail,
    data,
    ...metadata
  });
};

// Activity logs
const sendActivityLog = async (userId, action, resourceType, resourceId, details = {}) => {
  return sendKafkaMessage('activity-logs', {
    userId,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date().toISOString()
  });
};

// System alerts
const sendSystemAlert = async (alertType, severity, message, metadata = {}) => {
  return sendKafkaMessage('system-alerts', {
    type: alertType,
    severity, // 'info', 'warning', 'error', 'critical'
    message,
    ...metadata
  });
};

module.exports = {
  sendKafkaMessage,
  sendUserEvent,
  sendProjectEvent,
  sendTaskEvent,
  sendInvitationEvent,
  sendEmailNotification,
  sendActivityLog,
  sendSystemAlert
};