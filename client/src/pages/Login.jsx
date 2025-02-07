import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/appcontext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn ,getUserData} = useContext(AppContext);

  const [state, setState] = React.useState("sign up");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      if (state == "sign up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex   items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5  sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300  text-sm  ">
        <h2
          className="text-3xl font-semibold mb-3 text-center"
          text-white
          text-center
        >
          {state == "sign up" ? "create  account" : "Login "}
        </h2>
        <p className="text-center  text-sm mb-6">
          {state == "sign up"
            ? "create your account"
            : "Login in to your account"}
        </p>

        <form action="" onSubmit={onsubmitHandler}>
          {state == "sign up" && (
            <div className=" flex items-center  gap-3 w-full px-5 py-2.5 rounded-full bg-[#555A5C] mb-4">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-none"
                onChange={(e) => setName(e.target.value)}
                type="text"
                name=""
                id=""
                placeholder="full name"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#555A5C] mb-4">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name=""
              id=""
              placeholder="Email"
              required
            />
          </div>

          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#555A5C] mb-4">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name=""
              id=""
              placeholder="Password"
              required
            />
          </div>

          <p
            className="mb-4 text-indigo-500  cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            {" "}
            Forgot password?
          </p>

          <button className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
          <p className="text-center my-2">
            {state == "sign up"
              ? "Already have an account? "
              : "Don't have an account yet? "}
            <span
              onClick={() => setState(state == "sign up" ? "Login" : "sign up")}
              className="text-indigo-500 cursor-pointer underline"
            >
              {state == "sign up" ? " Login" : " Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
