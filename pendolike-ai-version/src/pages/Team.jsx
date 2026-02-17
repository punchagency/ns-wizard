import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { getTeamMembers, inviteTeamMember, updateTeamMember } from '../services/api'
import { format } from 'date-fns'
import { UserPlus, Mail } from 'lucide-react'

const Team = () => {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'viewer',
  })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
      setLoading(true)
      const response = await getTeamMembers()
      setMembers(response.data)
    } catch (error) {
      showToast('Failed to load team members', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    
    if (!inviteForm.name || !inviteForm.email) {
      showToast('Please fill in all fields', 'error')
      return
    }

    try {
      setSubmitting(true)
      await inviteTeamMember(inviteForm)
      showToast('Team member invited successfully!', 'success')
      setInviteModalOpen(false)
      setInviteForm({ name: '', email: '', role: 'viewer' })
      loadTeam()
    } catch (error) {
      showToast('Failed to invite team member', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateTeamMember(memberId, { status: newStatus })
      setMembers(members.map(m => m.id === memberId ? { ...m, status: newStatus } : m))
      showToast(`Member ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success')
    } catch (error) {
      showToast('Failed to update member status', 'error')
    }
  }

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateTeamMember(memberId, { role: newRole })
      setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m))
      showToast('Role updated successfully', 'success')
    } catch (error) {
      showToast('Failed to update role', 'error')
    }
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'danger',
      manager: 'info',
      viewer: 'default',
    }
    return <Badge variant={variants[role]}>{role}</Badge>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team</h2>
          <p className="text-gray-600 mt-1">Manage your team members and permissions</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <UserPlus size={18} className="mr-2" />
          Invite Member
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-semibold">{member.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{member.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role</span>
                    <Select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'viewer', label: 'Viewer' },
                      ]}
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                        {member.status}
                      </Badge>
                      <button
                        onClick={() => handleToggleStatus(member.id, member.status)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          member.status === 'active' ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            member.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Joined {format(new Date(member.joinDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Name"
            value={inviteForm.name}
            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email"
            type="email"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
          <Select
            label="Role"
            value={inviteForm.role}
            onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Invite'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}

export default Team
