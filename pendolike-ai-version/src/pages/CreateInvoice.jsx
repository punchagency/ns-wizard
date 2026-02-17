import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { getClients, createInvoice } from '../services/api'
import { ArrowLeft } from 'lucide-react'

const CreateInvoice = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    dueDate: '',
    description: '',
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await getClients()
      setClients(response.data)
    } catch (error) {
      showToast('Failed to load clients', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.client || !formData.amount || !formData.dueDate) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    try {
      setLoading(true)
      await createInvoice({
        ...formData,
        amount: parseFloat(formData.amount),
      })
      showToast('Invoice created successfully!', 'success')
      setTimeout(() => {
        navigate('/invoices')
      }, 1000)
    } catch (error) {
      showToast('Failed to create invoice', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl"
    >
      <Button variant="ghost" onClick={() => navigate('/invoices')}>
        <ArrowLeft size={18} className="mr-2" />
        Back to Invoices
      </Button>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            options={clientOptions}
            placeholder="Select a client"
            required
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Invoice description or notes..."
            rows={4}
          />

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Invoice'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default CreateInvoice
