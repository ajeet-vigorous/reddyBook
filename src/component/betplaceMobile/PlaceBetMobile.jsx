/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react'
import { FaCircle, FaMinus, FaPlus } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import StakeSettings from '../profile/StakeSettings';

export const betChipsData = {
    "1000": 1000,
    "2000": 2000,
    "5000": 5000,
    "10000": 10000,
    "20000": 20000,
    "50000": 50000,
    "100000": 100000,
    "250000": 250000,
};

export default function PlaceBetMobile(props) {
    const { decreaseCount, count, setBetSlipData, handleButtonValues, increaseCount, placeBet, handleClose, betSlipData, betLoading, inputChange, isFetch, isMatchCoin } = props;
    const updateStackOnclic = (input) => {
        const numericInput = parseFloat(input);
        if (!isNaN(numericInput)) {
            setBetSlipData((state) => ({
                ...state,
                stake: Number(state.stake) + numericInput
            }));
        }
    };


    const betchipdata = localStorage.getItem("clientbetChipsData") ? Object.values(JSON.parse(localStorage.getItem("clientbetChipsData"))) : "";

    const myArray = Object.values(betChipsData);
    const modalRef = useRef();
    const [positions, setPositionData] = useState(0);
    const [editStake, setEditStake] = useState(false);


    useEffect(() => {
        if (betSlipData && betSlipData.position && betSlipData.position.length > 0) {
            betSlipData && betSlipData.position.forEach((eles) => {
                if (betSlipData.selectionId == eles._id) {
                    setPositionData(eles.position);
                }
            });
        }

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // handleClose(); // Close modal when clicking outside
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [betSlipData]);


    const [stake, setStack] = useState(0);
    let [placeButton, setPlaceButton] = useState(false)

    const updateInputValue = (event) => {
        const newValue = parseFloat(event.target.value);
        setStack(() => {
            const newStack = !isNaN(newValue) ? (newValue >= 0 ? newValue : 0) : 0;
            betSlipData.stake = newStack;
            if (betSlipData.stake > 0) {
                setPlaceButton(true);
            }
            if (betSlipData.stake <= 0) {
                setPlaceButton(false);
            }
            updateOddsPostModal()
            return newStack;
        });
    };

    // prevStack +
    const updateFinalBalance = (amount) => setStack(prevStack => {
        const newStack = Number(amount)
        betSlipData.stake = newStack;
        if (betSlipData.stake > 0) {
            setPlaceButton(true);
        }
        if (betSlipData.stake <= 0) {
            setPlaceButton(false);
        }
        return newStack
    });


    if (betSlipData.oddsType == "fancy") {
        // filterdata = runCount.session.filter(session => session.Selection_id == betSlipData.data.Selection_id);
    }

    if (betSlipData.oddsType == "bookmaker") {
        // filterdata = runCount.team_data.filter(session => session.selectionid == betSlipData.data.selectionid);

    }


    const arrayData = (element, isPlus = false) => {
        if (element > 0) {
            if (isPlus) {
                updateFinalBalance(betSlipData.stake + element);
            } else {
                updateFinalBalance(element);
            }
            updateOddsPostModal();
        }
    };


    // const arrayData = (element) => {
    //   if (element > 0) {
    //     updateFinalBalance(element);
    //     updateOddsPostModal()
    //   }
    // };

    const updateOddsPostModal = async () => {

        let oddsType = betSlipData?.oddsType
        let positionArray = {}
        let positionArrayNew = {}



        if (oddsType == "Match Odds" || oddsType == "Tied Match") {
            betSlipData?.nameOther?.map((oddsData) => {

                if (oddsData.selectionId == betSlipData.selectionId && betSlipData.betType == "L") {
                    positionArray[oddsData.selectionId] = betSlipData.stake * (betSlipData.odds - 1)
                }
                if (oddsData.selectionId == betSlipData.selectionId && betSlipData.betType == "K") {
                    positionArray[oddsData.selectionId] = -1 * betSlipData.stake * (betSlipData.odds - 1)
                }
                if (oddsData.selectionId != betSlipData.selectionId && betSlipData.betType == "L") {
                    positionArray[oddsData.selectionId] = -1 * betSlipData.stake
                }
                if (oddsData.selectionId != betSlipData.selectionId && betSlipData.betType == "K") {
                    positionArray[oddsData.selectionId] = betSlipData.stake
                }

                let currentPos = betSlipData.position[oddsData.selectionId] ? betSlipData.position[oddsData.selectionId] : 0
                let calculatePos = positionArray[oddsData.selectionId]




                positionArray[oddsData.selectionId] = Number(calculatePos) + Number(currentPos)
                positionArrayNew[oddsData.selectionId] = Number(calculatePos)

            })
        }

        if (oddsType == "toss" || oddsType == "bookmaker") {
            betSlipData?.nameOther.map((oddsData) => {

                if (oddsData.selectionid == betSlipData.selectionId && betSlipData.betType == "L") {
                    positionArray[oddsData.selectionid] = betSlipData.stake * (betSlipData.odds)
                }
                if (oddsData.selectionid == betSlipData.selectionId && betSlipData.betType == "K") {
                    positionArray[oddsData.selectionid] = -1 * betSlipData.stake * (betSlipData.odds)
                }
                if (oddsData.selectionid != betSlipData.selectionId && betSlipData.betType == "L") {
                    positionArray[oddsData.selectionid] = -1 * betSlipData.stake
                }
                if (oddsData.selectionid != betSlipData.selectionId && betSlipData.betType == "K") {
                    positionArray[oddsData.selectionid] = betSlipData.stake
                }

                let currentPos = betSlipData.position[oddsData.selectionid] ? betSlipData.position[oddsData.selectionid] : 0
                let calculatePos = positionArray[oddsData.selectionid]



                positionArray[oddsData.selectionid] = Number(calculatePos) + Number(currentPos)
                positionArrayNew[oddsData.selectionid] = Number(calculatePos)

            })
        }


        betSlipData.oldPos = betSlipData.position
        betSlipData.position = positionArray

    }

    const handleClear = () => {
        setStack(0);
        betSlipData.stake = 0;
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K'; // Convert to '1K', '2.5K' etc.
        }
        return num; // Return the number as is if it's less than 1000
    };

    return (
        <div className='xl:hidden flex justify-center items-start '>
            <div className={`xl:w-[50%] w-full relative   mx-auto ${betSlipData.type === "No"
                ? "bg-[var(--matchKhai)] "
                : "bg-[var(--matchLagai)]"
                } `}>
                {betLoading && <div className='absolute top-0 left-0 h-full w-full flex justify-center items-center bg-[#ffffffc5] '>
                    <span className="loaderbetPlace"></span>
                </div>
                }
                {/* <div className=" w-full  h-full flex justify-between bg-[var(--primary)] pt-1.5 pb-3 px-2 items-center">
                    <h2 className="text-white text-[16px] font-[700]" >
                        Placebet
                    </h2>
                    <div className='text-center pl-2' onClick={() => handleClose()}>
                        <IoCloseSharp className='text-white cursor-pointer ' size={24} />
                    </div>
                </div> */}
                <div className="flex  justify-between items-center space-x-1 text-black px-2 pt-2.5">
                    {/* <div className='p-1 font-medium text-[12px] capitalize'>
                        {betSlipData.name}
                    </div> */}
                    {/* <div className='text-black text-[12px]'>Profit: 0</div> */}
                    {/* <div className="bg-white my-1 rounded flex divide-x divide-gray-300">
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={decreaseCount}>-</span>
                            <span className="py-1 px-6 text-sm">{count && count ? count : 0}</span>
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={increaseCount}>+</span>
                        </div> */}
                </div>


                <div className="px-0 bg-[#ffffff45] grid grid-cols-2 justify-between items-center gap-2 mx-2 ">
                    <div className="flex flex-col">
                        {/* <span className="text-center text-[12px]">Odds</span> */}
                        <div className="flex items-center w-full overflow-hidden bg-white border border-gray-300 h-9">
                            <button className="h-9 py-[5px] px-1.5 text-white font-bold cursor-pointer bg-[#024F99]" onClick={decreaseCount}>
                                <FaMinus size={13} />
                            </button>
                            <div className=" flex justify-center items-center text-left py-[17px] text-sm w-full h-9">{count && count ? count : 0}</div>
                            <button className="h-9 flex justify-center items-center px-1.5 font-bold text-white cursor-pointer bg-[#024F99]" onClick={increaseCount}>
                                <FaPlus size={13} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        {/* <span className="text-center text-[12px]">Amount</span> */}
                        <input className="focus:outline-none text-sm w-full text-start px-2 py-4 bg-white h-8 border border-black" type="number" placeholder="0" value={betSlipData.stake} onChange={updateInputValue} />
                    </div>

                </div>

                {/* <div className="grid grid-cols-2 gap-4 px-3 py-2">
                        <div className="bg-white my-1 rounded flex divide-x divide-gray-300">
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={decreaseCount}>-</span>
                            <span className="py-1 px-6 text-sm">{count && count ? count : 0}</span>
                            <span className="py-1 px-2 font-bold cursor-pointer bg-[var(--secondary)]" onClick={increaseCount}>+</span>
                        </div>
                        <div className="bg-white flex divide-x divide-gray-300">
                            <input className="focus:outline-none text-sm w-20 text-start px-2 py-1" type="number" placeholder="0" value={betSlipData.stake} onChange={inputChange} />
                        </div>
                    </div> */}
                {/* {isFetch ?
                            <button className="bg-[var(--primary)]  px-2 py-1 text-sm text-white font-semibold relative" >Submit
                                <div className=" flex items-center justify-center absolute top-0 right-2 bg-transparent">
                                    <div className="w-5 h-5 rounded-full animate-spin border-[5px] border-solid border-[#ffffff] border-t-transparent"></div>
                                </div>
                            </button> :
                            <button className="bg-[var(--primary)] px-2 py-1 text-sm text-white font-semibold" onClick={() => { placeBet() }}>Submit</button>} */}
                {/* <div className='font-medium text-base text-center'>
                            0
                        </div> */}
                <div className="grid grid-cols-4 gap-[3px] px-2 py-2">
                    {/* {betchipdata && betchipdata.length > 0 && betchipdata.map((chip) => (
                            <button key={chip} className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic(chip)}>{chip}</button>
                        ))} */}

                    {betchipdata && betchipdata.length > 0 && betchipdata.map((item, chip) => (
                        <button key={chip} className="flex px-1.5 py-1 justify-center items-center bg-white text-black !border-0 "
                            onClick={() => updateStackOnclic(item)}>
                            <span className='text-green-500 text-sm font-[700]'> + </span> <span className='text-black text-[12px] font-[500]'> {formatNumber(item)}</span>
                        </button>
                    ))}
                    {/* <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("500")}>500</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("1000")}>1000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("2000")}>2000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("3000")}>3000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("4000")}>4000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("5000")}>5000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("10000")}>10000</button>
                        <button className="px-1.5 py-1 text-xs bg-[var(--secondary)] text-white font-bold" onClick={() => updateStackOnclic("20000")}>20000</button> */}
                </div>

                <div className='grid grid-cols-4 gap-[3px] px-2'>

                    <div className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#bd1828]  border-[1px] border-[#bd1828]  text-white text-center uppercase ld-over cursor-pointer `}
                        onClick={() => { }}>Min Stake
                        <div className="ld ld-ball ld-flip">
                        </div>
                    </div>
                    <div className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#6D081D]  border-[1px] border-[#bd1828]  text-white text-center uppercase ld-over cursor-pointer `}
                        onClick={() => { }}>Max Stake
                        <div className="ld ld-ball ld-flip">
                        </div>
                    </div>

                    <div className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#008000] text-white text-center uppercase ld-over cursor-pointer `}
                        onClick={() => { handleButtonValues(); setEditStake(true) }}>Edit Stake
                        <div className="ld ld-ball ld-flip">
                        </div>
                    </div>

                    <div className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#0b7d36] hover:bg-[#0b7d36]/90 border-[1px] border-[#0b7d36] hover:border-[#0b7d36]/90 text-white text-center uppercase ld-over cursor-pointer ${betLoading ? "opacity-50 border-2 border-green-900" : ""}`}
                        onClick={() => { handleClear() }}>
                        <b className='flex justify-center items-center'>
                            Clear

                        </b>
                        <div className="ld ld-ball ld-flip">
                        </div>
                    </div>



                </div>

                <div className="text-red-600 text-xs font-semibold  pl-2">
                    min Bet :100 max Bet :{isMatchCoin?.max}
                </div>

                <div className='grid grid-cols-2 gap-1 p-1'>
                    <div>
                        <div className={` px-4 py-1.5 text-[13px] font-[500] btn bg-[#F96F72] text-center uppercase text-white ld-over cursor-pointer `}
                            onClick={() => handleClose()}>Cancel
                            <div className="ld ld-ball ld-flip">
                            </div>
                        </div>
                    </div>
                    <div>

                        <div className={` px-4 py-1.5 text-[13px] font-[500] btn bg-[#249C59] text-center uppercase text-white ld-over cursor-pointer `}
                            onClick={() => { placeBet() }}>Placer Bet
                            <div className="ld ld-ball ld-flip">
                            </div>
                        </div>
                    </div>

                </div>
                {
                    editStake && <div onClick={(e) => { setEditStake(false); e.stopPropagation() }} className='fixed px-2 inset-0 z-50 top-0 left-0 h-full w-full flex justify-center items-start bg-black/50 '>
                        <div onClick={(e) => { e.stopPropagation() }} className='w-[450px]  mt-6 bg-white '>

                            <div className='bg-black flex justify-between items-center text-white p-2 w-full' >Stacke  <span onClick={(e) => { setEditStake(false); e.stopPropagation() }}>X</span></div>

                            <div className='p-2'>
                                <StakeSettings />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>

    );
}

