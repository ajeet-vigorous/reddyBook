import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import settings from "../../domainConfig";
import { FaTimes } from "react-icons/fa";
import CasinoSlider from "../casinoSlider/CasinoSlider";
import { ImAndroid } from "react-icons/im";
import { login } from "../../redux/reducers/auth.reducer";
import ForgotModal from "../forgotModal/ForgotModal";

const sliderData = [
  {
    gameImg: '/login/log_one.png',
  },
  {
    gameImg: '/login/log_three.png',
  },
  {
    gameImg: '/login/log_four.png',
  },
]

function Login({ isOpen, closeModal, setIsLoginOpen }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isterm, setIsterm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);

  const openFModal = () => {
    setShowForgotModal(true);
    setIsLoginOpen(false);
  }

  const closeFModal = () => {
    setShowForgotModal(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      return message.error("please enter username and password")
    }

    const reqData = {
      username: username,
      password: password,
      isClient: true,
      host: window.location.host,
    };

    dispatch(login(reqData))
      .then((data) => {
        if (!data.error) {
          closeModal();
          if (data?.payload?.userinfo?.data?.isPasswordChanged === false) {
            window.location.href = "/dashboard"
            localStorage.setItem("isRedirected", false)
          } else {
            window.location.href = "/dashboard"
          }
        } else {
          console.error("Login failed:", data.error);
        }
      })
      .catch((error) => {
        console.error("Login request failed:", error);
      });
  };

  // Handle login with demo credentials
  const handleDemoLogin = () => {
   const reqData = settings?.demoCredentials

    dispatch(login(reqData))
      .then((data) => {
        if (!data.error) {
          closeModal();
          window.location.href = "/dashboard"
          // navigate("/dashboard");
        } else {
          console.error("Demo Login failed:", data.error);
        }
      })
      .catch((error) => {
        console.error("Demo login request failed:", error);
      });
  };


  return (
    <>
      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 zindex">
          <div className="bg-[#005098] text-white lg:w-[800px] w-[500px] h-[600px] shadow-[0_0_25px_2px_#222] relative lg:-top-2 mx-2">

            <div className="md:flex w-full">
              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:w-[50%] w-full lg:py-[50px] py-[25px] px-[25px]">
                <div className="flex justify-center items-center">
                  <div className="py-5">
                    <h2 className="text-[30px] uppercase font-[700] text-center tracking-wider ">
                      Login Now
                    </h2>
                    <div className="w-[60%] h-[2px] bg-white mx-auto mt-1 rounded-none"></div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white w-8 h-8 rounded-full absolute top-0 right-2 z-50 flex justify-end items-center  hover:text-white text-4xl"
                  >
                    <FaTimes className="" size={16} />
                  </button>
                </div>
                {/* Input Fields */}
                <div className="mb-4">
                  <label className=" text-[10px] mb-1 font-[600] text-gray-200">
                    USERNAME / MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    // placeholder="Username"
                    className="bg-[#00427C] w-full flex-grow p-2 rounded-md focus:bg-[var(--primary)] focus:border-white text-white placeholder-gray-400 focus:border-button focus:border outline-none text-center"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  />
                </div>

                <div className="mb-4">
                  <label className=" text-[10px] mb-1 font-[600] text-gray-200">
                    PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    // placeholder="Password"
                    className="bg-[#00427C] w-full flex-grow p-2 rounded-md focus:bg-[var(--primary)] focus:border-white text-white placeholder-gray-400 focus:border-button focus:border outline-none text-center"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  />
                </div>

                <div className="">
                  <label className="inline-flex items-center space-x-2">
                    <input
                    checked
                      type="checkbox"
                      className="form-checkbox text-blue-600 rounded-sm"
                    />
                    <span className="text-[10px] text-white">Remember Me?</span>
                  </label>
                </div>

                <div
                  onClick={openFModal}
                  className="text-center my-1 cursor-pointer">
                  <div className="text-[13px] text-white">
                    Forgot Password
                  </div>
                </div>

                <button
                  type="submit"
                  className=" w-full mb-2 bg-white text-black font-semibold text-[13px] uppercase tracking-wide border border-[var(--primary)] rounded-[10px] py-[7px] px-[15px] shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms]  ease-in-out cursor-pointer">
                  Login
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className=" w-full mb-2 bg-white text-black font-semibold text-[13px] uppercase tracking-wide border border-[var(--primary)] rounded-[10px] py-[7px] px-[15px] shadow-[inset_0_0_0_1px_#fff] transition-all duration-[900ms]  ease-in-out cursor-pointer">
                  Login With Demo ID
                </button>
{/* bg-[var(--secondary)] border border-[var(--primary)] */}
                <button
                  className={` flex justify-center items-center space-x-1 w-full text-[16px] mx-auto mt-1.5 mb-[5px] py-1.5   text-white rounded-[10px]`}>
                  {/* <p>Download APK</p> */}
                 
                  <img src= {settings.logo} alt="logo" width={100}/>
                </button>

                <div className="text-white text-[13px] text-center mt-4">
                  <div className="flex justify-center items-center space-x-1">
                    <p>Powered by </p><p className="text-[var(--primary)]">{settings.domainName}</p>
                  </div>
                  {/* <div>
                    reddybook.clubofficial@gmail.com
                  </div> */}
                </div>

              </form>


              <div className="lg:w-[50%] w-full relative lg:block hidden">
                <button
                  onClick={closeModal}
                  className="text-white w-9 h-9 rounded-full absolute top-0 right-2 z-50 flex justify-end items-center  hover:text-white text-4xl"
                >
                  <FaTimes className="" size={16} />
                </button>
                <div>
                  <CasinoSlider data={sliderData} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {showForgotModal &&
        <ForgotModal isOpen={showForgotModal} closeModal={closeFModal} />
      }
    </>

  );
}

export default Login;
