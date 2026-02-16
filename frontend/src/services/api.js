const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const sendMessage = async (data) => {
  const response = await fetch(`${API_BASE_URL}/walkthrough`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
