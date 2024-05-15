import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems } from "../slice/cartSlice";

import axios from "axios";
function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const cartItems = useSelector(selectCartItems);
  const [user, setUser] = useState("");
  // const [cart, setCart] = useState([]);
  const [itemNumber, setItemNumber] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  useEffect(() => {
    const cartString = localStorage.getItem("cartItems");
    const cart = JSON.parse(cartString);
    console.log("useEffect when home page reloads", cart);
    // setCart(cart);
    // console.log(cart,"carttttttttttt");
    setItemNumber(cart.length);
  }, []); // Trigger the effect once on component mount to retrieve cart items from localStorage

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    setUser(user);
    console.log("user:", user);
  }, []);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      console.log("cartItems: update when cart item changes", cartItems);
      const serializedCartItems = JSON.stringify(cartItems);
      console.log(serializedCartItems, "serializedCartItems in home pagee");
      localStorage.setItem("cartItems", serializedCartItems);
      // Update the cart state only if cartItems is defined
      // setCart(cartItems);
      setItemNumber(cartItems.length); // Update the item number
    }
  }, [cartItems, buttonClicked]); // trigger when button is clliked

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/users/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  const handleClicked = () => {
    console.log("button clicked from child");
    setButtonClicked(true);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Your Shop
          </Link>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* Username */}
            <span className="text-gray-600">Welcome, {user?.username}</span>

            {/* Cart */}
            <Link
              to="/cartPage"
              className="relative flex items-center justify-center text-gray-800"
            >
              {/* Cart icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19c0 1.104.896 2 2 2s2-.896 2-2M5 5h14l2 9H3l2-9zM9 14a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>

              {/* Cart item count */}
              <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemNumber}
              </span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="container flex justify-center  align-super mx-auto py-8">
        <div className="grid  grid-cols-2 mx-2  md:grid-cols-3 lg:grid-cols-4 gap-6 w-[100%]">
          {products.map((product) => (
            <ProductCard
              onClick={handleClicked}
              cartItems={cartItems}
              key={product?._id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
