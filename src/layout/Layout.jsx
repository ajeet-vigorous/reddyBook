
import AppSidebar from '../component/layout/AppSidebar'
import AppHeader from '../component/layout/AppHeader'
import AppContent from '../component/layout/AppContent'
import SubHeader from '../component/header/SubHeader'
import { useEffect, useState } from 'react'



const Layout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

    const handleToggle = () => {
        document.body.classList.toggle("StakeModalOpen");
    };
    useEffect(() => {
        const checkSidebarStatus = () => {
            setIsStakeModalOpen(document.body.classList.contains("StakeModalOpen"));
        };
        checkSidebarStatus();
        const observer = new MutationObserver(checkSidebarStatus);
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);


    return (

        <section className="w-full h-screen flex flex-col overflow-hidden relative">
              <div id="otpless-login-page"></div>
            <div className="shrink-0 z-10 lg:bg-white bg-black">
                <div className="">
                    <AppHeader setSidebarOpen={setIsSidebarOpen} />
                </div>
                <div>
                    <SubHeader setSidebarOpen={setIsSidebarOpen} />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className={`${isSidebarOpen ? 'fixed' : 'hidden'} 
                lg:relative lg:block inset-0 lg:inset-auto lg:w-[250px] w-[55%] h-screen lg:h-auto z-20 lg:z-auto bg-white overflow-y-auto scrollbar-hide`}>
                    <AppSidebar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </div>

                <div className={`flex-1 overflow-y-auto bg-[var(--backgroundmain)] ${isSidebarOpen ? 'lg:ml-[0px] fixed inset-0 lg:static' : ''}`}>
                    <div className="lg:p-4 p-1 h-full">
                        <AppContent />
                    </div>
                </div>

                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </section>
    )
}

export default Layout;




{/* <div className="lg:block hidden ">
                        <div className="bg-white w-full flex justify-start items-center overflow-hidden">
                            <div className="w-[2%] bg-[var(--secondary)] px-[2px] z-[50]">
                                <img src='/subHeader/commentary.png' className="w-[22px] h-[22px]" />
                            </div>
                            <div className="w-[98%]">
                                <div className='px-[2px] text-black bg-[var(--secondary)] '>
                                    <div className=" px-1 py-[2px] font-[700] tracking-wide animate-[marquee_40s_linear_infinite]  text-white text-[12px] whitespace-nowrap uppercase  ">
                                        🏏 THE HUNDRED WOMEN'S & MEN'S CUP WINNER🏆 AND FANCY MARKET STARTED IN OUR EXCHANGE 🏏 🎾 ATP TORONTO & WTA MONTREAL 🏆 CUP WINNER BETS STARTED IN OUR EXCHANGE 🎾 🏏 OUR EXCLUSIVE PREMIUM MARKET FOR (SRL) IS NOW STARTED IN OUR EXCHANGE 🏏 DREAM BIG WIN BIG
                                    </div>
                                    <style>
                                        {`  @keyframes marquee {
                                            0% { transform: translateX(100%); }
                                            100% { transform: translateX(-100%); }
                                            }`}
                                    </style>
                                </div>
                            </div>
                        </div>
                    </div> */}