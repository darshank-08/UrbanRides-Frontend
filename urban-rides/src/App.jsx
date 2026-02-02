import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Renter from './pages/Renter.jsx'
import Owner from './pages/Owner.jsx'
import CarDetails from './pages/CarDetails.jsx'
import UPI from './pages/DummyUPI.jsx' 
import BookingBill from './pages/Bill.jsx'
import AddCar from './pages/AddCar.jsx'
import UpdateCar from './pages/UpdateCar.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Owner/Profile" element={<ProfilePage />} />

        {/* Renter Routes */}
        <Route path="/Renter" element={<Renter />} />
        <Route path="/cars/:carId" element={<CarDetails />} />
        <Route path="/UPI" element={<UPI />} />
        <Route path="/Bill" element={<BookingBill />} />

        {/* Owner Routes */}
        <Route path="/Owner" element={<Owner />} />
        <Route path="/Owner/Add-Cars" element={<AddCar />} />
        <Route path="/Owner/Update-Car/:id" element={<UpdateCar />} />

      </Routes>
    </Router>
  )
}

export default App

