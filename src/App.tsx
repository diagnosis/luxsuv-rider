import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useToast } from './components/ui/Toast'

// Pages
import { Landing } from './pages/Landing'
import { VerifyEmail } from './pages/VerifyEmail'
import { Login } from './pages/Login'
import { RiderBookings } from './pages/RiderBookings'
import { GuestAccess } from './pages/GuestAccess'
import { GuestBookings } from './pages/GuestBookings'
import { GuestBookingDetailPage } from './pages/GuestBookingDetail'

function App() {
  const { ToastContainer } = useToast()

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<RiderBookings />} />
          <Route path="/guest/access" element={<GuestAccess />} />
          <Route path="/guest/bookings" element={<GuestBookings />} />
          <Route path="/guest/bookings/:id" element={<GuestBookingDetailPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App