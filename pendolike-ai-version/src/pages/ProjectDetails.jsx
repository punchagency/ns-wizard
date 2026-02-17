import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/ToastProvider'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Select from '../components/ui/Select'
import { getProject, getProjectTasks, updateTaskStatus, completeProject } from '../services/api'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      const [projectRes, tasksRes] = await Promise.all([
        getProject(id),
        getProjectTasks(id),
      ])
      setProject(projectRes.data)
      setTasks(tasksRes.data)
    } catch (error) {
      showToast('Failed to load project', 'error')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      setUpdating(true)
      await updateTaskStatus(id, taskId, newStatus)
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      showToast('Task updated successfully', 'success')
    } catch (error) {
      showToast('Failed to update task', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteProject = async () => {
    try {
      setUpdating(true)
      await completeProject(id)
      setProject({ ...project, status: 'completed', progress: 100 })
      showToast('Project marked as completed!', 'success')
    } catch (error) {
      showToast('Failed to complete project', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const getTaskIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" size={20} />
      case 'in-progress':
        return <Clock className="text-blue-500" size={20} />
      default:
        return <Circle className="text-gray-400" size={20} />
    }
  }

  if (loading) {
    return <div className="space-y-6">Loading...</div>
  }

  if (!project) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Button variant="ghost" onClick={() => navigate('/projects')}>
        <ArrowLeft size={18} className="mr-2" />
        Back to Projects
      </Button>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <Badge variant={project.status === 'active' ? 'success' : 'info'}>
                {project.status}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-gray-900">{project.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {format(new Date(project.dueDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">
                  ${(project.budget / 1000).toFixed(0)}k
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-semibold text-gray-900">{project.progress}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              className="bg-primary-600 h-3 rounded-full"
            />
          </div>
        </div>

        {project.status === 'active' && (
          <Button onClick={handleCompleteProject} disabled={updating}>
            Mark as Completed
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Feed</h2>
          <div className="space-y-4">
            {[
              { action: 'Project created', user: 'Sarah Chen', time: '2 days ago' },
              { action: 'Task added', user: 'Mike Johnson', time: '1 day ago' },
              { action: 'Status updated', user: 'Alex Rivera', time: '5 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default ProjectDetails
