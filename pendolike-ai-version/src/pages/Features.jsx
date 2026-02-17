import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import {
  FolderKanban,
  FileText,
  BarChart3,
  Users,
  Bell,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

const Features = () => {
  const mainFeatures = [
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Organize and track all your projects in one place. Set deadlines, assign tasks, and monitor progress with intuitive dashboards.',
      details: [
        'Visual project boards',
        'Task assignment and tracking',
        'Progress monitoring',
        'Deadline management',
      ],
    },
    {
      icon: FileText,
      title: 'Invoice Management',
      description: 'Create professional invoices, track payments, and manage your finances effortlessly.',
      details: [
        'Professional invoice templates',
        'Payment tracking',
        'Automated reminders',
        'Multi-currency support',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Make data-driven decisions with comprehensive analytics and customizable reports.',
      details: [
        'Revenue trends',
        'Project performance metrics',
        'Custom report builder',
        'Export to PDF/Excel',
      ],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team. Manage roles, permissions, and collaboration.',
      details: [
        'Role-based access control',
        'Team member management',
        'Activity feeds',
        'Real-time notifications',
      ],
    },
  ]

  const additionalFeatures = [
    { icon: Bell, title: 'Smart Notifications', description: 'Stay updated with real-time alerts' },
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-level encryption and security' },
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: Clock, title: 'Time Tracking', description: 'Track time spent on projects' },
  ]

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage projects, finances, and teams effectively.
          </p>
        </motion.div>

        <div className="space-y-24 mb-24">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 h-64 flex items-center justify-center">
                  <Icon className="text-primary-600 opacity-50" size={120} />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Try FlowPilot today and see how it can transform your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-50">
                Try Demo
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 bg-transparent flex items-center justify-center">
                Get Started
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Features
