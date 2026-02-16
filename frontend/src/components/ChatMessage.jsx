import './ChatMessage.css'

function ChatMessage({ message }) {
  const isUser = message.type === 'user'
  const isLoading = message.isLoading
  const isError = message.isError

  const formatContent = (content) => {
    if (!content) return ''
    
    // Decode HTML entities first
    const decodeHtml = (html) => {
      const textarea = document.createElement('textarea')
      textarea.innerHTML = html
      return textarea.value
    }
    
    // Convert markdown to HTML and decode entities
    let processedContent = content
      .replace(/&lt;strong&gt;/g, '<strong>')
      .replace(/&lt;\/strong&gt;/g, '</strong>')
      .replace(/&lt;em&gt;/g, '<em>')
      .replace(/&lt;\/em&gt;/g, '</em>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Parse content and convert to natural-looking HTML
    const lines = processedContent.split('\n')
    const elements = []
    let currentParagraph = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      // Handle headers - make them subtle, not too prominent
      if (trimmed.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p 
              key={`para-${index}`} 
              className="message-text"
              dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }}
            />
          )
          currentParagraph = []
        }
        const headerText = trimmed.replace(/^###\s+/, '').replace(/<[^>]*>/g, '')
        elements.push(<h4 key={`header-${index}`} className="message-subtitle">{headerText}</h4>)
        return
      }
      
      // Handle numbered steps - support both markdown and HTML formats
      const stepMatchMarkdown = trimmed.match(/^(\d+)\.\s+<strong>(.+?)<\/strong>:\s*(.+)/)
      const stepMatchPlain = trimmed.match(/^(\d+)\.\s+(.+?):\s*(.+)/)
      const stepMatch = stepMatchMarkdown || stepMatchPlain
      
      if (stepMatch) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p 
              key={`para-${index}`} 
              className="message-text"
              dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }}
            />
          )
          currentParagraph = []
        }
        const [, stepNum, actionRaw, details] = stepMatch
        // Extract text from HTML tags if present
        const action = actionRaw.replace(/<[^>]*>/g, '')
        const detailsHtml = details || ''
        
        elements.push(
          <div key={`step-${index}`} className="message-step-item">
            <span className="step-number">{stepNum}</span>
            <div className="step-content">
              <span className="step-action">{action}</span>
              {detailsHtml && (
                <span 
                  className="step-details"
                  dangerouslySetInnerHTML={{ __html: detailsHtml }}
                />
              )}
            </div>
          </div>
        )
        return
      }
      
      // Handle bullet points - make them subtle
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p 
              key={`para-${index}`} 
              className="message-text"
              dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }}
            />
          )
          currentParagraph = []
        }
        const bulletText = trimmed.replace(/^[-*]\s+/, '')
        elements.push(
          <div key={`bullet-${index}`} className="message-bullet">
            <span className="bullet-point">•</span>
            <span dangerouslySetInnerHTML={{ __html: bulletText }} />
          </div>
        )
        return
      }
      
      // Handle regular text
      if (trimmed) {
        currentParagraph.push(trimmed)
      } else {
        // Empty line - end current paragraph
        if (currentParagraph.length > 0) {
          elements.push(
            <p 
              key={`para-${index}`} 
              className="message-text"
              dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }}
            />
          )
          currentParagraph = []
        }
      }
    })
    
    // Add any remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p 
          key="para-final" 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }}
        />
      )
    }
    
    return elements.length > 0 ? elements : (
      <p 
        className="message-text"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    )
  }

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'} ${isError ? 'message-error' : ''}`}>
      {!isUser && (
        <div className="message-avatar">
          {isLoading ? '✨' : '💡'}
        </div>
      )}
      <div className="message-content">
        {isLoading ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="message-text-content">
            {formatContent(message.content)}
          </div>
        )}
        <div className="message-timestamp">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {isUser && (
        <div className="message-avatar">
          👤
        </div>
      )}
    </div>
  )
}

export default ChatMessage
