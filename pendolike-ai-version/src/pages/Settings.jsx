import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { updateSettings } from '../services/api'

const Settings = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Sarah Chen',
    email: 'sarah@flowpilot.com',
    phone: '+1 (555) 123-4567',
    bio: 'Product manager and team lead',
  })
  const [company, setCompany] = useState({
    name: 'FlowPilot Inc.',
    address: '123 Business St, San Francisco, CA 94105',
    taxId: '12-3456789',
    website: 'https://flowpilot.com',
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReports: true,
    darkMode: false,
  })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateSettings({ profile })
      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      showToast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateSettings({ company })
      showToast('Company information updated successfully!', 'success')
    } catch (error) {
      showToast('Failed to update company information', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    try {
      await updateSettings({ preferences: newPreferences })
      showToast('Preferences updated', 'success')
    } catch (error) {
      showToast('Failed to update preferences', 'error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <Input
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
          <Textarea
            label="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
        <form onSubmit={handleCompanySubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
          />
          <Textarea
            label="Address"
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax ID"
              value={company.taxId}
              onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
            />
            <Input
              label="Website"
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Company Info'}
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates about your projects</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-600">Get weekly summary reports via email</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('weeklyReports', !preferences.weeklyReports)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.weeklyReports ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.darkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Settings
