import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import settings from "../../domainConfig";
import { apiCall } from "../../config/HTTP";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const { refferId } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("91");

  const handleSelectCode = (code) => {
    setCountryCode(code);
    setIsDropdownOpen(false);
  };

  const domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));
  const isOtpEnabled = domainSetting?.isSignUpOtp === true;
  const [user, setUser] = useState({
    name: "",
    mobileNo: "",
    username: "",
    password: "",
    referralCode: refferId || "",
    otp: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "username") {
      val = value.replace(/\s/g, "");
    }
    if (name === "mobileNo") {
      if (val.length > 10) {
        setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
        return;
      }
      val = val.slice(0, 10);
    }

    setUser({ ...user, [name]: val });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
  
    if (!user.mobileNo || user.mobileNo.length !== 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }

    // if (!user.name || user.name.length < 3) {
    //   setErrors({ ...errors, name: "Name must be at least 3 characters long" });
    //   return;
    // }

    if (!user.password || user.password.length < 6) {
      setErrors({
        ...errors,
        password:
          "Password must be at least 6 characters long and in format Ab1234",
      });
      return;
    }

    // if (!/[A-Z]/.test(user.password)) {
    //   setErrors({ ...errors, password: "Password must contain at least one uppercase letter" });
    //   return;
    // }

    // if (!/[a-z]/.test(user.password)) {
    //   setErrors({ ...errors, password: "Password must contain at least one lowercase letter" });
    //   return;
    // }

    // if (!/\d/.test(user.password)) {
    //   setErrors({ ...errors, password: "Password must contain at least one digit" });
    //   return;
    // }

    if (isOtpEnabled && !otpEnabled) {
      message.warning("Please request and enter OTP before proceeding.");
      return;
    }

    const payload = {
      domainUrl: window.location.origin,
      name: user.username.toLowerCase(),
      username: user.username.toLowerCase(),
      mobileNo: `${countryCode}${user.mobileNo}`,
      password: user.password,
    };
    if (user.referralCode) {
      payload.referralCode = user.referralCode;
    }

    if (user.otp) {
      payload.otp = user.otp;
    }

    setLoading(true);
    try {
      const response = await apiCall("POST", "website/registerClient", payload);
      if (!response.error) {
        message.success(response?.message);
        // localStorage.clear();
        setUser({
          name: "",
          username: "",
          mobileNo: "",
          password: "",
          referralCode: "",
          otp: "",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        message.error("Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error?.data?.message || "An error occurred during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtp = async () => {
    if (!user.mobileNo || user.mobileNo.length !== 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }

    try {
      const res = await apiCall("POST", "website/getWhatsAppOtp", {
        phone: `${countryCode}${user.mobileNo}`,
      });

      if (res?.error === false) {
        message.success(res?.message || "OTP sent successfully");
        setOtpEnabled(true);
      } else {
        message.error(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      message.error(err.data.message || "Error sending OTP");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleOnSubmit(e);
  };
  const countryList = [
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+1", name: "United States", flag: "🇺🇸" },
    { code: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+51", name: "Peru", flag: "🇵🇪" },
    { code: "+52", name: "Mexico", flag: "🇲🇽" },
    { code: "+53", name: "Cuba", flag: "🇨🇺" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
    { code: "+57", name: "Colombia", flag: "🇨🇴" },
    { code: "+58", name: "Venezuela", flag: "🇻🇪" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },

    { code: "+92", name: "Pakistan", flag: "🇵🇰" },
    { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", name: "Myanmar", flag: "🇲🇲" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    { code: "+211", name: "South Sudan", flag: "🇸🇸" },
    { code: "+212", name: "Morocco", flag: "🇲🇦" },
    { code: "+213", name: "Algeria", flag: "🇩🇿" },
    { code: "+216", name: "Tunisia", flag: "🇹🇳" },
    { code: "+218", name: "Libya", flag: "🇱🇾" },
    { code: "+220", name: "Gambia", flag: "🇬🇲" },
    { code: "+221", name: "Senegal", flag: "🇸🇳" },
    { code: "+222", name: "Mauritania", flag: "🇲🇷" },
    { code: "+223", name: "Mali", flag: "🇲🇱" },
    { code: "+224", name: "Guinea", flag: "🇬🇳" },
    { code: "+225", name: "Ivory Coast", flag: "🇨🇮" },
    { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
    { code: "+227", name: "Niger", flag: "🇳🇪" },
    { code: "+228", name: "Togo", flag: "🇹🇬" },
    { code: "+229", name: "Benin", flag: "🇧🇯" },
    { code: "+230", name: "Mauritius", flag: "🇲🇺" },
    { code: "+231", name: "Liberia", flag: "🇱🇷" },
    { code: "+232", name: "Sierra Leone", flag: "🇸🇱" },
    { code: "+233", name: "Ghana", flag: "🇬🇭" },
    { code: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "+235", name: "Chad", flag: "🇹🇩" },
    { code: "+236", name: "Central African Republic", flag: "🇨🇫" },
    { code: "+237", name: "Cameroon", flag: "🇨🇲" },
    { code: "+238", name: "Cape Verde", flag: "🇨🇻" },
    { code: "+239", name: "Sao Tome & Principe", flag: "🇸🇹" },
    { code: "+240", name: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+241", name: "Gabon", flag: "🇬🇦" },
    { code: "+242", name: "Congo", flag: "🇨🇬" },
    { code: "+243", name: "DR Congo", flag: "🇨🇩" },
    { code: "+244", name: "Angola", flag: "🇦🇴" },
    { code: "+245", name: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+246", name: "Diego Garcia", flag: "🇮🇴" },
    { code: "+248", name: "Seychelles", flag: "🇸🇨" },
    { code: "+249", name: "Sudan", flag: "🇸🇩" },
    { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
    { code: "+252", name: "Somalia", flag: "🇸🇴" },
    { code: "+253", name: "Djibouti", flag: "🇩🇯" },
    { code: "+254", name: "Kenya", flag: "🇰🇪" },
    { code: "+255", name: "Tanzania", flag: "🇹🇿" },
    { code: "+256", name: "Uganda", flag: "🇺🇬" },
    { code: "+257", name: "Burundi", flag: "🇧🇮" },
    { code: "+258", name: "Mozambique", flag: "🇲🇿" },
    { code: "+260", name: "Zambia", flag: "🇿🇲" },
    { code: "+261", name: "Madagascar", flag: "🇲🇬" },
    { code: "+262", name: "Reunion", flag: "🇷🇪" },
    { code: "+263", name: "Zimbabwe", flag: "🇿🇼" },
    { code: "+264", name: "Namibia", flag: "🇳🇦" },
    { code: "+265", name: "Malawi", flag: "🇲🇼" },
    { code: "+266", name: "Lesotho", flag: "🇱🇸" },
    { code: "+267", name: "Botswana", flag: "🇧🇼" },
    { code: "+268", name: "Eswatini", flag: "🇸🇿" },
    { code: "+269", name: "Comoros", flag: "🇰🇲" },
    { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+972", name: "Israel", flag: "🇮🇱" },
    { code: "+973", name: "Bahrain", flag: "🇧🇭" },
    { code: "+974", name: "Qatar", flag: "🇶🇦" },
    { code: "+975", name: "Bhutan", flag: "🇧🇹" },
    { code: "+976", name: "Mongolia", flag: "🇲🇳" },
    { code: "+977", name: "Nepal", flag: "🇳🇵" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-[var(--secondary)]">
        <div className="bg-[#212121] bg-cover bg-center font-sans  w-[430px] max-w-[430px] min-h-[90%] max-h-[90%] p-0  flex flex-col justify-center rounded-[10px] border-2 border-white mx-1">
          <div className="w-[100%] px-[0px] mx-auto">
            <div className="flex items-center justify-center">
              <img
                src={settings.logo}
                alt="Reddy-Book"
                className="h-[60px] w-[180px]"
              />
            </div>

            <div className="space-y-5 lg:p-10 p-4 pb-0 bg-transparent border-none shadow-none transition-all duration-300 ease-in-out ">
              {/* Form Inputs (Same as before) */}
              {/* <div>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleOnChange}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div> */}

              <div className="mb-4 relative">
                <div className="relative flex items-center">
                  {/* Country code select dropdown */}
                  <select
                    name="countryCode"
                    value={user.countryCode}
                    onChange={handleOnChange}
                    className="h-[45px] px-2 bg-[var(--darkcolor)] border-b border-gray-300 text-white text-[13px] text-center rounded-none outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
                  >
                    {countryList.map((country, index) => (
                      <option key={index} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    id="mobile"
                    name="mobileNo"
                    value={user.mobileNo}
                    onChange={handleOnChange}
                    placeholder="Mobile No"
                    className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-start text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                  />
                </div>
                {isOtpEnabled && (
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    className="text-white absolute top-1 right-1 bg-[var(--primary)] text-xs px-3 py-2 rounded"
                  >
                    GET OTP
                  </button>
                )}
                {errors.mobileNo && (
                  <div className="mt-1 text-xs text-[#FF0000]">
                    {errors.mobileNo}
                  </div>
                )}
              </div>

              {isOtpEnabled && (
                <div>
                  <input
                    type="text"
                    name="otp"
                    value={user.otp}
                    onChange={handleOnChange}
                    className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                    placeholder="Enter OTP"
                    disabled={!otpEnabled}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp}</p>
                  )}
                </div>
              )}

              <div>
                {/* <label>Username</label> */}
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleOnChange}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                  placeholder="Enter Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              <div>
                {/* <label>Password</label> */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleOnChange}
                    className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                    placeholder="Password"
                    disabled={isOtpEnabled && !otpEnabled}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-2 top-2 text-white"
                  >
                    {showPassword ? (
                      <BsFillEyeSlashFill size={20} />
                    ) : (
                      <BsEyeFill size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  id="referralCode"
                  value={user.referralCode}
                  onChange={handleOnChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Referral Code"
                  className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white "
                />
              </div>
              {errors.referralCode && (
                <div className="text-[#FF0000] text-sm mb-1">
                  {errors.referralCode}
                </div>
              )}

              <div className=" text-[8px] text-white">
                By continuing you will receive a one-time verification code to
                your phone number by SMS.
              </div>

              <button
                type="submit"
                onClick={handleOnSubmit}
                disabled={loading}
                className={` w-full block mx-auto mt-5 bg-[var(--primary)] border border-[var(--primary)] text-white text-sm uppercase leading-[3rem] rounded 
                  ${loading ? "opacity-50 cursor-not-allowed" : ""} `}
              >
                {loading ? "Loading..." : "Signup"}
              </button>

              <a
                passHref={true}
                href={`https://wa.me/${domainSetting?.helplineNumber}`}
                title="Whatsapp"
                className=" w-full flex justify-between items-center text-center px-3 border  text-white text-sm uppercase leading-[3rem] rounded"
                target="_blank"
              >
                <div> Direct Id via WhatsApp</div>

                <div className="animation-bounce">
                  <FaWhatsapp size={35} color="green" />
                </div>
              </a>

              {/* 
              console.log(domainSetting?.whatsappNumber, "domainSettingdomainSetting"); */}

              <div className="text-white flex justify-start items-center space-x-4">
                <p>Already have account?</p>
                <div
                  onClick={() => {
                    navigate("/dashboard", { state: { showLogin: true } });
                  }}
                  className="mt-1 text-[var(--primary)] text-[15px] uppercase font-[900] flex justify-center items-center cursor-pointer"
                >
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
