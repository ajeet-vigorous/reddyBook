import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import settings from "../../domainConfig";
import { FaTimes } from "react-icons/fa";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { apiCall } from "../../config/HTTP";
import { updatePassword } from "../../redux/reducers/auth.reducer";

function ForgotModal({ closeFModal }) {
  const [countryCode, setCountryCode] = useState("91");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    mobileNo: "",
    password: "",
    newPassword: "",
    otp: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const domainData = JSON.parse(localStorage.getItem("clientdomainSetting"));
  const isOtpEnabled = domainData?.isSignUpOtp === true;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "mobileNo" && value.length > 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }

    if (name === "mobileNo") {
      val = value.slice(0, 10);
    }

    setUser({ ...user, [name]: val });
    setErrors({ ...errors, [name]: "" });
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

  const changePassword = async () => {
  if (!handleValidation()) return;

  try {
    const data = {
      mobileNo: `${countryCode}${user.mobileNo}`,
      otp: user.otp,
      password: user.password,
    };
    const res = await apiCall("POST", "website/forgetPassword", data);
    console.log(res, "API Response");

    if (res?.error === false) {
      message.success(res?.message || "Password changed successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      message.error(res?.message || "Failed to change password");
    }
  } catch (error) {
    console.error("Error:", error);
    message.error(error?.data?.message || "Something went wrong. Please try again.");
  }
};

  const handleValidation = () => {
    let formIsValid = true;
    let errorMessages = {};

    if (!user.password) {
      formIsValid = false;
      errorMessages.password = "New Password is required";
    }

    if (!user.confirmPassword) {
      formIsValid = false;
      errorMessages.confirmPassword = "Confirm Password is required";
    } else if (user.password !== user.confirmPassword) {
      formIsValid = false;
      errorMessages.confirmPassword = "Passwords do not match";
    }

    setErrors(errorMessages);
    return formIsValid;
  };

  return (
    <>
      <div className="fixed z-[99999] inset-0 flex items-start justify-center bg-black/60 ">
        <div className="bg-[var(--secondary)] top-7 w-[500px] shadow-lg rounded-md relative mx-2 ">
          <div className="rounded-[10px] border-2 border-white px-6 py-20 m-7 bg-[#212121]">
            <div className="flex justify-center items-center p-4">
              <img src={settings.logo} className="w-[180px] h-[60px]" />
            </div>

            <div className="md:flex w-full">
              <form className="w-full pt-4">
                <div className="flex justify-center items-center">
                  <button
                    onClick={closeFModal}
                    className="text-black w-8 h-8 rounded-full absolute top-0 right-2 z-50 flex justify-end items-center  hover:text-white/70 text-4xl"
                  >
                    <FaTimes className="" size={16} />
                  </button>
                </div>

                {/* Country Code and Mobile Number */}
                <div className="mb-4 relative">
                  <div className="relative flex items-center">
                    <select
                      name="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-[45px] px-2 bg-[var(--darkcolor)] border-b border-gray-300 text-white text-[13px] text-center rounded-none outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
                    >
                      {countryList.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.flag} +{country.code}
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
                      className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-start text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
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

                {/* OTP Input */}
                {isOtpEnabled && (
                  <div>
                    <input
                      type="text"
                      name="otp"
                      value={user.otp}
                      onChange={handleOnChange}
                      className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
                      placeholder="Enter OTP"
                      disabled={!otpEnabled}
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-sm">{errors.otp}</p>
                    )}
                  </div>
                )}

                {/* Password and Confirm Password Inputs */}
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={user.password}
                      onChange={handleOnChange}
                      className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
                      placeholder="New Password"
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

                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleOnChange}
                      className="bg-transparent w-full text-white border-b border-gray-300 rounded-none text-center text-[13px] h-[45px] outline-none focus:outline-none focus:ring-0 focus:bg-black focus:border-[var(--secondary)] focus:text-white"
                      placeholder="Confirm Password"
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

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex justify-center md:mt-0 mt-1">
                  <button
                    type="button"
                    onClick={changePassword}
                    className="px-3 py-1.5 font-normal text-[15px] text-white tracking-wide bg-[var(--secondary)] rounded-md border border-transparent shadow-sm hover:bg-white hover:text-black hover:border-[var(--secondary)] transition-colors duration-150 ease-in-out select-none w-full mt-1 flex items-center justify-center gap-2"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotModal;

