import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ArrowLeft, FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react'

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using FlowPilot, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
        'If you do not agree with any of these terms, you are prohibited from using or accessing this service.',
        'These terms apply to all users, including visitors, customers, and contributors to the service.',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Use License',
      content: [
        'Permission is granted to temporarily use FlowPilot for personal or commercial project and finance management.',
        'You may not modify or copy the materials, use them for any commercial purpose without explicit permission, or remove any copyright or proprietary notations.',
        'This license shall automatically terminate if you violate any of these restrictions.',
        'Upon termination, you must destroy any downloaded materials in your possession.',
      ],
    },
    {
      icon: AlertCircle,
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You are responsible for all activities that occur under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
      ],
    },
    {
      icon: Scale,
      title: 'Payment Terms',
      content: [
        'Subscription fees are billed in advance on a monthly or annual basis.',
        'All fees are non-refundable except as required by law or as explicitly stated in our refund policy.',
        'You authorize us to charge your payment method for all fees associated with your subscription.',
        'We reserve the right to change our pricing with 30 days notice to existing customers.',
        'Failure to pay may result in suspension or termination of your account.',
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
              <Scale className="text-primary-600" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> February 17, 2026
          </p>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service govern your access to and use of FlowPilot, our project and finance 
              management platform. Please read these terms carefully before using our service. By using 
              FlowPilot, you agree to comply with and be bound by these terms.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You agree not to use FlowPilot to:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Violate any applicable laws or regulations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Infringe upon the rights of others</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Transmit any malicious code, viruses, or harmful data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Attempt to gain unauthorized access to our systems</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Interfere with or disrupt the service or servers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Use the service for any illegal or unauthorized purpose</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The service and its original content, features, and functionality are owned by FlowPilot 
            and are protected by international copyright, trademark, patent, trade secret, and other 
            intellectual property laws.
          </p>
          <p className="text-gray-700">
            You retain ownership of all data you upload to FlowPilot. By using our service, you grant 
            us a license to use, store, and process your data solely for the purpose of providing the service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-4">
            FlowPilot is provided "as is" and "as available" without warranties of any kind, either 
            express or implied. We do not warrant that:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">The service will be uninterrupted or error-free</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Defects will be corrected</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">The service is free of viruses or other harmful components</span>
            </li>
          </ul>
          <p className="text-gray-700">
            We disclaim all warranties, express or implied, including but not limited to implied 
            warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            In no event shall FlowPilot, its directors, employees, or agents be liable for any indirect, 
            incidental, special, consequential, or punitive damages, including without limitation, loss of 
            profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Your use or inability to use the service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Any unauthorized access to or use of our servers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Any interruption or cessation of transmission to or from the service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">Any bugs, viruses, or other harmful code</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and access to the service immediately, without prior 
            notice or liability, for any reason, including if you breach these Terms of Service.
          </p>
          <p className="text-gray-700">
            Upon termination, your right to use the service will cease immediately. All provisions of 
            these terms that by their nature should survive termination shall survive, including ownership 
            provisions, warranty disclaimers, and limitations of liability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify or replace these Terms of Service at any time. If a revision 
            is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p className="text-gray-700">
            What constitutes a material change will be determined at our sole discretion. By continuing 
            to access or use our service after any revisions become effective, you agree to be bound by 
            the revised terms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
          <p className="text-gray-700">
            These Terms of Service shall be governed by and construed in accordance with the laws of 
            the State of California, United States, without regard to its conflict of law provisions. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction of 
            the courts located in San Francisco, California.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-md p-8 mt-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-primary-100 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> legal@flowpilot.com</p>
            <p><strong>Address:</strong> 123 Business Street, San Francisco, CA 94105, United States</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService
