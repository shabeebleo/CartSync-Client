import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginPage";
import Register from "./components/RegisterPage";
import Home from "./components/HomePage";
import CartPage from "./components/CartPage";
import OrderPage from "./components/OrderPage";
import UserList from "./components/Admin/UserList";
import UserCart from "./components/Admin/UserCart";




export default function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login  />} />
      <Route path="/register" element={<Register  />} />
      <Route path="/homePage" element={<Home />} />
      <Route path="/cartPage" element={<CartPage />} />
      <Route path="/orderPage" element={<OrderPage />} />
      <Route path="/admin/userList" element={<UserList />} />
      <Route path="/admin/userCart" element={<UserCart />} />
    </Routes>
  </Router>
  )
}
