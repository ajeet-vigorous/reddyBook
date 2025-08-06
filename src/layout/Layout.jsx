
import AppSidebar from '../component/layout/AppSidebar'
import AppHeader from '../component/layout/AppHeader'
import AppContent from '../component/layout/AppContent'
import SubHeader from '../component/header/SubHeader'



const Layout = () => {


    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="lg:h-[60px] lg:bg-white bg-black hrink-0">
                <AppHeader />
            </div>
            <div className="shrink-0">
                <SubHeader />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-[280px] overflow-y-auto shrink-0 hidden xl:block">
                    <AppSidebar />
                </div>
                <div className="flex-1 overflow-y-auto lg:border-[12px] border-[#d6e0e4]">
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
                    <AppContent />
                </div>

            </div>
        </div>
    )
}

export default Layout
