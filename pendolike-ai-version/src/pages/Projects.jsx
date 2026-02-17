import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { CardSkeleton } from '../components/ui/LoadingSkeleton'
import EmptyState from '../components/ui/EmptyState'
import { getProjects } from '../services/api'
import { format } from 'date-fns'
import { Search, Eye } from 'lucide-react'

const Projects = () => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({ status: '', search: '' })
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [filters])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await getProjects(filters)
      setProjects(response.data)
    } catch (error) {
      showToast('Failed to load projects', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'info',
      archived: 'default',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const ProjectCard = ({ project }) => (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.client}</p>
        </div>
        {getStatusBadge(project.status)}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-primary-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
        <span className="font-semibold">${(project.budget / 1000).toFixed(0)}k</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <Eye size={16} className="mr-2" />
        View Details
      </Button>
    </Card>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Manage and track all your projects</p>
        </div>
        <Button onClick={() => showToast('Create project feature coming soon', 'info')}>
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'archived', label: 'Archived' },
          ]}
          className="sm:w-48"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Get started by creating your first project"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Projects
