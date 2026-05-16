import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState('')

  async function fetchNotifications() {
    try {
      const response = await fetch('http://localhost:3000/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  async function addNotification() {
    if (!title.trim()) {
      return
    }

    try {
      await fetch('http://localhost:3000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      setTitle('')
      fetchNotifications()
    } catch (error) {
      console.error('Failed to add notification:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="app">
      <h1>Notification System</h1>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter notification title"
        />
        <button type="button" onClick={addNotification}>
          Add
        </button>
      </div>
      <div className="notifications-list">
        {notifications.map((item) => (
          <div key={item.id} className="notification-item">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
