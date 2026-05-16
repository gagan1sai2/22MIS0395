# Notification System Design

This system provides a full-stack notification platform with a Node.js logging middleware, an Express.js backend REST API, and a React frontend built with Vite. The architecture separates concerns into three folders: `logging_middleware` for logging utilities, `notification_app_be` for backend services, and `notification_app_fe` for the user interface. The backend serves notification data and the frontend consumes it, while the middleware logs requests and events across the system.
