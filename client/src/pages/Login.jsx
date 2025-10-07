import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add this import
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  // console.log("Backend URL:", backendUrl); // Add this line for debugging

  const [state, setState] = React.useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(error.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-white">
      <img
        src={assets.logo}
        alt="website logo"
        className="absolute left-5 sm:left-20 top-5 w-28 smw-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubitHandler}>
          {/* Name Input */}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img
                src={assets.person_icon}
                alt="Input Icon"
                className="w-5 [filter:invert(100%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(100%)_contrast(100%)]"
              />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none text-white"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          {/* Email Input  */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.email}
              alt="Email Icon"
              className="w-5 [filter:invert(100%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(100%)_contrast(100%)]"
            />
            <input
              type="email"
              placeholder="Email Id"
              required
              className="bg-transparent outline-none text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password Input  */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.lock_closed}
              alt="Lock Icon"
              className="w-5 [filter:invert(100%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(100%)_contrast(100%)]"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none text-white"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget Password?
          </p>
          <button
            disabled={isLoading}
            className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900"
          >
            {isLoading ? "Please wait..." : state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Loing here
            </span>
          </p>
        ) : (
          <p
            onClick={() => setState("Sign Up")}
            className="text-gray-400 text-center text-xs mt-4"
          >
            Don't have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline">
              Sign Up
            </span>
          </p>
        )}
      </div>
    </main>
  );
};

export default Login;
