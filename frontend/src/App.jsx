import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import InputArea from './components/InputArea'
import { sendMessage } from './services/api'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hey there! I can help you navigate websites and find what you're looking for. Just tell me what you need, and I'll walk you through it.",
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('https://www.nowsecure.com/')
  const messagesEndRef = useRef(null)
  const threadIdRef = useRef(`thread_${Date.now()}`)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Add typing indicator
    const typingId = Date.now() + 1
    setMessages(prev => [...prev, {
      id: typingId,
      type: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date()
    }])

    try {
      const response = await sendMessage({
        user_request: text,
        url: url,
        thread_id: threadIdRef.current
      })

      // Remove typing indicator and add actual response
      setMessages(prev => prev.filter(msg => msg.id !== typingId))
      
      const assistantMessage = {
        id: Date.now() + 2,
        type: 'assistant',
        content: response.result,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingId))
      
      const errorMessage = {
        id: Date.now() + 2,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check if the backend server is running.',
        isError: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <div className="header-icon">✨</div>
            <div>
              <h1>Wizard</h1>
              <p>Your Web Navigation Assistant</p>
            </div>
          </div>
          <div className="url-input-container">
            <label htmlFor="url-input">Website URL:</label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="url-input"
            />
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <InputArea onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}

export default App
