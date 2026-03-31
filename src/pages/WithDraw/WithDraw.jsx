import React, { useEffect, useState } from "react";
import { apiCall, httpPostFormData } from "../../config/HTTP";
import { Link } from "react-router-dom";
import { message } from "antd";
import { getDepositWithdraw } from "../../redux/reducers/user_reducer";
import { useDispatch, useSelector } from "react-redux";
import DepositWithdrawCom from "../depositWithdraw/DepositWithdraw";

const WithDraw = () => {
  const [activeTab, setActiveTab] = useState("Bank");
  const [accountDetails, setAccountDetails] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    bankName: "",
    branchName: "",
  });
  const [upiData, setUpiData] = useState({
    upiId: "",
    mobileNumber: "",
  });
  const [upiQrCode, setUpiQrCode] = useState(null);
  const [upiQrPreview, setUpiQrPreview] = useState(null);
  const [bankAmount, setBankAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [upiErrors, setUpiErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAmount, setActiveAmount] = useState(null);
  const [upiActiveAmount, setUpiActiveAmount] = useState(null);
  const [allDetailsByUser, setAllDetailsByUser] = useState({});
  const bankDetailsUserDataFun = async () => {
    try {
      const bankDetailsUserData = await apiCall(
        "POST",
        "website/getBankDetailsByUserId",
      );
      if (bankDetailsUserData?.data) {
        setAllDetailsByUser(bankDetailsUserData?.data);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };
  useEffect(() => {
    let reqData = {
      reqType: "withdraw",
    };
    dispatch(getDepositWithdraw(reqData));
    getBankDetails();
    bankDetailsUserDataFun();
  }, []);
  const dispatch = useDispatch();
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const { getDepositWithdrawData } = useSelector((state) => state.user);

  const getBankDetails = async () => {
    try {
      const res = await apiCall("POST", "website/getAccountDetailsOfClient");
      setAccountDetails(res.data);
    } catch (error) {
      //   toast.error("Failed to fetch account details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUpiInputChange = (e) => {
    const { name, value } = e.target;
    setUpiData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setUpiErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleQrCodeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUpiQrPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const fileData = await httpPostFormData("website/fileUpload", formData);
      if (fileData?.data?.imageUrl) {
        setUpiQrCode(fileData.data.imageUrl);
        setUpiErrors((prev) => ({ ...prev, qrCode: "" }));
      } else {
        throw new Error("Invalid response from file upload API");
      }
    } catch (error) {
      console.error("Error uploading QR code:", error);
      setUpiErrors((prev) => ({ ...prev, qrCode: "File upload failed. Please try again." }));
      setUpiQrPreview(null);
      setUpiQrCode(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.accountNumber)
      errors.accountNumber = "Account Number is required";
    if (!formData.ifscCode) errors.ifscCode = "IFSC Code is required";
    if (!formData.accountHolder)
      errors.accountHolder = "Account Holder Name is required";
    if (!formData.bankName) errors.bankName = "Bank Name is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpiForm = () => {
    const errors = {};
    if (!upiData.upiId) errors.upiId = "UPI ID is required";
    if (!upiData.mobileNumber) errors.mobileNumber = "Mobile Number is required";
    if (upiData.mobileNumber && upiData.mobileNumber.length !== 10) {
      errors.mobileNumber = "Mobile Number must be 10 digits";
    }

    const amount = Number(upiAmount);
    const minAmount = Number(allDetailsByUser?.account?.fromAmount) || 300;
    const maxAmount = Number(allDetailsByUser?.account?.toAmount) || 500000;

    if (!amount) {
      errors.amount = "Amount is required";
    } else if (amount < minAmount) {
      errors.amount = `Amount must be at least ${minAmount}`;
    } else if (amount > maxAmount) {
      errors.amount = `Amount must not exceed ${maxAmount}`;
    }

    setUpiErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const validateBankTransfer = () => {
  //   const errors = {};
  //   if (!bankAmount) errors.amount = "Amount is required";
  //   if (!bankAmount || bankAmount < 300 || bankAmount > 500000) {
  //     errors.amount = "Amount must be between ₨300 and ₨5,00,000.";
  //   }
  //   setErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };


    const validateBankTransfer = () => {
    const amount = Number(bankAmount);
    const minAmount = Number(allDetailsByUser?.account?.fromAmount);
    const maxAmount = Number(allDetailsByUser?.account?.toAmount);

    if (!amount) {
      setErrors({ amount: "Amount is required" });
      return false;
    }

    if (amount < minAmount) {
      setErrors({ amount: `Amount must be at least ${minAmount}` });
      return false;
    }

    if (amount > maxAmount) {
      setErrors({ amount: `Amount must not exceed ${maxAmount}` });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await apiCall(
        "POST",
        "website/saveAccountDetails",
        formData,
      );
      message.success("Account details added successfully!");
      setFormData({
        accountNumber: "",
        ifscCode: "",
        accountHolder: "",
        bankName: "",
        branchName: "",
      });
      getBankDetails();
    } catch (error) {
      message.error("Failed to add account details. Please try again.");
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    if (!validateUpiForm()) return;

    try {
      setIsSubmitting(true);

      const submitData = {
        amount: upiAmount,
        upiId: upiData.upiId,
        mobileNumber: upiData.mobileNumber,
        withdrawType: "upi",
      };
      if (upiQrCode) {
        submitData.qrCode = upiQrCode;
      }

      const response = await apiCall("POST", "website/withdrawReq", submitData);

      if (response?.error === false) {
        message.success("UPI withdrawal request submitted successfully!");
        setUpiData({ upiId: "", mobileNumber: "" });
        setUpiQrCode(null);
        setUpiQrPreview(null);
        setUpiAmount("");
        setUpiActiveAmount(null);
      } else {
        message.error(response?.message || "Failed to submit UPI withdrawal");
      }
    } catch (error) {
      message.error(
        error?.data?.message || "Failed to submit UPI withdrawal. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankTransferSubmit = async (e) => {
    e.preventDefault();
    if (!validateBankTransfer()) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        amount: bankAmount,
      };

      const response = await apiCall("POST", "website/withdrawReq", submitData);

      if (response?.error === false) {
        message.success("Bank transfer request submitted successfully!");
        setBankAmount("");
      } else {
        message.error(response?.message || "Failed to submit bank transfer");
      }
    } catch (error) {
      message.error(
        error?.data?.message ||
          "Failed to submit bank transfer. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAmountSelect = (selectedAmount, isUpi = false) => {
    if (isUpi) {
      setUpiAmount(selectedAmount.toString());
      setUpiActiveAmount(Number(selectedAmount));
      setUpiErrors((prev) => ({ ...prev, amount: "" }));
    } else {
      setBankAmount(selectedAmount.toString());
      setActiveAmount(Number(selectedAmount));
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleAmountChange = (e, isUpi = false) => {
    const value = e.target.value;
    if (isUpi) {
      setUpiAmount(value);
      setUpiActiveAmount(null);
      setUpiErrors((prev) => ({ ...prev, amount: "" }));
    } else {
      setBankAmount(value);
      setErrors((prev) => ({ ...prev, amount: "" }));
      setActiveAmount(null);
    }
  };

  const handleReset = () => {
    setBankAmount("");
    setActiveAmount(null);
    setErrors({});
  };

  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;

  const amount = Number(bankAmount);
  const min = Number(allDetailsByUser?.account?.fromAmount);
  const max = Number(allDetailsByUser?.account?.toAmount);

  const isDisabled = !amount || amount < min || amount > max;

  const handleUpiReset = () => {
    setUpiAmount("");
    setUpiActiveAmount(null);
    setUpiErrors({});
  };

  return (
    <>
      <div className="bg-white text-black  md:max-w-5xl w-full mx-auto ">
        <div className="mb-2 md:bg-[var(--primary)] bg-[var(--secondary)]">
          <h1 className="text-lg px-2 font-bold text-gray-100">Withdrawal</h1>
        </div>

        {/* Bank / UPI Tabs */}
        <div className="flex text-sm font-semibold px-3 mb-4 gap-2">
          <button
            onClick={() => handleTabChange("Bank")}
            className={`flex-1 py-2.5 rounded-md text-center transition-all ${
              activeTab === "Bank"
                ? "md:bg-[var(--primary)] bg-[var(--secondary)] text-white"
                : "bg-gray-100 text-black border border-gray-300"
            }`}
          >
            Bank
          </button>
          <button
            onClick={() => handleTabChange("UPI")}
            className={`flex-1 py-2.5 rounded-md text-center transition-all ${
              activeTab === "UPI"
                ? "md:bg-[var(--primary)] bg-[var(--secondary)] text-white"
                : "bg-gray-100 text-black border border-gray-300"
            }`}
          >
            UPI
          </button>
        </div>

        {/* ============ BANK TAB ============ */}
        {activeTab === "Bank" && (
          <>
            <form
              onSubmit={handleSubmit}
              className="px-3 rounded-lg max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Name *</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                      errors.accountHolder ? "border-red-500 border" : ""
                    }`}
                    placeholder="Name"
                  />
                  {errors.accountHolder && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountHolder}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                      errors.bankName ? "border-red-500 border" : ""
                    }`}
                    placeholder="Bank Name"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bankName}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Account Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                      errors.accountNumber ? "border-red-500 border" : ""
                    }`}
                    placeholder="Account Number"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">IFSC Number</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                      errors.ifscCode ? "border-red-500 border" : ""
                    }`}
                    placeholder="IFSC Number"
                  />
                  {errors.ifscCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.ifscCode}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className=" md:bg-[var(--primary)] bg-[var(--secondary)] text-white px-8 py-2 mt-6 text-sm rounded-md block"
              >
                {accountDetails ? "UPDATE" : "ADD"}
              </button>
            </form>

            <div className="py-2 px-2 overflow-y-auto max-w-6xl mx-auto md:block hidden">
              {accountDetails ? (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-100  uppercase bg-gray-50 dark:bg-secondary dark:text-gray-100">
                    <tr className="bg-[var(--primary)] text-[var(--secondary)]">
                      <th scope="col" className="px-6 lg:py-3 py-1.5">
                        Account Number
                      </th>
                      <th scope="col" className="px-6 lg:py-3 py-1.5">
                        Name
                      </th>
                      <th scope="col" className="px-6 lg:py-3 py-1.5">
                        Bank Name
                      </th>
                      <th scope="col" className="px-6 lg:py-3 py-1.5">
                        IFSC Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b py-2 text-start text-[--primary] text-lg font-bold">
                      <td className="px-6">
                        {accountDetails?.accountNumber || "-"}
                      </td>
                      <td className="px-6">
                        {accountDetails?.accountHolder || "-"}
                      </td>
                      <td className="px-6">
                        {accountDetails?.bankName || "-"}
                      </td>
                      <td className="px-6">
                        {accountDetails?.ifscCode || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4">
                  No bank account details found
                </div>
              )}
            </div>

            {accountDetails && (
              <div className="md:hidden block text-gray-100 uppercase bg-gray-50 py-2">
                <div className="flex items-center px-2 bg-secondary border-b  py-2  text-center text-sm font-bold">
                  <span className="flex-1 text-start border-r text-black">
                    Account Number
                  </span>
                  <span className="flex-1 text-left pl-4 text-[--primary]">
                    {accountDetails?.accountNumber || "-"}
                  </span>
                </div>
                <div className="flex items-center px-2 bg-secondary border-b  py-2  text-center text-sm font-bold">
                  <span className="flex-1 text-start border-r text-black">
                    IFSC Code
                  </span>
                  <span className="flex-1 text-left pl-4 text-[--primary]">
                    {accountDetails?.ifscCode || "-"}
                  </span>
                </div>

                <div className="flex items-center px-2 bg-secondary border-b py-2 text-center text-sm font-bold">
                  <span className="flex-1 text-start border-r text-black">
                    Name
                  </span>
                  <span className="flex-1 text-left pl-4 text-[--primary]">
                    {accountDetails?.accountHolder || "-"}
                  </span>
                </div>

                <div className="flex items-center px-2 bg-secondary border-b py-2 text-center text-sm font-bold">
                  <span className="flex-1 text-start border-r text-black">
                    Bank Name
                  </span>
                  <span className="flex-1 text-left pl-4 text-[--primary]">
                    {accountDetails?.bankName || "-"}
                  </span>
                </div>
              </div>
            )}

            <form
              onSubmit={handleBankTransferSubmit}
              className="px-1 rounded-lg max-w-6xl mx-auto"
            >
              <div className="max-w-6xl uppercase mt-4 mx-auto">
                <label className="block text-sm mt-5 mb-1 capitalize  md:text-[var(--primary)] text-[var(--secondary)] font-semibold">
                  Select Your Amount{" "}
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 justify-start gap-1 ">
                  {[300, 1000, 2000, 5000, 10000, 25000, 500000].map(
                    (presetAmount) => (
                      <button
                        key={presetAmount}
                        type="button"
                        className={`px-4 py-2 text-sm font-bold border border-gray-300 rounded-lg
                  ${
                    activeAmount === presetAmount
                      ? " md:bg-[var(--primary)] bg-[var(--secondary)]  text-black"
                      : "bg-white  md:text-[var(--primary)] text-[var(--secondary)] hover:bg-[--primary] hover:text-[--secondary]"
                  }`}
                        onClick={() =>
                          handleQuickAmountSelect(presetAmount, false)
                        }
                      >
                        ₹{presetAmount}
                      </button>
                    ),
                  )}
                </div>

                <div className="relative mt-3 mx-0 md:mx-5">
                  <div className="flex items-center  mb-3 justify-between">
                    <label className="block text-sm capitalize  md:text-[var(--primary)] text-[var(--secondary)] font-semibold">
                      Type Your Amount{" "}
                    </label>
                    <Link
                      onClick={handleReset}
                      className="underline text-[14px] font-semibold capitalize "
                    >
                      Reset
                    </Link>
                  </div>
                  <input
                    type="number"
                    className={`w-full ps-[28px] pe-1.5 py-2 border-black  border-2 bg-white rounded-md text-black ${
                      errors.amount ? "border-red-500" : ""
                    }`}
                    placeholder="Amount"
                    value={bankAmount}
                    onChange={(e) => handleAmountChange(e, false)}
                  />
                  <div className="absolute top-[53%] left-[10px] text-lg font-bold text-gray-600">
                    ₹
                  </div>
                  {errors.amount && (
                    <span className="text-red-500 text-xs">
                      {errors.amount}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mx-0  bg-green-800 text-white w-full font-semibold py-3 mt-6 text-sm rounded-md block md:border mb-5 md:border-gray-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}

        {/* ============ UPI TAB ============ */}
        {activeTab === "UPI" && (
          <form onSubmit={handleUpiSubmit} className="px-3 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  value={upiData.upiId}
                  onChange={handleUpiInputChange}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                    upiErrors.upiId ? "border-red-500 border" : ""
                  }`}
                  placeholder="e.g. name@upi"
                />
                {upiErrors.upiId && (
                  <p className="text-red-500 text-xs mt-1">{upiErrors.upiId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={upiData.mobileNumber}
                  onChange={handleUpiInputChange}
                  maxLength={10}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${
                    upiErrors.mobileNumber ? "border-red-500 border" : ""
                  }`}
                  placeholder="10 digit mobile number"
                />
                {upiErrors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {upiErrors.mobileNumber}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">QR Code (Optional)</label>
                <div className="flex items-center gap-4">
                  <label
                    className="cursor-pointer md:bg-[var(--primary)] bg-[var(--secondary)] text-white px-4 py-1.5 rounded-md text-sm"
                  >
                    Upload QR
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeChange}
                      className="hidden"
                    />
                  </label>
                  {upiQrPreview && (
                    <div className="relative">
                      <img
                        src={upiQrPreview}
                        alt="QR Preview"
                        className="w-20 h-20 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUpiQrCode(null);
                          setUpiQrPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        x
                      </button>
                    </div>
                  )}
                </div>
                {upiErrors.qrCode && (
                  <p className="text-red-500 text-xs mt-1">{upiErrors.qrCode}</p>
                )}
              </div>
            </div>

            <div className="max-w-6xl uppercase mt-4 mx-auto">
              <label className="block text-sm mt-2 mb-1 capitalize md:text-[var(--primary)] text-[var(--secondary)] font-semibold">
                Select Your Amount{" "}
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 justify-start gap-1">
                {[300, 1000, 2000, 5000, 10000, 25000, 500000].map(
                  (presetAmount) => (
                    <button
                      key={presetAmount}
                      type="button"
                      className={`px-4 py-2 text-sm font-bold border border-gray-300 rounded-lg
                ${
                  upiActiveAmount === presetAmount
                    ? " md:bg-[var(--primary)] bg-[var(--secondary)] text-black"
                    : "bg-white md:text-[var(--primary)] text-[var(--secondary)] hover:bg-[--primary] hover:text-[--secondary]"
                }`}
                      onClick={() => handleQuickAmountSelect(presetAmount, true)}
                    >
                      ₹{presetAmount}
                    </button>
                  ),
                )}
              </div>

              <div className="relative mt-3 mx-0 md:mx-5">
                <div className="flex items-center mb-3 justify-between">
                  <label className="block text-sm capitalize md:text-[var(--primary)] text-[var(--secondary)] font-semibold">
                    Type Your Amount{" "}
                  </label>
                  <Link
                    onClick={handleUpiReset}
                    className="underline text-[14px] font-semibold capitalize"
                  >
                    Reset
                  </Link>
                </div>
                <input
                  type="number"
                  className={`w-full ps-[28px] pe-1.5 py-2 border-black border-2 bg-white rounded-md text-black ${
                    upiErrors.amount ? "border-red-500" : ""
                  }`}
                  placeholder="Amount"
                  value={upiAmount}
                  onChange={(e) => handleAmountChange(e, true)}
                />
                <div className="absolute top-[53%] left-[10px] text-lg font-bold text-gray-600">
                  ₹
                </div>
                {upiErrors.amount && (
                  <span className="text-red-500 text-xs">
                    {upiErrors.amount}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mx-0 bg-green-800 text-white w-full font-semibold py-3 mt-6 text-sm rounded-md block md:border mb-5 md:border-gray-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      <div>
        <div className="flex flex-col w-full cardHover transition my-1">
          <div className="text-[12px] px-1 md:px-4 text-club4-second-text2 border border-[#eee] rounded text-[#ff0000] p-[20px] space-y-1">
            {[
              "1. This form is for withdrawing the amount from the main wallet only.",
              "2.The bonus wallet amount cannot be withdrawn by this form.",
              "3. Do not put Withdraw request without betting with deposit amount. Such activity may be identified as Suspicious.",
              "4. If multiple users are using same withdraw account then all the linked users will be blocked.",
              "5. Maximum Withdraw time is 45 minutes then only complain on WhatsApp number.",
            ].map((note, index) => (
              <div key={index} className="flex items-start">
                <span className="ml-2">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <DepositWithdrawCom data={getDepositWithdrawData} />
      </div>
    </>
  );
};

export default WithDraw;
