import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

const Topbar = () => {
  const location = useLocation()
  
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path.startsWith('/projects')) return 'Projects'
    if (path.startsWith('/invoices')) return 'Invoices'
    if (path === '/analytics') return 'Analytics'
    if (path === '/team') return 'Team'
    if (path === '/settings') return 'Settings'
    return 'FlowPilot'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
        
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
          <span className="text-primary-700 font-semibold text-sm">SC</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
