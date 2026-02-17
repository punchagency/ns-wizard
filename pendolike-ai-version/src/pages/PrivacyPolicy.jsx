import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react'

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        'Account Information: When you create an account, we collect your name, email address, and company information.',
        'Usage Data: We collect information about how you interact with our services, including pages visited, features used, and time spent.',
        'Project Data: All project, invoice, and team data you create and store within FlowPilot.',
        'Payment Information: We use secure third-party payment processors. We do not store your full credit card details.',
        'Cookies and Tracking: We use cookies and similar technologies to improve your experience and analyze usage patterns.',
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our services',
        'To process transactions and send invoices',
        'To send you updates, security alerts, and support messages',
        'To improve our services and develop new features',
        'To detect and prevent fraud or abuse',
        'To comply with legal obligations',
      ],
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your data, including encryption in transit and at rest.',
        'Access to your data is restricted to authorized personnel only.',
        'We regularly review and update our security practices.',
        'While we strive to protect your data, no method of transmission over the internet is 100% secure.',
      ],
    },
    {
      icon: Eye,
      title: 'Your Rights',
      content: [
        'Access: You can access and download your data at any time.',
        'Correction: You can update or correct your information through your account settings.',
        'Deletion: You can request deletion of your account and data, subject to legal retention requirements.',
        'Data Portability: You can export your data in standard formats.',
        'Opt-out: You can opt out of marketing communications while still receiving essential service updates.',
      ],
    },
  ]

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" className="mb-6 flex items-center justify-center">
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Shield className="text-primary-600" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> February 17, 2026
          </p>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">
              At FlowPilot, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our project and finance management 
              platform. Please read this policy carefully to understand our practices regarding your data.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-primary-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3 mt-4">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="text-gray-700 flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your data only in the following circumstances:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">With your explicit consent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">With service providers who assist in operating our platform (under strict confidentiality agreements)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">When required by law or to protect our rights</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">In connection with a business transfer (merger, acquisition, etc.)</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700">
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700">
            FlowPilot is not intended for users under the age of 18. We do not knowingly collect personal 
            information from children. If you believe we have collected information from a child, please 
            contact us immediately.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Posting the new Privacy Policy on this page</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Updating the "Last Updated" date</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Sending you an email notification for material changes</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-md p-8 mt-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-primary-100 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> privacy@flowpilot.com</p>
            <p><strong>Address:</strong> 123 Business Street, San Francisco, CA 94105, United States</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
