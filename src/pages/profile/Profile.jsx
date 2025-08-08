import React, { useEffect, useState } from 'react';
import { updatePassword } from '../../redux/reducers/auth.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { domainName } from '../../config/Auth';
import settings from '../../domainConfig';

const ChangePassword = () => {

    const [activeTab, setActiveTab] = useState('profile');
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

    const [balance, setBalance] = useState({
        coins: "",
        exposure: "",
    });
    const [fieldslogin, setFieldsLogin] = useState({});
    const [errorslogin, setErrorsLogin] = useState({});
    const dispatch = useDispatch();
    const inputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFieldsLogin((prevState) => ({ ...prevState, [name]: value }));
        setErrorsLogin((prevState) => ({ ...prevState, [name]: '' }));
    };

    const { updatePassword_loading } = useSelector((state) => state.authUser);



    const changePassword = (e) => {
        if (handleValidationLogin()) {
            const data = {
                oldPassword: fieldslogin.oldPassword,
                password: fieldslogin.password,
                confirmPassword: fieldslogin.confirmPassword
                // transactionPassword: fieldslogin.oldPassword,
            };

            dispatch(updatePassword(data)).then(((req) => {
                if (req.meta.requestStatus == "fulfilled") {
                    message.success(req?.payload?.message);
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1000);


                } else {
                    console.log(req?.payload, "Password update failed.");

                    // message.error(req?.payload || "Password update failed.");
                }
            }));

        }
    };

    const handleValidationLogin = () => {
        let errorslogin = {};
        let formIsValid = true;

        if (!fieldslogin.oldPassword || fieldslogin.oldPassword === '') {
            formIsValid = false;
            errorslogin.oldPassword = 'Current Password is required';
        }

        if (!fieldslogin.password || fieldslogin.password === '') {
            formIsValid = false;
            errorslogin.password = 'New Password is required';
        }
        if (!fieldslogin["confirmPassword"] || fieldslogin["confirmPassword"] === "") {
            formIsValid = false;
            errorslogin["confirmPassword"] = "New Password Confirmation is required";
        } else if (fieldslogin["password"] !== fieldslogin["confirmPassword"]) {
            formIsValid = false;
            errorslogin["confirmPassword"] = "Passwords and Confirm Password do not match";
        } else {
            errorslogin["confirmPassword"] = "";
        }

        setErrorsLogin(errorslogin);
        return formIsValid;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            changePassword(e);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            let Balance = JSON.parse(localStorage.getItem("clientBalance"));
            let clientExposure = JSON.parse(localStorage.getItem("clientExposure"));
            setBalance({
                coins: Balance,
                exposure: clientExposure,
            });
        }, 1000);
    }, [balance]);

    return (
        <>

            <div className='w-full'>

                <div className='bg-[var(--darkcolor)]  text-black p-1'>
                    <h2 className='text-[14px] text-white'>PROFILE</h2>
                </div>

                <div className='lg:flex justify-between items-start lg:space-x-5 w-full mt-2'>

                    <div className='lg:w-[35%] border rounded-md shadow-xl bg-white p-5 border-gray-200 w-full flex flex-col justify-center items-center'>
                        <img src={"/dashbaord/profile_image.png"} className='w-[120px] h-[120px]' />
                        <p className='font-[900] uppercase mt-[10px] text-[30px] tracking-wider'>
                            {user && user?.data && user?.data?.username}
                        </p>
                    </div>


                    <div className='lg:w-[65%] w-full border rounded-md shadow-xl px-3 bg-white  border-gray-100'>
                        <div className='flex border-b border-gray-200 w-full justify-center items-center text-center'>
                            <button
                                className={`px-4 py-2 sm:text-sm text-xs font-medium uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'profile' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                overview
                            </button>
                            <button
                                className={`px-4 py-2 sm:text-sm text-xs font-medium uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'stake' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => setActiveTab('stake')}
                            >
                                stack settings
                            </button>
                            <button
                                className={`px-4 py-2 sm:text-sm text-xs font-medium uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'password' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => setActiveTab('password')}
                            >
                                CHANGE PASSWORD
                            </button>
                        </div>
                        <>
                            {activeTab === 'profile' && (
                                <>
                                    <div className='py-4 px-2'>
                                        <span className='flex justify-start items-center space-x-1 py-3 text-[18px] text-[var(--secondary)]'>
                                            <p>Welcome to {settings.domainName},</p>
                                            <p className='font-[700]'>
                                                {user && user?.data && user?.data?.username}
                                            </p>
                                        </span>

                                        <div className='space-y-2 text-[12px] text-[#444444] font-[600]'>
                                            <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                                <span className='sm:w-[234px] w-1/2'>User Id :</span>
                                                <span> {user && user?.data && user?.data?.username}</span>
                                            </div>
                                            <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                                <span className='sm:w-[234px] w-1/2'>Available Chips :</span>
                                                <span>{balance && balance.coins
                                                    ? Number(balance.coins).toFixed(2)
                                                    : "0"}</span>
                                            </div>
                                            <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                                <span className='sm:w-[234px] w-1/2'>Exposure :</span>
                                                <span>{balance && balance.exposure ? Number(balance.exposure).toFixed(2) : "0"}</span>
                                            </div>
                                            <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                                <span className='sm:w-[234px] w-1/2'>Total Chips :</span>
                                                <span>0.00</span>
                                            </div>
                                            <div className='flex justify-start items-center space-x-4 border-b-[1px] py-[2px] border-[#dee2e6]'>
                                                <span className='sm:w-[234px] w-1/2'>Profit/Loss :</span>
                                                <span>0.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'stake' && (
                                <>
                                    STAKE
                                </>
                            )}


                            {activeTab === 'password' && (
                                <>
                                    <div className='w-full'>
                                        <div className='p-2 mb-4'>
                                            <div className='space-y-0'>
                                                <div className="form-group flex justify-start items-center space-x-2">
                                                    <div className="text-black font-normal text-md !mb-2" htmlFor="oldPassword">Current Password:</div>
                                                    <input
                                                        id="oldPassword"
                                                        className='w-full border border-gray-400 bg-white p-2 focus:outline-none text-xs md:text-sm font-[400] text-gray-500 rounded'
                                                        type="password"
                                                        name="oldPassword"
                                                        placeholder='Enter Current Password'
                                                        value={fieldslogin.oldPassword}
                                                        onChange={inputChange}
                                                        onKeyPress={handleKeyPress}
                                                    />
                                                    <div className="h-[16px] mb-1 flex items-start">
                                                        <span className={`text-[#FF0000] text-[13px] w-full lg:w-3/4 ${errorslogin?.oldPassword ? "opacity-100" : "opacity-0"}`}>
                                                            {errorslogin?.oldPassword || "Placeholder"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="form-group flex justify-start items-center space-x-2">
                                                    <div className="text-black font-normal text-md !mb-2" htmlFor="password">New Password:</div>
                                                    <input
                                                        className='w-full border border-gray-400 p-2 bg-white focus:outline-none md:text-sm text-xs font-[400] text-gray-500 rounded'
                                                        type="password"
                                                        name="password"
                                                        placeholder='Enter New Password'
                                                        id="password"
                                                        value={fieldslogin.password}
                                                        onChange={inputChange}
                                                        onKeyPress={handleKeyPress}
                                                    />

                                                    <div className="h-[16px] mb-1 flex items-start">
                                                        <span className={`text-[#FF0000] text-[13px] w-full lg:w-3/4 ${errorslogin?.password ? "opacity-100" : "opacity-0"}`}>
                                                            {errorslogin?.password || "Placeholder"}
                                                        </span>
                                                    </div>


                                                    {/* {errorslogin && errorslogin["password"] &&
                                            <div className="flex justify-start">
                                                <div className="text-[#FF0000] text-[13px] w-full lg:w-3/4">
                                                    {errorslogin["password"]}
                                                </div>
                                            </div>
                                        } */}
                                                </div>

                                                <div className="form-group flex justify-start items-center space-x-2 ">
                                                    <div className="text-black font-normal text-md !mb-2" htmlFor="transactionPassword">Confirm Password:</div>
                                                    <input
                                                        className='w-full border border-gray-400 bg-white p-2 focus:outline-none md:text-sm text-xs font-[400] text-gray-500 rounded'
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder='Confirm New Password'
                                                        value={fieldslogin.confirmPassword}
                                                        onChange={inputChange}
                                                        onKeyPress={handleKeyPress}
                                                    />
                                                    {/* {errorslogin && errorslogin["confirmPassword"] &&
                                            <div className="flex justify-start">
                                                <div className="text-[#FF0000] text-[13px] w-full lg:w-3/4">
                                                    {errorslogin["confirmPassword"]}
                                                </div>
                                            </div>
                                        } */}

                                                    <div className="h-[16px] mb-1 flex items-start">
                                                        <span className={`text-[#FF0000] text-[13px] w-full lg:w-3/4 ${errorslogin?.confirmPassword ? "opacity-100" : "opacity-0"}`}>
                                                            {errorslogin?.confirmPassword || "Placeholder"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="py-2 px-4 hover:opacity-85 bg-[var(--primary)] text-white text-md w-full mt-4 flex items-center justify-center gap-2"
                                                        onClick={() => changePassword()}
                                                    >
                                                        {/* <div className='bg-fuchsia-800 rounded-full'>
                                                <svg
                                                    viewBox="0 0 100 100"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                >
                                                    <g>
                                                        <g className="animate-spin origin-center">
                                                            <g transform="translate(12, 6)" fill="#BCBCBC">
                                                                <path d="M2.04,19.93C3.08,18.03,14.07,0.34,38.46,0.17C64.05,-0.01,75.35,20.25,75.73,21.12C77.42,25,76.7,29.99,73.13,31.77C69.04,33.81,64.77,32.59,62.48,29.36C57.77,22.74,57.25,14.39,45.13,9.44C18.87,-1.3,0.97,21.86,2.02,19.93Z M75.19,68.33C74.17,70.22,63.17,87.92,38.78,88.08C13.19,88.25,1.88,68.01,1.5,67.11C-0.21,63.25,0.52,58.27,4.07,56.49C8.17,54.45,12.45,55.68,14.73,58.9C19.45,65.54,19.96,73.87,32.08,78.82C58.36,89.54,76.27,66.41,75.19,68.33Z" />
                                                            </g>
                                                        </g>

                                                        <g transform="translate(56, 50.1) scale(0.8) translate(-25, -25)">
                                                            <path fill="#dfb355" d="M23.41,0c.22,3.5-1.33,6.1-4.13,8.03-1.05.73-2.28.93-3.65.83.05-.64.02-1.3.15-1.92.69-3.52,3.44-6.21,6.97-6.87.07-.01.14-.05.21-.07.15,0,.3,0,.45,0Z" />
                                                            <path fill="#dfb355" d="M31.48,28.3c-.24.61-.44,1.2-.69,1.77-1,2.32-2.37,4.41-4,6.34-.85,1.01-1.86,1.8-3.21,2.02-1.12.18-2.19-.07-3.24-.45-.74-.27-1.48-.56-2.23-.78-1.41-.4-2.8-.24-4.17.24-.96.33-1.91.67-2.88.96-1.2.36-2.34.09-3.3-.66-.78-.6-1.53-1.27-2.15-2.03C2.74,32.24.92,28.27.25,23.8c-.37-2.48-.39-4.95.43-7.36,1.11-3.26,3.16-5.63,6.52-6.7,1.63-.52,3.26-.45,4.87.1.95.32,1.88.69,2.82,1.03.77.29,1.51.18,2.27-.08,1.38-.48,2.75-1.1,4.18-1.31,3.58-.53,6.67.45,8.93,3.46.04.06.08.12.14.22-2.9,1.83-4.36,4.4-4.11,7.88.25,3.46,2.09,5.78,5.17,7.26Z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div> */}
                                                        Change Password
                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};


export default ChangePassword;