export const countryList = [
  { code: "91", name: "India", flag: "🇮🇳" },
  { code: "1", name: "United States", flag: "🇺🇸" },
  { code: "1", name: "Canada", flag: "🇨🇦" },
  { code: "7", name: "Russia", flag: "🇷🇺" },
  { code: "20", name: "Egypt", flag: "🇪🇬" },
  { code: "27", name: "South Africa", flag: "🇿🇦" },
  { code: "30", name: "Greece", flag: "🇬🇷" },
  { code: "31", name: "Netherlands", flag: "🇳🇱" },
  { code: "32", name: "Belgium", flag: "🇧🇪" },
  { code: "33", name: "France", flag: "🇫🇷" },
  { code: "34", name: "Spain", flag: "🇪🇸" },
  { code: "36", name: "Hungary", flag: "🇭🇺" },
  { code: "39", name: "Italy", flag: "🇮🇹" },
  { code: "40", name: "Romania", flag: "🇷🇴" },
  { code: "41", name: "Switzerland", flag: "🇨🇭" },
  { code: "43", name: "Austria", flag: "🇦🇹" },
  { code: "44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "45", name: "Denmark", flag: "🇩🇰" },
  { code: "46", name: "Sweden", flag: "🇸🇪" },
  { code: "47", name: "Norway", flag: "🇳🇴" },
  { code: "48", name: "Poland", flag: "🇵🇱" },
  { code: "49", name: "Germany", flag: "🇩🇪" },
  { code: "51", name: "Peru", flag: "🇵🇪" },
  { code: "52", name: "Mexico", flag: "🇲🇽" },
  { code: "53", name: "Cuba", flag: "🇨🇺" },
  { code: "54", name: "Argentina", flag: "🇦🇷" },
  { code: "55", name: "Brazil", flag: "🇧🇷" },
  { code: "56", name: "Chile", flag: "🇨🇱" },
  { code: "57", name: "Colombia", flag: "🇨🇴" },
  { code: "58", name: "Venezuela", flag: "🇻🇪" },
  { code: "60", name: "Malaysia", flag: "🇲🇾" },
  { code: "61", name: "Australia", flag: "🇦🇺" },
  { code: "62", name: "Indonesia", flag: "🇮🇩" },
  { code: "63", name: "Philippines", flag: "🇵🇭" },
  { code: "64", name: "New Zealand", flag: "🇳🇿" },
  { code: "65", name: "Singapore", flag: "🇸🇬" },
  { code: "66", name: "Thailand", flag: "🇹🇭" },
  { code: "81", name: "Japan", flag: "🇯🇵" },
  { code: "82", name: "South Korea", flag: "🇰🇷" },
  { code: "84", name: "Vietnam", flag: "🇻🇳" },
  { code: "86", name: "China", flag: "🇨🇳" },
  { code: "90", name: "Turkey", flag: "🇹🇷" },

  { code: "92", name: "Pakistan", flag: "🇵🇰" },
  { code: "93", name: "Afghanistan", flag: "🇦🇫" },
  { code: "94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "95", name: "Myanmar", flag: "🇲🇲" },
  { code: "98", name: "Iran", flag: "🇮🇷" },
  { code: "211", name: "South Sudan", flag: "🇸🇸" },
  { code: "212", name: "Morocco", flag: "🇲🇦" },
  { code: "213", name: "Algeria", flag: "🇩🇿" },
  { code: "216", name: "Tunisia", flag: "🇹🇳" },
  { code: "218", name: "Libya", flag: "🇱🇾" },
  { code: "220", name: "Gambia", flag: "🇬🇲" },
  { code: "221", name: "Senegal", flag: "🇸🇳" },
  { code: "222", name: "Mauritania", flag: "🇲🇷" },
  { code: "223", name: "Mali", flag: "🇲🇱" },
  { code: "224", name: "Guinea", flag: "🇬🇳" },
  { code: "225", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "226", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "227", name: "Niger", flag: "🇳🇪" },
  { code: "228", name: "Togo", flag: "🇹🇬" },
  { code: "229", name: "Benin", flag: "🇧🇯" },
  { code: "230", name: "Mauritius", flag: "🇲🇺" },
  { code: "231", name: "Liberia", flag: "🇱🇷" },
  { code: "232", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "233", name: "Ghana", flag: "🇬🇭" },
  { code: "234", name: "Nigeria", flag: "🇳🇬" },
  { code: "235", name: "Chad", flag: "🇹🇩" },
  { code: "236", name: "Central African Republic", flag: "🇨🇫" },
  { code: "237", name: "Cameroon", flag: "🇨🇲" },
  { code: "238", name: "Cape Verde", flag: "🇨🇻" },
  { code: "239", name: "Sao Tome & Principe", flag: "🇸🇹" },
  { code: "240", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "241", name: "Gabon", flag: "🇬🇦" },
  { code: "242", name: "Congo", flag: "🇨🇬" },
  { code: "243", name: "DR Congo", flag: "🇨🇩" },
  { code: "244", name: "Angola", flag: "🇦🇴" },
  { code: "245", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "246", name: "Diego Garcia", flag: "🇮🇴" },
  { code: "248", name: "Seychelles", flag: "🇸🇨" },
  { code: "249", name: "Sudan", flag: "🇸🇩" },
  { code: "251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "252", name: "Somalia", flag: "🇸🇴" },
  { code: "253", name: "Djibouti", flag: "🇩🇯" },
  { code: "254", name: "Kenya", flag: "🇰🇪" },
  { code: "255", name: "Tanzania", flag: "🇹🇿" },
  { code: "256", name: "Uganda", flag: "🇺🇬" },
  { code: "257", name: "Burundi", flag: "🇧🇮" },
  { code: "258", name: "Mozambique", flag: "🇲🇿" },
  { code: "260", name: "Zambia", flag: "🇿🇲" },
  { code: "261", name: "Madagascar", flag: "🇲🇬" },
  { code: "262", name: "Reunion", flag: "🇷🇪" },
  { code: "263", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "264", name: "Namibia", flag: "🇳🇦" },
  { code: "265", name: "Malawi", flag: "🇲🇼" },
  { code: "266", name: "Lesotho", flag: "🇱🇸" },
  { code: "267", name: "Botswana", flag: "🇧🇼" },
  { code: "268", name: "Eswatini", flag: "🇸🇿" },
  { code: "269", name: "Comoros", flag: "🇰🇲" },
  { code: "971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "972", name: "Israel", flag: "🇮🇱" },
  { code: "973", name: "Bahrain", flag: "🇧🇭" },
  { code: "974", name: "Qatar", flag: "🇶🇦" },
  { code: "975", name: "Bhutan", flag: "🇧🇹" },
  { code: "976", name: "Mongolia", flag: "🇲🇳" },
  { code: "977", name: "Nepal", flag: "🇳🇵" },
  { code: "98", name: "Iran", flag: "🇮🇷" },
];
