import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Users, Target, Award, ArrowRight } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe in empowering teams to achieve their goals through better tools and processes.',
    },
    {
      icon: Users,
      title: 'Customer-First',
      description: 'Your success is our success. We listen, learn, and build what you need.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from design to customer support.',
    },
  ]

  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', avatar: 'SC' },
    { name: 'Mike Johnson', role: 'CTO', avatar: 'MJ' },
    { name: 'Alex Rivera', role: 'Head of Design', avatar: 'AR' },
    { name: 'Emma Wilson', role: 'Head of Product', avatar: 'EW' },
  ]

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About FlowPilot</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to help teams work smarter, not harder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                FlowPilot was born from frustration. As a small team managing multiple projects
                and clients, we found ourselves juggling spreadsheets, email threads, and
                disconnected tools. There had to be a better way.
              </p>
              <p className="mb-4">
                In 2024, we set out to build a platform that would bring everything together—
                project management, invoicing, analytics, and team collaboration—all in one
                beautiful, intuitive interface.
              </p>
              <p>
                Today, FlowPilot helps thousands of teams streamline their workflow, save time,
                and focus on what matters most: delivering great work.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-700 font-bold text-2xl">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
          <p className="text-xl text-primary-100 mb-8">
            Experience the difference FlowPilot can make for your team.
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

export default About
