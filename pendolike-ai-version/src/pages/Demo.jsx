import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import {
  FolderKanban,
  FileText,
  BarChart3,
  Users,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  Circle,
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Demo = () => {
  const { showToast } = useToast()
  const [activeDemo, setActiveDemo] = useState('projects')
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const demoProjects = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'active',
      progress: 65,
      client: 'Acme Corp',
      dueDate: '2026-03-15',
    },
    {
      id: '2',
      name: 'Mobile App Development',
      status: 'active',
      progress: 40,
      client: 'TechStart Inc',
      dueDate: '2026-04-20',
    },
    {
      id: '3',
      name: 'E-commerce Platform',
      status: 'completed',
      progress: 100,
      client: 'RetailPro',
      dueDate: '2026-01-30',
    },
  ]

  const demoInvoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      client: 'Acme Corp',
      amount: 15000,
      status: 'paid',
      dueDate: '2026-01-31',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      client: 'TechStart Inc',
      amount: 25000,
      status: 'pending',
      dueDate: '2026-02-28',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2026-003',
      client: 'RetailPro',
      amount: 50000,
      status: 'paid',
      dueDate: '2026-01-20',
    },
  ]

  const demoTasks = [
    { id: 't1', title: 'Design mockups', status: 'completed', assignee: 'Sarah Chen' },
    { id: 't2', title: 'Frontend development', status: 'in-progress', assignee: 'Mike Johnson' },
    { id: 't3', title: 'Backend API setup', status: 'pending', assignee: 'Alex Rivera' },
  ]

  const revenueData = [
    { month: 'Aug', value: 45000 },
    { month: 'Sep', value: 52000 },
    { month: 'Oct', value: 48000 },
    { month: 'Nov', value: 61000 },
    { month: 'Dec', value: 58000 },
    { month: 'Jan', value: 67000 },
    { month: 'Feb', value: 72000 },
  ]

  const demos = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
  ]

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setProjectModalOpen(true)
  }

  const handleTaskStatusChange = (taskId, newStatus) => {
    showToast(`Task status updated to ${newStatus}`, 'success')
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'info',
      paid: 'success',
      pending: 'warning',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getTaskIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />
      case 'in-progress':
        return <Clock className="text-blue-500" size={20} />
      default:
        return <Circle className="text-gray-400" size={20} />
    }
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Interactive Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Try out FlowPilot's features. Click around and explore the interface!
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {demos.map((demo) => {
            const Icon = demo.icon
            return (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeDemo === demo.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={20} />
                {demo.label}
              </button>
            )
          })}
        </div>

        {/* Projects Demo */}
        {activeDemo === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
              <p className="text-gray-600">
                Manage and track all your projects. Click on any project to see details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoProjects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className="bg-primary-600 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>

            {selectedProject && (
              <Modal
                isOpen={projectModalOpen}
                onClose={() => setProjectModalOpen(false)}
                title={selectedProject.name}
                size="lg"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Client</p>
                        <p className="font-medium">{selectedProject.client}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        {getStatusBadge(selectedProject.status)}
                      </div>
                      <div>
                        <p className="text-gray-600">Progress</p>
                        <p className="font-medium">{selectedProject.progress}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-medium">
                          {new Date(selectedProject.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Tasks</h3>
                    <div className="space-y-3">
                      {demoTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                        >
                          {getTaskIcon(task.status)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.assignee}</p>
                          </div>
                          <Select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                            options={[
                              { value: 'pending', label: 'Pending' },
                              { value: 'in-progress', label: 'In Progress' },
                              { value: 'completed', label: 'Completed' },
                            ]}
                            className="w-40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </motion.div>
        )}

        {/* Invoices Demo */}
        {activeDemo === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoices</h2>
                  <p className="text-gray-600">
                    Create, track, and manage your invoices all in one place.
                  </p>
                </div>
                <Button onClick={() => setInvoiceModalOpen(true)}>
                  Create Invoice
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demoInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Modal
              isOpen={invoiceModalOpen}
              onClose={() => setInvoiceModalOpen(false)}
              title="Create Invoice"
            >
              <div className="space-y-4">
                <Input label="Client" placeholder="Select client" />
                <Input label="Amount" type="number" placeholder="0.00" />
                <Input label="Due Date" type="date" />
                <div className="flex gap-4 pt-4">
                  <Button onClick={() => {
                    showToast('Invoice created successfully!', 'success')
                    setInvoiceModalOpen(false)
                  }}>
                    Create Invoice
                  </Button>
                  <Button variant="outline" onClick={() => setInvoiceModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </motion.div>
        )}

        {/* Analytics Demo */}
        {activeDemo === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
              <p className="text-gray-600">
                Track your business performance with comprehensive analytics and reports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-2">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-2">Pending Invoices</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </Card>
            </div>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {/* Team Demo */}
        {activeDemo === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Team</h2>
                  <p className="text-gray-600">
                    Manage your team members, roles, and permissions.
                  </p>
                </div>
                <Button onClick={() => showToast('Invite feature demo', 'info')}>
                  Invite Member
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Chen', role: 'Admin', email: 'sarah@flowpilot.com', avatar: 'SC' },
                { name: 'Mike Johnson', role: 'Manager', email: 'mike@flowpilot.com', avatar: 'MJ' },
                { name: 'Alex Rivera', role: 'Manager', email: 'alex@flowpilot.com', avatar: 'AR' },
                { name: 'Emma Wilson', role: 'Viewer', email: 'emma@flowpilot.com', avatar: 'EW' },
              ].map((member) => (
                <Card key={member.email}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={member.role === 'Admin' ? 'danger' : 'info'}>
                      {member.role}
                    </Badge>
                    <button
                      onClick={() => showToast(`${member.name} status toggled`, 'success')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Experience the full power of FlowPilot with a free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-50 flex items-center justify-center">
                Start Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 bg-transparent">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Demo
