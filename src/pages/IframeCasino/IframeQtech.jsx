

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Loader from "../../component/loader/Loader";
import { apiCall } from "../../config/HTTP";
import { domainName } from "../../config/Auth";
import settings from "../../domainConfig";


const IframeQtech = (props) => {
    const [casinoData, setCasinoData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorType, setErrorType] = useState(0);
    const [resMessage, setResMessage] = useState("");

    let { gameId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        getCasinoData('Casino');

        if (showAlert) {
            const timeout = setTimeout(() => {
                setShowAlert(false);

            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, []);


    const handleIframeLoad = () => {
        setLoading(false);
    };


    const getCasinoData = async () => {

        try {
            let casinoLogin = {
                "gameId": gameId,
                "platformId": "mobile",
                "redirectUrl": `${window.location.origin}/dashboard`,
                // "theme": "bmx",
                "isLobby": false,
                "mode": "real"
            };

            let casinoLoginResponse = await apiCall("POST",'user/qtechLoginUrl', casinoLogin);

            if (casinoLoginResponse) {
                setLoading(true);
                setCasinoData(casinoLoginResponse && casinoLoginResponse.data ? casinoLoginResponse.data : {});
                setLoading(false);
            } else {
                // setShowAlert(true);
                // setErrorType(1);
                // setResMessage("Something went wrong");
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000)
            }

        } catch (error) {
            // console.error("Error fetching casino data:", error);
            // setShowAlert(true);
            // setErrorType(1);
            // setResMessage("Something went wrong");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000)

        }

    };
  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    return (
        <div className='iframeCasinoMain md:pb-1 pb-8'>
            <div className="w-full px-2 uppercase py-2 flex justify-between bg-[#116257] cursor-pointer">
<div className=" text-white text-xs px-2 flex items-center" onClick={() => window.location.href = '/'}> 
    <FaHome color="white" size={20}/> <img src={settings.logo} alt="" width={100}/>
</div>
<div className="text-lg font-bold text-white">{user?.data?.username}</div>
      </div>
            {showAlert && <div className={`absolute top-[2%] right-[2%] px-5 py-3 z-30 ${errorType === 1 ? "bg-red-600" : "bg-green-600"}  rounded`}><span className='white-text font-bold'>{resMessage}</span></div>}
            {loading === true ?
                <Loader />
                : null}

            {casinoData ? (
                <>
                    {loading === true ?
                        <Loader />
                        : null}
                    <div className="afterFooter h-[100dvh] mb-20">
                        <iframe src={casinoData.url} title=" " loading='lazy' className=" mx-auto w-[100%] h-full" onLoad={handleIframeLoad} />
                    </div>
                </>

            ) : <Loader />
            }

        </div>
    );
};

export default IframeQtech;
