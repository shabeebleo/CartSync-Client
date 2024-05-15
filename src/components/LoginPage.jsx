import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../utils/getCookie";
import { selectCartItems,initializeCartAfterLogin } from "../slice/cartSlice";

function LoginForm() {
  // const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const tokenFromCookie = getCookie("token");
    console.log(tokenFromCookie, "tokenFromCookie");
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
    } else {
      navigate("/");
    }
  }, []);

  axios.defaults.withCredentials = true;
  // console.log(token, "tooookkkeeenn");
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(email, password);
      const response = await axios.post("http://localhost:5050/users/login", {
        email,
        password,
      });

      console.log(response, "responsee from loginnn");
      response.data.user.token = token;
      console.log("userdata:", response.data.user);
      const userData = response?.data?.user;
      if (response.status === 200) {
        // login successful
        dispatch(setUser(userData));
        console.log("kkkkkkkkkkkkkkkkkkkk");
        dispatch(initializeCartAfterLogin(userData?.cartitems));
        alert("User Logged successfully!");
        console.log("userData: after login", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        console.log("user afteeeeer immediate set",user);
        console.log(userData?.cartitems);
        let currentCartItems = userData?.cartitems;
        console.log(currentCartItems, "currentCartItemscurrentCartItems");
        localStorage.setItem("cartItems", JSON.stringify(currentCartItems));
        const cartString = localStorage.getItem("cartItems");

        const cart = JSON.parse(cartString);
        // dispatch(initializeCartAfterLogin(cart));
        console.log("cart  afteeeeer immediate set",cart);
        navigate("/homePage");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      alert("incorrect username or password");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto my-[10%]">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
            required
          />
        </div>
        <div className="flex justify-around">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
