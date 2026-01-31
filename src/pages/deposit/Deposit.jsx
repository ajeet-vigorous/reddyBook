import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

import { message } from "antd";
import { apiCall, httpPostFormData } from "../../config/HTTP";
import { FaCopy, FaWhatsapp } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io5";
import { getDepositWithdraw } from "../../redux/reducers/user_reducer";
import { useDispatch, useSelector } from "react-redux";
import DepositWithdrawCom from "../depositWithdraw/DepositWithdraw";

function Deposit() {
  const [bankAcountData, setBankAcountData] = useState();
  const [bankAcountUpi, setBankAcountUpi] = useState();
  const [showAccount, setShowAccount] = useState();
  const [error, setError] = useState({});
  const [fileName, setFileName] = useState("");
  const [methodName, setMethodName] = useState("");
  const [flowStep, setFlowStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [bankViewModal, setBankViewModal] = useState(true);
  const [cyptoViewModal, setCyptoViewModal] = useState(false);
  const [upiViewModal, setUpiViewModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [allDetailsByUser, setAllDetailsByUser] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const [payAccountFiel, setPayAccountFiel] = useState({
    amount: "",
    utrNo: "",
    img: "",
  });
  const { getDepositWithdrawData } = useSelector((state) => state.user);
  const domainSetting = (() => {
    try {
      const storedData = localStorage.getItem("clientdomainSetting");
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return {};
    }
  })();

  const dispatch = useDispatch();

  const bankDetailsUserDataFun = async () => {
    try {
      const bankDetailsUserData = await apiCall(
        "POST",
        "website/getBankDetailsByUserId",
      );
      if (bankDetailsUserData?.data) {
        setAllDetailsByUser(bankDetailsUserData?.data);
        setBankAcountData(bankDetailsUserData?.data?.account);
        setBankAcountUpi(bankDetailsUserData?.data?.upi);
  
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  useEffect(() => {
    let reqData = {
      reqType: "deposit",
    };
    dispatch(getDepositWithdraw(reqData));
    bankDetailsUserDataFun();
    if (domainSetting) {
      setBankAcountData(domainSetting?.account);
      setBankAcountUpi(domainSetting?.upi);
    }
  }, []);

  const payment = async (e) => {
    e.preventDefault();

    if (flowStep == 1) {
      if (validateAmount()) {
        setFlowStep(2);
      }
      return;
    }

    if (flowStep == 2) {
      if (selectedMethod) {
        setFlowStep(3);
      } else {
        setError({ ...error, method: "Please select a payment method" });
      }
      return;
    }

    // Final submission
    if (handleValidation()) {
      const data = {
        screenShotImg: payAccountFiel.img,
        amount: payAccountFiel.amount,
        utrNo: payAccountFiel.utrNo,
      };

      try {
        const elementPositionDataResponse = await apiCall(
          "POST",
          "website/depositReq",
          data,
        );

        if (elementPositionDataResponse) {
          if (!elementPositionDataResponse?.error) {
            message.success(elementPositionDataResponse?.message);
          }
          setPayAccountFiel({
            amount: "",
            utrNo: "",
            img: "",
          });
          setFlowStep(1);
          setSelectedMethod(null);
          setFileName("");
        }
      } catch (error) {
        console.error("Error submitting deposit:", error);
      }
    }
  };

  const payment1 = async (e) => {
    if (handleValidation()) {
      const data = {
        screenShotImg: payAccountFiel.img,
        amount: payAccountFiel.amount,
        utrNo: payAccountFiel.utrNo,
      };

      try {
        const elementPositionDataResponse = await apiCall(
          "POST",
          "website/depositReq",
          data,
        );

        if (elementPositionDataResponse) {
          if (!elementPositionDataResponse?.error) {
            message.success(elementPositionDataResponse?.message);
          }
          setPayAccountFiel({
            amount: "",
            utrNo: "",
            img: "",
          });
          setFlowStep(1);
          setSelectedMethod(null);
          setFileName("");
        }
      } catch (error) {
        console.error("Error submitting deposit:", error);
      }
    }
  };
  const validateAmount = () => {
    const amount = Number(payAccountFiel.amount);
    const minAmount = Number(allDetailsByUser?.account?.fromAmount);
    const maxAmount = Number(allDetailsByUser?.account?.toAmount);

    if (!amount) {
      setError({ amount: "Amount is required" });
      return false;
    }

    if (amount < minAmount) {
      setError({ amount: `Amount must be at least ${minAmount}` });
      return false;
    }

    if (amount > maxAmount) {
      setError({ amount: `Amount must not exceed ${maxAmount}` });
      return false;
    }

    setError({});
    return true;
  };

  const fileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError({ img: "Please select a valid file." });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setFileName(file.name);

    try {
      const fileData = await httpPostFormData("website/fileUpload", formData);

      // Handle the API response structure
      if (fileData?.data?.imageUrl) {
        setPayAccountFiel((prevState) => ({
          ...prevState,
          img: fileData.data.imageUrl,
        }));
        setError((prevError) => ({ ...prevError, img: "" }));
      } else {
        throw new Error("Invalid response from file upload API");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError({ img: "File upload failed. Please try again." });
      setFileName("");
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setPayAccountFiel((prevState) => ({ ...prevState, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
  };

  const handleValidation = () => {
    const errors = {};
    const utr = payAccountFiel.utrNo?.toString();

    if (!utr || utr.length < 6 || utr.length > 12) {
      errors.utrNo = "UTR No must be between 6 and 12 digits.";
    }

    if (!payAccountFiel.amount) {
      errors.amount = "Amount Cannot Be Blank.";
    }

    if (!payAccountFiel.img) {
      errors.img = "Please upload a screenshot.";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };
  const payment2 = () => {
    setFlowStep(1);
  };
  const updateStackOnclic = (value) => {
    setPayAccountFiel((prevState) => ({ ...prevState, amount: value }));
    setError((prevError) => ({ ...prevError, amount: "" }));
  };

  const handleMethodClick = (method) => {
    setMethodName(method);
    setUpiViewModal(true);
    setBankViewModal(false);
    setCyptoViewModal(false);
    const filteredData = bankAcountUpi?.[method];
    setShowAccount(filteredData ? { filteredData } : {});
    setError((prevError) => ({ ...prevError, method: "" }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      payment(e);
    }
  };

  const predefinedValues = [
    "300",
    "500",
    "1000",
    "2000",
    "4000",
    "5000",
    "10000",
    "20000",
  ];

  const paymentImage = [
    { imgs: "/deposit/bank2.png", title: "bank", method: "bank" },
    { imgs: "/deposit/bhim.png", title: "bhimUpi", method: "upi" },
    { imgs: "/deposit/paytm-pay.png", title: "paytm", method: "upi" },
    { imgs: "/deposit/g-pay.png", title: "googlePay", method: "upi" },
    { imgs: "/deposit/phonepe-pay.png", title: "phonePay", method: "upi" },
  ];
  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;

  const isUpiMethodEmpty = (methodData) => {
    if (!methodData) return true;

    const { image, upiId, mobNo } = methodData;

    return !image && !upiId && !mobNo;
  };
  const isCryptoEmpty = (crypto) => {
    if (!crypto) return true;

    const { walletId, cryptoType, image } = crypto;
    return !walletId && !cryptoType && !image;
  };
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);

    // setTimeout(() => {
    //     setCopiedField(null);
    // }, 1500);
  };
  return (
    <>
      <div>
        <div className="">
          {/* Header */}
          <div className="mb-2 md:bg-[var(--primary)] bg-[var(--secondary)]">
            <h1 className="text-lg px-2 font-bold text-gray-100">
              Select Your Amount
            </h1>
          </div>

          {/* Amount Selection Grid */}
          <div className="grid grid-cols-4 p-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-1">
            {predefinedValues.map((value) => (
              <button
                key={value}
                onClick={() => updateStackOnclic(value)}
                className={`py-1 px-2 rounded border-2 font-bold text-xs ${
                  payAccountFiel.amount === value
                    ? "md:bg-[var(--primary)] bg-[var(--secondary)] text-white"
                    : "bg-white md:text-[var(--primary)] text-[var(--secondary)] border-2 md:border-[var(--primary)] border-[var(--secondary)]"
                }`}
              >
                ₹{value}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium ">
                Or Enter Custom Amount
              </label>
              <div
                onClick={() =>
                  setPayAccountFiel((prevState) => ({
                    ...prevState,
                    ["amount"]: "",
                  }))
                }
                className="flex flex-col gap-2 underline text-sm "
              >
                Reset
              </div>
            </div>
            <div className="flex w-auto  rounded-lg">
              <div className="flex items-center px-3 mr-2 border-r rounded-lg  gradient-border">
                <button
                  id="currency"
                  type="button"
                  className="text-lg font-medium"
                >
                  <span className="gradient-text">₹</span>
                </button>
              </div>

              <input
                className={`focus:outline-none px-4 rounded-lg w-full border bg-transparent text-[#212529] text-[13px] py-3 ${
                  error.amount ? "border-red-500 border-2" : "border-gray-300"
                }`}
                type="number"
                placeholder="Enter Amount"
                id="amount"
                name="amount"
                value={payAccountFiel.amount}
                onChange={inputChange}
                onKeyPress={handleKeyPress}
                min="100"
              />
            </div>
            {error.amount && (
              <div className="text-red-600 text-sm mt-1 font-bold">
                {error.amount}
              </div>
            )}
            {flowStep !== 1 && (
              <span className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                {`Amount value should be between ₹${allDetailsByUser?.account?.fromAmount} and ₹${allDetailsByUser?.account?.toAmount}`}
              </span>
            )}
            {/* <span className="text-xs text-gray-500 mt-1 block">
              Amount value should be between ₹500 and ₹500000
            </span> */}
          </div>
          <div className=" px-4">
            <a
              passHref={true}
              href={`https://wa.me/${allDetailsByUser?.helplineNumber}`}
              title="Whatsapp"
              className=" w-full flex justify-between items-center text-center px-2 bg-[var(--primary)] border border-[var(--primary)] text-white text-xs uppercase leading-[3rem] rounded"
              target="_blank"
            >
              <div> FOR PAYMENT RELATED ISSUES CLICK HERE</div>

              <div className="animation-bounce">
                <FaWhatsapp size={30} color="white" />
              </div>
            </a>
          </div>
          <div className="flex p-3 justify-end">
            <button
              disabled={
                !payAccountFiel.amount ||
                payAccountFiel.amount < 300 ||
                payAccountFiel.amount > 500000
              }
              className={`rounded-lg w-full text-sm font-bold uppercase py-3 px-8 transition-all ${
                !payAccountFiel.amount ||
                payAccountFiel.amount < 300 ||
                payAccountFiel.amount > 500000
                  ? "bg-transparent text-gray-500 cursor-not-allowed border border-gray-300"
                  : "bg-green-800 hover:bg-[--white] hover:text-[--black] text-white hover:border-2 hover:border-green-800"
              }`}
              onClick={payment}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Step 2: Payment Method Selection */}
        {(flowStep === 2 || flowStep === 3) && (
          <>
            {/* <button
              className="rounded flex items-center gap-1 text-sm text-white bg-[#8a4e00] px-[12px] py-[6px]"
              onClick={payment2}
            >
              <MdKeyboardArrowLeft className="text-white w-4 h-4" />
              Back
            </button> */}
            <div className="border border-[#eee] p-[15px] mt-8 rounded  cardHover Transition">
              <>
                <div className="md:flex grid grid-cols-4 justify-start md:justify-center gap-1 ">
                  <div
                    className="flex flex-col items-center  border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setBankViewModal(true);
                      setUpiViewModal(false);
                      setCyptoViewModal(false);
                      setMethodName("Bank");
                    }}
                  >
                    <img
                      src={"/deposit/bank2.png"}
                      alt={"bank"}
                      className="h-10 w-16"
                    />
                  </div>
                  {bankAcountUpi &&
                    Object.keys(bankAcountUpi)
                      ?.filter(
                        (method) => !isUpiMethodEmpty(bankAcountUpi[method]),
                      )
                      ?.map((method) => (
                        <div
                          key={method}
                          onClick={() => handleMethodClick(method)}
                          className="flex flex-row justify-center items-center rounded-md border border-gray-300 p-2  h-auto"
                        >
                          {paymentImage.map(
                            (item, index) =>
                              method === item.title && (
                                <img
                                  key={index}
                                  src={item.imgs}
                                  alt={item.title}
                                  className={
                                    item.title === "bhimUpi" ? "h-[30px]" : ""
                                  }
                                />
                              ),
                          )}
                        </div>
                      ))}

                  {allDetailsByUser?.crypto &&
                    !isCryptoEmpty(allDetailsByUser.crypto) && (
                      <div
                        className="flex flex-col items-center px-3 border border-gray-300 
                       rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setBankViewModal(false);
                          setUpiViewModal(false);
                          setCyptoViewModal(true);
                          setMethodName("Crypto");
                        }}
                      >
                        <div className="flex m-auto text-red-600 font-semibold">
                          USDT
                        </div>
                      </div>
                    )}

                  {allDetailsByUser?.whatsappNumber && (
                    <a
                      passHref={true}
                      href={`https://wa.me/${allDetailsByUser?.whatsappNumber}`}
                      title="Whatsapp"
                      className="flex justify-center items-center px-3 border border-gray-300 
                       rounded-lg hover:bg-gray-50 cursor-pointer"
                      target="_blank"
                    >
                      <div className="animation-bounce">
                        <FaWhatsapp size={30} color="green" />
                      </div>
                    </a>
                  )}
                </div>
              </>

              <div className="mt-4 text-center text-base font-semibold text-[#212529] uppercase relative borderBottom">
                {methodName ? methodName : " Bank Account"}
              </div>
              <div className="md:flex gap-8 pt-3  w-full">
                <div className="md:w-1/2 w-full  rounded p-[10px]">
                  {bankViewModal && (
                    <div className="w-full">
                      <div className="bg-white rounded-[11px] relative">
                        <div className=" w-full">
                          <div
                            className="flex flex-col border rounded-[15px] py-6 px-4 w-full"
                            style={{
                              backgroundColor: "#f3f2f6",
                              opacity: 0.9,
                            }}
                          >
                            <div className="flex justify-between gap-2 mb-3">
                              <div className="flex justify-start gap-2 ">
                                <span className="text-[13px] text-[#222222]">
                                  Bank Name :
                                </span>
                                <span className="text-[13px] font-[400]">
                                  {bankAcountData?.branchName}
                                </span>
                              </div>
                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "branchName"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      bankAcountData?.branchName,
                                      "branchName",
                                    )
                                  }
                                />

                                {/* <span
        className="absolute top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
        Copied!
    </span> */}
                              </div>
                              {/* <div><FaCopy className="w-5 h-5 cursor-pointer text-[var(--secondary)]" onClick={() => navigator.clipboard.writeText(bankAcountData?.branchName)}/></div> */}
                            </div>
                            <div className="flex justify-between gap-2 mb-3">
                              <div className="flex justify-start gap-2 ">
                                <span className="text-[13px] text-[#222222]">
                                  Account Name :
                                </span>
                                <span className="text-[13px] font-[400]">
                                  {bankAcountData?.acHolderName}
                                </span>
                              </div>
                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "acHolderName"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      bankAcountData?.acHolderName,
                                      "acHolderName",
                                    )
                                  }
                                />

                                {/* <span
        className="absolute top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
        Copied!
    </span> */}
                              </div>
                              {/* <div><FaCopy className="w-5 h-5 cursor-pointer text-[var(--secondary)]" onClick={() => navigator.clipboard.writeText(bankAcountData?.acHolderName)}/></div> */}
                            </div>
                            <div className="flex justify-between gap-2 mb-3">
                              <div className="flex justify-start gap-2 ">
                                <span className="text-[13px] text-[#222222]">
                                  Account Number :
                                </span>
                                <span className="text-[13px] font-[400]">
                                  {bankAcountData?.accountNumber}
                                </span>
                              </div>
                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "accountNumber"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      bankAcountData?.accountNumber,
                                      "accountNumber",
                                    )
                                  }
                                />

                                {/* <span
        className="absolute top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
        Copied!
    </span> */}
                              </div>

                              {/* <div><FaCopy className="w-5 h-5 cursor-pointer text-[var(--secondary)]" onClick={() => navigator.clipboard.writeText(bankAcountData?.accountNumber)}/></div> */}
                            </div>
                            <div className="flex justify-between gap-2">
                              <div className="flex justify-start gap-2 ">
                                <span className="text-[13px] text-[#222222]">
                                  IFSC Code :
                                </span>
                                <span className="text-[13px] font-[400]">
                                  {bankAcountData?.ifscCode}
                                </span>
                              </div>
                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "ifscCode"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      bankAcountData?.ifscCode,
                                      "ifscCode",
                                    )
                                  }
                                />

                                {/* <span
        className="absolute top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
        Copied!
    </span> */}
                              </div>
                              {/* <div><FaCopy className="w-5 h-5 cursor-pointer text-[var(--secondary)]" onClick={() => navigator.clipboard.writeText(bankAcountData?.ifscCode)}/></div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {upiViewModal && (
                    <>
                      <div
                        className="flex flex-col border rounded-[15px] py-6 px-4 w-full"
                        style={{ backgroundColor: "#f3f2f6", opacity: 0.9 }}
                      >
                        <div className="grid grid-cols-1">
                          <div className="mt-2">
                            <div
                              style={{
                                backgroundImage: 'url("/manual-pg.png")',
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className=" text-gray-800">
                                <span className="text-xs text-gray-800 break-all">
                                  UPI: {showAccount?.filteredData?.upiId}
                                </span>
                              </div>

                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "upiId"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      showAccount?.filteredData?.upiId,
                                      "upiId",
                                    )
                                  }
                                />

                                {/* <span
        className="absolute top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
        Copied!
    </span> */}
                              </div>
                              {/* <button
                                                        onClick={() => navigator.clipboard.writeText(showAccount?.filteredData?.upiId)}
                                                        className="flex items-center text-[#116257] rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                                                    >
                                                        <FaCopy />
                                                    </button> */}
                            </div>
                          </div>
                          {/* <div className="mt-2 ">
                            <div
                              style={{
                                backgroundImage: 'url("/manual-pg.png")',
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className=" text-gray-800">
                                <span className="text-xs text-gray-800 break-all">
                                  MO.: {showAccount?.filteredData?.mobNo}
                                </span>
                              </div>
                              <div className="relative flex items-center group">
                                <FaCopy
                                  className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "mobNo"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                  onClick={() =>
                                    handleCopy(
                                      showAccount?.filteredData?.mobNo,
                                      "mobNo",
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div> */}
                        </div>

                        <div className="w-full flex py-4 px-4 justify-center gap-2 ">
                          {/* <span className="text-[12px] font-semibold capitalize">{selectedMethod} QR Code</span> */}
                          <img
                            src={showAccount?.filteredData?.image}
                            alt="QR Code"
                            title="QR Code"
                            className="h-[110px] w-full w-60 object-contain"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {cyptoViewModal && (
                    <div
                      className="flex flex-col border rounded-[15px] py-6 px-4 w-full"
                      style={{ backgroundColor: "#f3f2f6", opacity: 0.9 }}
                    >
                      <div className="grid grid-cols-1">
                        <div className="mt-2">
                          <div
                            style={{
                              backgroundImage: 'url("/manual-pg.png")',
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className=" text-gray-800">
                              <span className="text-xs text-gray-800 break-all">
                                WalletId: {allDetailsByUser?.crypto?.walletId}
                              </span>
                            </div>

                            <div className="relative flex items-center group">
                              <FaCopy
                                className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "walletId"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                onClick={() =>
                                  handleCopy(
                                    allDetailsByUser?.crypto?.walletId,
                                    "walletId",
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 ">
                          <div
                            style={{
                              backgroundImage: 'url("/manual-pg.png")',
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className=" text-gray-800">
                              <span className="text-xs text-gray-800 break-all">
                                WalletType.:{" "}
                                {allDetailsByUser?.crypto?.cryptoType}
                              </span>
                            </div>
                            <div className="relative flex items-center group">
                              <FaCopy
                                className={`w-5 h-5 cursor-pointer transition-all 
        ${
          copiedField === "cryptoType"
            ? "text-[var(--primary)] scale-110"
            : "text-[var(--secondary)]"
        }`}
                                onClick={() =>
                                  handleCopy(
                                    allDetailsByUser?.crypto?.cryptoType,
                                    "cryptoType",
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex py-4 px-4 justify-center gap-2 ">
                        {/* <span className="text-[12px] font-semibold capitalize">{selectedMethod} QR Code</span> */}
                        <img
                          src={allDetailsByUser?.crypto?.image}
                          alt="QR Code"
                          title="QR Code"
                          className="h-[110px] w-full w-60 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 w-full">
                  <div className="uppercase text-sm text-red-600 text-center w-full">
                    {" "}
                    {`min ₹${allDetailsByUser?.account?.fromAmount} max ₹${allDetailsByUser?.account?.toAmount}`}{" "}
                  </div>
                  <div className="grid md:grid-cols-1 gap-3 mb-6">
                    <div>
                      <label className="block text-[13px] text-[#212529] mb-2">
                        Unique Transaction Reference{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        className={`focus:outline-none px-4 bg-transparent placeholder:text-sm placeholder:text-gray-400 rounded w-full  border text-[#212529] text-[13px] py-2 ${
                          error.utrNo
                            ? "border-red-500 border-2"
                            : "border-gray-300"
                        }`}
                        type="number"
                        placeholder="6 to 12 Digit UTR Number"
                        value={payAccountFiel.utrNo}
                        onChange={inputChange}
                        id="utrNo"
                        name="utrNo"
                        maxLength={12}
                        minLength={6}
                      />
                      {error.utrNo && (
                        <div className="text-red-600 text-sm mt-1 font-bold">
                          {error.utrNo}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] text-[#212529] mb-1">
                        Upload Your Payment Proof{" "}
                        <span className="text-red-500">[Required]</span>
                      </label>
                      <input
                        type="file"
                        id="paymentProof"
                        className="hidden"
                        onChange={fileUpload}
                        // onChange={(e) =>
                        // setFileName(e.target.files[0]?.name || "No file chosen")
                        // }
                      />

                      <label
                        htmlFor="paymentProof"
                        className={`flex items-center border rounded cursor-pointer overflow-hidden
                                    ${error?.amount ? "border-red-500" : "border-gray-300"}
                                    `}
                      >
                        {/* Choose file button */}
                        <div className="bg-[#0f766e] text-white text-sm px-4 py-2">
                          Choose file
                        </div>

                        {/* Filename */}
                        <div className="px-3 text-sm text-gray-600">
                          {fileName}
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="text-[13px] text-[#212529]" htmlFor="">
                        Amount <span className="text-red-600">*</span>
                      </label>
                      <input
                        className={`focus:outline-none px-4  w-full border bg-gray-300 text-[#212529] text-[13px] py-2 ${
                          error.amount
                            ? "border-red-500 border-2"
                            : "border-gray-300"
                        }`}
                        type="number"
                        placeholder="Enter Amount"
                        id="amount"
                        name="amount"
                        value={payAccountFiel.amount}
                        onChange={inputChange}
                        onKeyPress={handleKeyPress}
                        min="100"
                        disabled
                      />
                      {payAccountFiel?.img && (
                        <div>
                          <img
                            src={payAccountFiel?.img}
                            alt=""
                            height={100}
                            width={100}
                          />
                        </div>
                      )}
                    </div>
                    <label className="flex items-start gap-2 text-xs border-b border-[#eee] pb-4 text-[#212529] cursor-pointer">
                      <input
                        type="checkbox"
                        checked
                        onChange={(e) => setChecked(e.target.checked)}
                        className="mt-[2px] w-4  rounded-lg h-4 accent-blue-300 cursor-pointer"
                      />

                      {/* Text */}
                      <span>
                        I have read and agree with the{" "}
                        <a
                          href="/terms-and-policy"
                          target="_blank"
                          className="text-[#116257] hover:text-[#004c52]"
                        >
                          terms of payment and withdrawal policy
                        </a>
                        .
                      </span>
                    </label>
                    <div className="flex justify-end">
                      <button
                        className="rounded w-full text-base font-[400] uppercase bg-green-800 hover:bg-[#008000] transition hover:text-white hover:bg-transparent text-white py-3 px-8"
                        onClick={payment1}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* )} */}
            </div>
          </>
        )}

        {selectedMethod && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

            {/* UTR Number and File Upload */}
            <div className="grid md:grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Screenshot
                </label>
                <div className="border-2 border-dashed bg-transparent border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={fileUpload}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl text-gray-400 mb-2">+</span>
                      <span className="text-sm text-gray-600">
                        {fileName || "Click to upload screenshot"}
                      </span>
                    </div>
                  </label>
                </div>
                {error.img && (
                  <div className="text-red-600 text-sm mt-1 font-bold">
                    {error.img}
                  </div>
                )}
              </div>
              {payAccountFiel?.img && (
                <div>
                  <img
                    src={payAccountFiel?.img}
                    alt=""
                    height={100}
                    width={100}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  UTR Number
                </label>
                <input
                  className={`focus:outline-none px-4 bg-transparent rounded-lg w-full border text-[#212529] text-[13px] py-3 ${
                    error.utrNo ? "border-red-500 border-2" : "border-gray-300"
                  }`}
                  type="number"
                  placeholder="Enter UTR Number"
                  value={payAccountFiel.utrNo}
                  onChange={inputChange}
                  id="utrNo"
                  name="utrNo"
                  maxLength={12}
                  minLength={6}
                />
                {error.utrNo && (
                  <div className="text-red-600 text-sm mt-1 font-bold">
                    {error.utrNo}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  className="rounded-lg w-full text-sm font-bold uppercase bg-green-800 hover:bg-[--white] hover:text-black hover:border-2 hover:border-green-800 text-white py-3 px-8"
                  onClick={payment1}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex flex-col w-full cardHover transition my-1">
          <div className="text-[12px] px-1 md:px-4 text-club4-second-text2 border border-[#eee] rounded text-[#ff0000] p-[20px] space-y-1">
            {[
              "1. Deposit money only in the below available accounts to get the fastest credits and avoid possible delays.",
              "2. Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.",
              "3. Site is not responsible for money deposited to Old, Inactive or Closed accounts.",
              "4. 4. After deposit, add your UTR and amount to receive balance.",
              "NEFT receiving times vary from 40 mins to 2 hours.",
              "5. NEFT receiving time varies from 40 minutes to 2 hours. ",
              "6. In case of account modification: payment valid for 1 hour after changing account details in deposit page. ",
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
}

export default Deposit;
