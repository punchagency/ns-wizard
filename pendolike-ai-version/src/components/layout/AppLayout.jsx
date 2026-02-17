import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
