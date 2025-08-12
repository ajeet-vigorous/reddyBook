import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';
import Overview from '../../component/profile/Overview';
import StakeSettings from '../../component/profile/StakeSettings';
import ChangePassword from '../../component/profile/ChangePassword';
import { useLocation, useNavigate } from 'react-router-dom';

const MarketAnalysis = () => {

    return (
        <>

            <div className='w-full'>

                <div className='bg-[var(--darkcolor)] uppercase text-black py-1 px-1.5'>
                    <h2 className='text-[14px] text-white'>Market Analysis</h2>
                </div>
                <div className='bg-white shadow-[0_1px_6px_#00000017] mt-1  text-center'>
                    <div className='text-[24px] text-[#444444] p-5'>There are currently no followed multi markets, please add some markets from events.</div>
                </div>
            </div>
        </>
    );
};


export default MarketAnalysis;