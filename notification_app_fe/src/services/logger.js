import axios from 'axios';

const LOG_URL = 'http://4.224.186.213/evaluation-service/logs';
const LOG_TOKEN = 'your_access_token_here';

export async function logEvent(level, stack, message) {
  if (!LOG_TOKEN || LOG_TOKEN === 'your_access_token_here') {
    return;
  }

  try {
    await axios.post(
      LOG_URL,
      {
        stack,
        level,
        package: 'frontend',
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${LOG_TOKEN}`,
        },
      },
    );
  } catch (error) {
    console.error('Frontend logging failed:', error.message);
  }
}
