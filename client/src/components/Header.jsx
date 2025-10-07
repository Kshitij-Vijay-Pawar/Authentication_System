import { useContext } from "react"; // Add this import
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // Fix the context import

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext); // Use AppContext instead of AppContent

  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-20">
      <img src={assets.robot} alt="image of robot " className="w-1/3 mr-8" />
      <h2 className="text-3xl font-medium pt-4">
        Hey {userData ? userData.name : "Developer"}👋🏻
      </h2>
      <h1 className="text-4xl font-extrabold p-2">Welcome to our app</h1>
      <p>Let's start with a quick product tour and we will have you up and </p>
      <p> running in no time!</p>
      <button
        onClick={() => navigate("/login")}
        className="border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all mt-6 cursor-pointer"
      >
        Get Started
      </button>
    </main>
  );
};

export default Header;
