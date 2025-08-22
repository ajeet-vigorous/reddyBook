import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import Overview from '../../component/profile/Overview';
import StakeSettings from '../../component/profile/StakeSettings';
import ChangePassword from '../../component/profile/ChangePassword';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {

    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('stacksettings')) {
            setActiveTab('stacksettings');
        } else if (path.includes('changepassword')) {
            setActiveTab('changepassword');
        } else if (path.endsWith('/profile')) {
            setActiveTab('profile');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'stacksettings') {
            navigate("/profile/stacksettings");
        } else if (tab === 'changepassword') {
            navigate("/profile/changepassword");
        } else {
            navigate("/profile");
        }
    };


    return (
        <>

            <div className='w-full'>

                <div className='bg-[var(--darkcolor)] uppercase text-black py-1 px-1.5'>
                    <h2 className='text-[13px] text-white'>PROFILE</h2>
                </div>

                <div className='lg:flex justify-between items-start lg:space-x-5 w-full mt-2'>

                    <div className='lg:w-[35%] border rounded-md shadow-xl bg-white p-5 border-gray-200 w-full flex flex-col justify-center items-center'>
                        <img src={"/dashbaord/profile_image.png"} className='w-[120px] h-[120px]' />
                        <p className='font-[900] uppercase mt-[10px] text-[30px] tracking-wider'>
                            {user && user?.data && user?.data?.username}
                        </p>
                    </div>


                    <div className='lg:w-[65%] w-full border rounded-md shadow-lg px-3 bg-white  border-gray-100'>
                        <div className='flex border-b border-gray-200 w-full justify-center items-center text-center'>
                            <button
                                className={`px-4 py-2 sm:text-[13px] text-xs font-[600] uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'profile' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => handleTabChange('profile')}
                            >
                                overview
                            </button>
                            <button
                                className={`px-4 py-2 sm:text-[13px] text-xs font-[600] uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'stacksettings' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => handleTabChange('stacksettings')}
                            >
                                stack settings
                            </button>
                            <button
                                className={`px-4 py-2 sm:text-[13px] text-xs font-[600] uppercase w-full whitespace-nowrap tracking-wide ${activeTab === 'changepassword' ? 'text-black border-b-2 border-[var(--secondary)]' : 'text-black hover:text-[var(--secondary)]'}`}
                                onClick={() => handleTabChange('changepassword')}
                            >
                                CHANGE PASSWORD
                            </button>
                        </div>
                        <>
                            {activeTab === 'profile' && (
                                <>
                                    <Overview />
                                </>
                            )}

                            {activeTab === 'stacksettings' && (
                                <>
                                    <StakeSettings />
                                </>
                            )}


                            {activeTab === 'changepassword' && (
                                <>
                                    <ChangePassword />
                                </>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Profile;