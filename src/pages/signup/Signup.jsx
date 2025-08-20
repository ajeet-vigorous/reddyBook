import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import settings from "../../domainConfig";
import { apiCall } from "../../config/HTTP";

function Signup({ setShowLogin }) {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("password");
  const [inputFocused, setInputFocused] = useState(false);
  const [user, setUser] = useState({
    name: "",
    mobileNo: "",
    username: "",
    password: "",
    referralCode: ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let truncatedValue = value;
    if (name === "mobileNo") {
      // Truncate value to 10 digits if it exceeds
      if (value.length > 10) {
        return setErrors({
          ...errors,
          mobileNo: "Mobile number must be 10 digits",
        });
      }
      truncatedValue = value.slice(0, 10);
    }
    setUser({ ...user, [name]: truncatedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!user.mobileNo || user.mobileNo.length !== 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }
    if (!user.name || user.name.length < 3) {
      setErrors({ ...errors, name: "Name must be at least 3 characters long" });
      return;
    }

    // Validate password
    if (!user.password || user.password.length < 6) {
      setErrors({
        ...errors,
        password:
          "(Must be contained alphanumeric and more than 6 letters)",
      });
      return;
    }
    // Check for uppercase letters
    if (!/[A-Z]/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one uppercase letter" });
      return;
    }
    // Check for lowercase letters
    if (!/[a-z]/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one lowercase letter" });
      return;
    }
    // Check for numbers
    if (!/\d/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one digit" });
      return;
    }

    // Check for special characters
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one special character" });
      return;
    }

    setLoading(true);
    try {
      const loginDetails = {
        domainUrl: window.location.origin,
        name: user.name,
        username: user.username,
        mobileNo: user.mobileNo,
        password: user.password,
      };
      if (user.referralCode) {
        loginDetails.referralCode = user.referralCode;
      }

      const response = await apiCall("POST", "website/registerClient", loginDetails);

      if (response) {
        setUser({
          name: "",
          username: "",
          mobileNo: "",
          password: "",
          referralCode: ""
        });
        message.success(response?.message || "Registration successful!");
        navigate("/dashboard");

      } else {
        message.error(response?.message || "Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred during registration. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  let domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnSubmit(e);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-[var(--secondary)]">
        <div className="bg-[#212121] bg-cover bg-center font-sans  w-[430px] max-w-[430px] min-h-[90%] max-h-[90%] p-0  flex flex-col justify-center rounded-[10px] border-2 border-white mx-1">

          <div className="w-[100%] px-[0px] mx-auto">

            <div className="flex items-center justify-center">
              <img src={settings.logo1} alt="Reddy-Book" className="h-[60px] w-[180px]" />
            </div>

            <div className="space-y-5 lg:p-10 p-4 pb-0 bg-transparent border-none shadow-none transition-all duration-300 ease-in-out ">
              {/* Form Inputs (Same as before) */}

              <div className="mb-4">
                <div className="relative flex items-center">
                  {/* Country code select dropdown */}
                  <select
                    name="countryCode"
                    value={user.countryCode}
                    onChange={handleOnChange}
                    className="h-[45px] px-2 bg-[var(--darkcolor)] border-b border-gray-300 text-white text-[13px] text-center rounded-none outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white">
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+92">🇵🇰 +92</option>
                  </select>

                  <input
                    type="number"
                    id="mobile"
                    name="mobileNo"
                    value={user.mobileNo}
                    onChange={handleOnChange}
                    placeholder="Mobile No"
                    className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white " />
                </div>

                {/* Validation error */}
                {errors.mobileNo && (
                  <div className="mt-1 text-xs text-[#FF0000]">{errors.mobileNo}</div>
                )}
              </div>



              <div className="relative">
                <input
                  type={password}
                  name="password"
                  value={user.password}
                  onChange={handleOnChange}
                  placeholder="Choose your password"
                  className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white " />
              </div>
              {errors.password && <div className="text-[#FF0000]">{errors.password}</div>}

              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  id="referralCode"
                  value={user.referralCode}
                  onChange={handleOnChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Referral Code"
                  className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white " />

              </div>
              {errors.referralCode && <div className="text-[#FF0000] text-sm mb-1">{errors.referralCode}</div>}

              <div className=" text-[8px] text-white">
                By continuing you will receive a one-time verification code to your phone number by SMS.
              </div>

              <button
                type="submit"
                onClick={handleOnSubmit}
                disabled={loading}
                className={` w-full block mx-auto mt-5 bg-[var(--primary)] border border-[var(--primary)] text-white text-sm uppercase leading-[3rem] rounded 
                  ${loading ? "opacity-50 cursor-not-allowed" : ""} `}>
                {loading ? "Loading..." : "GET OTP"}
              </button>

              <div className="text-white flex justify-start items-center space-x-4">
                <p>Already have account?</p>
                <div
                  onClick={() => {
                    navigate("/dashboard", { state: { showLogin: true } });
                  }}
                  className="mt-1 text-[var(--primary)] text-[15px] uppercase font-[900] flex justify-center items-center cursor-pointer">
                  LOG IN
                </div>
              </div>

            </div>


          </div>


        </div>
      </div>

    </>
  );
}

export default Signup;