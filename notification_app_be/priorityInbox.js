require('dotenv').config();
const axios = require('axios');
const { Log } = require('./middleware/logger');

// Priority weights for different notification types
const PRIORITY_WEIGHTS = {
  Placement: 30,
  Result: 20,
  Event: 10
};

// Calculate recency score based on how recently the notification was created
function calculateRecencyScore(createdAt) {
  const createdTime = new Date(createdAt);
  const currentTime = new Date();
  const hoursAgo = (currentTime - createdTime) / (1000 * 60 * 60);
  
  // Newer notifications get higher score, older than 48 hours get 0
  return Math.max(0, 48 - hoursAgo);
}

// Calculate total score combining priority and recency
function calculateTotalScore(notification) {
  const typeWeight = PRIORITY_WEIGHTS[notification.type] || 0;
  const recencyScore = calculateRecencyScore(notification.created_at);
  return typeWeight + recencyScore;
}

// Fetch and rank notifications by priority
async function fetchAndRankNotifications(token) {
  try {
    // Log the start of fetch operation
    Log('backend', 'info', 'priorityInbox', 'Fetching notifications for priority inbox', token);
    
    // Fetch notifications from the evaluation service
    const response = await axios.get(
      'http://4.224.186.213/evaluation-service/notifications',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Add score to each notification
    const notificationsWithScores = response.data.map(notification => ({
      ...notification,
      score: calculateTotalScore(notification)
    }));
    
    // Sort by score descending (highest priority first)
    const sortedNotifications = notificationsWithScores.sort((a, b) => b.score - a.score);
    
    // Log successful sorting
    Log('backend', 'info', 'priorityInbox', 'Priority inbox sorted successfully', token);
    
    // Return top 10 results
    return sortedNotifications.slice(0, 10);
  } catch (error) {
    // Log error
    Log('backend', 'error', 'priorityInbox', `Failed to fetch notifications: ${error.message}`, token);
    throw error;
  }
}

// Main execution
const token = process.env.TOKEN;

fetchAndRankNotifications(token)
  .then(topNotifications => {
    console.log('\n=== TOP 10 PRIORITY INBOX NOTIFICATIONS ===\n');
    topNotifications.forEach((notification, index) => {
      console.log(`${index + 1}. [Score: ${notification.score.toFixed(2)}] ${notification.type}`);
      console.log(`   Message: ${notification.message}`);
      console.log(`   ID: ${notification.id}`);
      console.log(`   Created: ${notification.created_at}`);
      console.log(`   Status: ${notification.is_read ? 'Read' : 'Unread'}\n`);
    });
  })
  .catch(error => {
    console.error('Error fetching priority inbox:', error.message);
  });
