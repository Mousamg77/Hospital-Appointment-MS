import axios from 'axios'

const API = axios.create({
  // Empty baseURL uses Vite dev proxy (/api -> backend). Set VITE_API_URL for direct API access.
  baseURL: import.meta.env.VITE_API_URL ?? '',
})

API.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.startsWith('/api/auth/')
  if (!isAuthRoute) {
    const stored = localStorage.getItem('hospital_user')
    if (stored) {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth
export const register = (data) => API.post('/api/auth/register', data)
export const login = (data) => API.post('/api/auth/login', data)

// Doctors
export const getDoctors = () => API.get('/api/doctors')
export const getDoctorById = (id) => API.get(`/api/doctors/${id}`)

// Appointments
export const bookAppointment = (data) => API.post('/api/appointments', data)
export const getPatientAppointments = () => API.get('/api/appointments/patient')
export const getDoctorAppointments = () => API.get('/api/appointments/doctor')
export const updateAppointmentStatus = (id, data) => API.patch(`/api/appointments/${id}/status`, data)

// Prescriptions
export const addPrescription = (data) => API.post('/api/prescriptions', data)
export const getPrescription = (appointmentId) => API.get(`/api/prescriptions/${appointmentId}`)

// Admin
export const adminAddDoctor = (data) => API.post('/api/admin/doctors', data)
export const adminUpdateDoctor = (id, data) => API.put(`/api/admin/doctors/${id}`, data)
export const adminDeleteDoctor = (id) => API.delete(`/api/admin/doctors/${id}`)
export const adminGetAppointments = () => API.get('/api/admin/appointments')
