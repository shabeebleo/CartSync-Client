import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCartItems, updateQuantityInCart,deleteCartItem } from "../slice/cartSlice";
import { getCookie } from "../utils/getCookie";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  console.log("cartItems  :", cartItems);
  const [cartDetails, setCartDetails] = useState([]);
  const [token, setToken] = useState("");
  const [cart, setCart] = useState([]);
  // const [buttonClicked, setButtonClicked] = useState(false);
  console.log("cartDetails:..............", cartDetails);
  // console.log("cartttttttttttttttttt",cart)
  const totalPrice = cartDetails?.totalPrice;
  // console.log("totalPrice:", totalPrice);
  const dispatch = useDispatch();
  const [user, setUser] = useState("");

  // useEffect(() => {
  //   const cartString = localStorage.getItem("cartItems");
  //   const cart = JSON.parse(cartString);
  //   // console.log("useEffect when home page reloads",cart);
  //   console.log("cartcartcart IN USEFFECT", cart);
  //   // setCartDetails(cart);
  //   setCart(cart);
  // }, []); // Trigger the effect once on component mount to retrieve cart items from localStorage

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      console.log("cartItems: update when cart item changes", cartItems);
      const serializedCartItems = JSON.stringify(cartItems);
      console.log(serializedCartItems, "serializedCartItems in home pagee");
      localStorage.setItem("cartItems", serializedCartItems);
    }
    setCart(cart);
  }, [cartItems]); // Trigger the effect when cartItems change

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  const handleIncreaseQuantity = (productId, token) => {
    console.log(productId, "productId", token, "token");
    // Find the item with the given productId in the cartItems array
    const itemToUpdate = cartItems.find((item) => item.productId === productId);
    console.log(itemToUpdate, "itemToUpdate");
    // If the item exists and its quantity is greater than 1, decrease its quantity
    if (itemToUpdate) {
      const updatedQuantity = itemToUpdate.quantity + 1;
      // Dispatch the updateQuantityInCart action with the productId and updatedQuantity
      dispatch(
        updateQuantityInCart({ productId, quantity: updatedQuantity, token })
      );
    }

    // setButtonClicked((prev) => !prev);
  };

  const handleDecreaseQuantity = (productId, token) => {
    // console.log(productId, "productId", token, "token");
    // Find the item with the given productId in the cartItems array
    const itemToUpdate = cartItems.find((item) => item.productId === productId);
    // console.log(itemToUpdate, "itemToUpdate");
    // If the item exists and its quantity is greater than 1, decrease its quantity
    if (itemToUpdate && itemToUpdate.quantity > 1) {
      const updatedQuantity = itemToUpdate.quantity - 1;

      // Dispatch the updateQuantityInCart action with the productId and updatedQuantity

      dispatch(
        updateQuantityInCart({ productId, quantity: updatedQuantity, token })
      );
    }
    // setButtonClicked((prev) => !prev);
  };

  //delete item
  const handleDeleteItem = (productId, token, quantity) => {
    
    // console.log(productId, "productId", token, "token");
    // Find the item with the given productId in the cartItems array
    const itemToDelete = cartItems.find((item) => item.productId === productId);

    // console.log(itemToUpdate, "itemToUpdate");
    // If the item exists and its quantity is greater than 1, decrease its quantity
    // if (itemToUpdate && itemToUpdate.quantity > 1) {
    //   const updatedQuantity = itemToUpdate.quantity - 1;

    //   // Dispatch the updateQuantityInCart action with the productId and updatedQuantity

    // }
    if (itemToDelete) {
    console.log(productId, token, quantity);
      dispatch(
        deleteCartItem({ productId,token })
      );
    }

    // setButtonClicked((prev) => !prev);
  };



  //fetch product details and total price of cart

  useEffect(() => {
    const fetchCartDetails = async () => {
      console.log("fetchCartDetailsfetchCartDetails.......");
      try {
        const token = getCookie("token");
        setToken(token);
        const response = await axios.get("http://localhost:5050/users/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setCartDetails(response.data);

        return response;
      } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
      }
    };
    fetchCartDetails();
  }, [cartItems]);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    setUser(user);
  }, []);

  
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Your Shop
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.username}</span>
            <Link
              to="/cartPage"
              className="relative flex items-center justify-center text-gray-800"
            >
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
              <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartDetails?.cartDetails?.length}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="container flex justify-center align-super mx-auto py-8">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cartDetails?.cartDetails?.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b border-gray-200 py-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {item.productId.productName}
                  </p>
                  <p>{item.productId.brand}</p>
                  <p>{item.productId.description}</p>
                  <p>{item.productId.category}</p>
                  <p>Price: ₹{item.productId.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    handleIncreaseQuantity(item.productId._id, token)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
                >
                  +
                </button>
                <button
                  onClick={() =>
                    handleDecreaseQuantity(item.productId._id, token)
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    handleDeleteItem(item.productId._id, token, item.quantity)
                  }
                  className="px-3 ml-2 py-1 bg-gray-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-lg font-semibold">Total Price: ₹{totalPrice}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
