// Mock API service layer with simulated delays

import {
  mockProjects,
  mockTasks,
  mockInvoices,
  mockClients,
  mockTeamMembers,
  mockActivity,
  mockAnalytics,
} from '../data/mockData'

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Projects API
export const getProjects = async (filters = {}) => {
  await delay(600)
  let projects = [...mockProjects]

  if (filters.status) {
    projects = projects.filter(p => p.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    projects = projects.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.client.toLowerCase().includes(searchLower)
    )
  }

  return { data: projects, success: true }
}

export const getProject = async (id) => {
  await delay(500)
  const project = mockProjects.find(p => p.id === id)
  if (!project) {
    throw new Error('Project not found')
  }
  return { data: project, success: true }
}

export const getProjectTasks = async (projectId) => {
  await delay(400)
  const tasks = mockTasks[projectId] || []
  return { data: tasks, success: true }
}

export const updateTaskStatus = async (projectId, taskId, status) => {
  await delay(800)
  const tasks = mockTasks[projectId] || []
  const task = tasks.find(t => t.id === taskId)
  if (task) {
    task.status = status
  }
  return { data: task, success: true }
}

export const completeProject = async (projectId) => {
  await delay(1000)
  const project = mockProjects.find(p => p.id === projectId)
  if (project) {
    project.status = 'completed'
    project.progress = 100
  }
  return { data: project, success: true }
}

// Invoices API
export const getInvoices = async (filters = {}, page = 1, pageSize = 10) => {
  await delay(700)
  let invoices = [...mockInvoices]

  if (filters.status) {
    invoices = invoices.filter(i => i.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    invoices = invoices.filter(
      i =>
        i.invoiceNumber.toLowerCase().includes(searchLower) ||
        i.client.toLowerCase().includes(searchLower)
    )
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = invoices.slice(start, end)

  return {
    data: paginated,
    pagination: {
      page,
      pageSize,
      total: invoices.length,
      totalPages: Math.ceil(invoices.length / pageSize),
    },
    success: true,
  }
}

export const getClients = async () => {
  await delay(400)
  return { data: mockClients, success: true }
}

export const createInvoice = async (invoiceData) => {
  await delay(1000)
  const newInvoice = {
    id: `inv${mockInvoices.length + 1}`,
    invoiceNumber: `INV-2026-${String(mockInvoices.length + 1).padStart(3, '0')}`,
    ...invoiceData,
    status: 'pending',
    issueDate: new Date().toISOString().split('T')[0],
  }
  mockInvoices.unshift(newInvoice)
  return { data: newInvoice, success: true }
}

// Analytics API
export const getAnalyticsData = async (dateRange) => {
  await delay(800)
  return { data: mockAnalytics, success: true }
}

// Team API
export const getTeamMembers = async () => {
  await delay(500)
  return { data: mockTeamMembers, success: true }
}

export const inviteTeamMember = async (memberData) => {
  await delay(1000)
  const newMember = {
    id: `tm${mockTeamMembers.length + 1}`,
    ...memberData,
    avatar: memberData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase(),
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
  }
  mockTeamMembers.push(newMember)
  return { data: newMember, success: true }
}

export const updateTeamMember = async (memberId, updates) => {
  await delay(700)
  const member = mockTeamMembers.find(m => m.id === memberId)
  if (member) {
    Object.assign(member, updates)
  }
  return { data: member, success: true }
}

// Dashboard API
export const getDashboardData = async () => {
  await delay(800)
  const activeProjects = mockProjects.filter(p => p.status === 'active').length
  const pendingInvoices = mockInvoices.filter(i => i.status === 'pending').length
  const totalRevenue = mockInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0)

  return {
    data: {
      revenue: totalRevenue,
      activeProjects,
      pendingInvoices,
      teamMembers: mockTeamMembers.filter(m => m.status === 'active').length,
      recentActivity: mockActivity.slice(0, 5),
      revenueTrend: mockAnalytics.revenue.slice(-6),
    },
    success: true,
  }
}

// Settings API
export const updateSettings = async (settings) => {
  await delay(1000)
  return { data: settings, success: true }
}
