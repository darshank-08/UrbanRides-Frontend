import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Renter from './pages/Renter.jsx'
import CarDetails from './pages/CarDetails.jsx'
import UPI from './pages/DummyUPI.jsx' 
import BookingBill from './pages/Bill.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Renter" element={<Renter />} />
        <Route path="/cars/:carId" element={<CarDetails />} />
        <Route path="/UPI" element={<UPI />} />
        <Route path="/Bill" element={<BookingBill />} />
      </Routes>
    </Router>
  )
}

export default App

