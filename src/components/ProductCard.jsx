import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../slice/cartSlice";
import { getCookie } from "../utils/getCookie";
import { useSelector } from "react-redux";
import { selectCartItems } from "../slice/cartSlice";

function ProductCard({ product, onClick }) {
  const cartItems = useSelector(selectCartItems);
  console.log(cartItems, "cartItemscartItemscartItems in product cart");
  const [token, setToken] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity

  useEffect(() => {
    const tokenFromCookie = getCookie("token");
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (cartItems === undefined) {
      // Handle the case when cartItems are undefined
      // For example, fetch cart items again or display a loading state
      return;
    }
    // Update quantity based on cart items
    setQuantity(cartItems.length);
  }, [cartItems]);

  const dispatch = useDispatch();

  const handleAddToCart = (productId) => {
    if (cartItems && cartItems.length > 0) {
      const itemToUpdate = cartItems.find(
        (item) => item.productId === productId
      );
      if (itemToUpdate != null) {
        const updatedQuantity = itemToUpdate.quantity + 1;
        
        dispatch(
          addItemToCart({ productId, quantity: updatedQuantity, token })
        );
      } else {
        dispatch(addItemToCart({ productId, quantity, token }));
      }
    } else {
      let quantity=1
      dispatch(addItemToCart({ productId, quantity, token }));
    }
    onClick();
  };

  if (cartItems === undefined) {
    // Return null if cartItems are undefined to prevent rendering
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">
      <img
        src={product.image}
        alt={product.productName}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <p className="text-gray-600 mb-1 flex justify-center">
          {product.brand}
        </p>
        <p className="text-gray-800 text-sm mb-1 flex justify-center">
          ₹ {product.price}
        </p>
        <div className="flex justify-end">
          <button
            className="bg-orange-500 rounded-md px-3 py-1"
            onClick={() => handleAddToCart(product._id)}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
