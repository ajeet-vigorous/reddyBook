import React from 'react'

function MarqueeNotification() {
    const clientdomainSettingData = JSON.parse(localStorage.getItem('clientdomainSetting'));

    return (

        <section>

            <div className="lg:block hidden">
                <div className="bg-white w-full flex justify-start items-center overflow-hidden">
                    {/* <div className="w-[4%] bg-[var(--secondary)] px-[3px]">
                        <img src='/subHeader/commentary.png' className="w-[22px] h-[22px]" />
                    </div> */}
                    <div className="w-[100%]">
                        <div className='px-[2px] text-black bg-[var(--secondary)] '>
                            <div className=" px-1 py-[2px] font-[700] tracking-wide animate-[marquee_40s_linear_infinite]  text-white text-[12px] whitespace-nowrap uppercase  ">
                                {clientdomainSettingData?.clientNotification !== undefined && clientdomainSettingData?.clientNotification !== null ? clientdomainSettingData?.clientNotification :
                                    "🏏 THE HUNDRED WOMEN'S & MEN'S CUP WINNER🏆 AND FANCY MARKET STARTED IN OUR EXCHANGE 🏏 🎾 ATP TORONTO & WTA MONTREAL 🏆 CUP WINNER BETS STARTED IN OUR EXCHANGE 🎾 🏏 OUR EXCLUSIVE PREMIUM MARKET FOR (SRL) IS NOW STARTED IN OUR EXCHANGE 🏏 DREAM BIG WIN BIG "
                                }
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
            </div>

            <div className="lg:hidden block ">
                <div className="bg-white w-full flex justify-start items-center overflow-hidden">
                    {/* <div className="w-[10%] bg-white px-[2px] z-[50]">
                        <img src='/subHeader/commentary.png' className="w-[22px] h-[22px]" />
                    </div> */}
                    <div className="w-[100%]">
                        <div className=" px-1 py-[2px] font-[700] tracking-wide animate-[marquee_30s_linear_infinite]  text-black text-[12px] whitespace-nowrap uppercase  ">
                            {clientdomainSettingData?.clientNotification !== undefined && clientdomainSettingData?.clientNotification !== null ? clientdomainSettingData?.clientNotification :
                                "🏏 THE HUNDRED WOMEN'S & MEN'S CUP WINNER🏆 AND FANCY MARKET STARTED IN OUR EXCHANGE 🏏 🎾 ATP TORONTO & WTA MONTREAL 🏆 CUP WINNER BETS STARTED IN OUR EXCHANGE 🎾 🏏 OUR EXCLUSIVE PREMIUM MARKET FOR (SRL) IS NOW STARTED IN OUR EXCHANGE 🏏 DREAM BIG WIN BIG "
                            }
                        </div>
                        <style>
                            {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
                        </style>
                    </div>
                </div>
            </div>

        </section>

    )
}

export default MarqueeNotification;