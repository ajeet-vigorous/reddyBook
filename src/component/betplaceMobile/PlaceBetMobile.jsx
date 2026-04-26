/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { FaCircle, FaMinus, FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import StakeSettings from "../profile/StakeSettings";
import BetPlaceCounter from "../betPlaceCounter/BetPlaceCounter";

export const betChipsData = {
  1000: 1000,
  2000: 2000,
  5000: 5000,
  10000: 10000,
  20000: 20000,
  50000: 50000,
  100000: 100000,
  250000: 250000,
};

export default function PlaceBetMobile(props) {
  const {
    decreaseCount,
    count,
    setBetSlipData,
    handleButtonValues,
    increaseCount,
    placeBet,
    handleClose,
    betSlipData,
    betLoading,
    inputChange,
    isFetch,
    isMatchCoin,
  } = props;

  const updateStackOnclic = (input) => {
    const numericInput = parseFloat(input);
    if (!isNaN(numericInput)) {
      setBetSlipData((state) => ({
        ...state,
        stake: Number(state.stake) + numericInput,
      }));
    }
  };

  const betchipdata = localStorage.getItem("clientbetChipsData")
    ? Object.values(JSON.parse(localStorage.getItem("clientbetChipsData")))
    : "";

  const myArray = Object.values(betChipsData);
  const modalRef = useRef();
  const [positions, setPositionData] = useState(0);
  const [editStake, setEditStake] = useState(false);

  useEffect(() => {
    if (
      betSlipData &&
      betSlipData.position &&
      betSlipData.position.length > 0
    ) {
      betSlipData &&
        betSlipData.position.forEach((eles) => {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [betSlipData]);

  const [stake, setStack] = useState(0);
  let [placeButton, setPlaceButton] = useState(false);

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
      updateOddsPostModal();
      return newStack;
    });
  };

  // prevStack +
  const updateFinalBalance = (amount) =>
    setStack((prevStack) => {
      const newStack = Number(amount);
      betSlipData.stake = newStack;
      if (betSlipData.stake > 0) {
        setPlaceButton(true);
      }
      if (betSlipData.stake <= 0) {
        setPlaceButton(false);
      }
      return newStack;
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

const updateOddsPostModal = () => {
  if (!betSlipData) return;

  // Save original market position only once
  if (!betSlipData.oldPos) {
    betSlipData.oldPos = { ...(betSlipData.position || {}) };
  }

  // If stake is zero or empty, restore original position
  if (Number(betSlipData.stake) <= 0) {
    betSlipData.position = { ...betSlipData.oldPos };
    return;
  }

  const oddsType = betSlipData?.oddsType;
  const positionArray = {};

  // MATCH ODDS / TIED MATCH
  if (oddsType === "Match Odds" || oddsType === "Tied Match") {
    betSlipData?.nameOther?.forEach((oddsData) => {
      let calculatedPos = 0;

      const selectionId = oddsData.selectionId;
      const isSelected =
        selectionId === betSlipData.selectionId;

      if (isSelected) {
        calculatedPos =
          betSlipData.betType === "L"
            ? Number(betSlipData.stake) *
              (Number(betSlipData.odds) - 1)
            : -Number(betSlipData.stake) *
              (Number(betSlipData.odds) - 1);
      } else {
        calculatedPos =
          betSlipData.betType === "L"
            ? -Number(betSlipData.stake)
            : Number(betSlipData.stake);
      }

      const currentPos =
        Number(betSlipData.oldPos?.[selectionId]) || 0;

      positionArray[selectionId] =
        currentPos + calculatedPos;
    });
  }

  // BOOKMAKER / TOSS
  if (oddsType === "bookmaker" || oddsType === "toss") {
    betSlipData?.nameOther?.forEach((oddsData) => {
      let calculatedPos = 0;

      const selectionId = oddsData.selectionid;
      const isSelected =
        selectionId === betSlipData.selectionId;

      if (isSelected) {
        calculatedPos =
          betSlipData.betType === "L"
            ? Number(betSlipData.stake) *
              Number(betSlipData.odds)
            : -Number(betSlipData.stake) *
              Number(betSlipData.odds);
      } else {
        calculatedPos =
          betSlipData.betType === "L"
            ? -Number(betSlipData.stake)
            : Number(betSlipData.stake);
      }

      const currentPos =
        Number(betSlipData.oldPos?.[selectionId]) || 0;

      positionArray[selectionId] =
        currentPos + calculatedPos;
    });
  }

  betSlipData.position = positionArray;
};
  const handleClear = () => {
    setStack(0);
    betSlipData.stake = 0;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"; // Convert to '1K', '2.5K' etc.
    }
    return num; // Return the number as is if it's less than 1000
  };

  return (
    <div className="xl:hidden flex justify-center items-start ">
      <div
        className={`xl:w-[50%] w-full relative   mx-auto ${
          betSlipData.type === "No"
            ? "bg-[var(--matchKhai)] "
            : "bg-[var(--matchLagai)]"
        } `}
      >
        {betLoading && (
          <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-[#ffffffc5] ">
            <BetPlaceCounter />
          </div>
        )}
 
        <div className="flex  justify-between items-center space-x-1 text-black px-2 pt-2.5">
          <div className="p-1 font-medium text-[12px] capitalize">
            {betSlipData.name}
          </div>
          <div className="flex">
            {Array?.isArray(betSlipData?.nameOther) &&
            betSlipData.nameOther.length <= 3
              ? betSlipData?.nameOther?.map((other, index) => (
                  <React.Fragment key={index}>
                    <div className="text-sm font-bold pr-2">
                      {betSlipData.oddsType == "Match Odds" ||
                      betSlipData.oddsType == "Tied Match" ? (
                        <span
                          className={`${
                            !isNaN(betSlipData.position[other.selectionId]) &&
                            parseFloat(betSlipData.position[other.selectionId])
                              .toFixed(2)
                              .replace(/\.?0+$/, "") < 0
                              ? "text-red-500"
                              : "text-green-700"
                          } font-bold col-12 text-center`}
                        >
                          {!isNaN(betSlipData.position[other.selectionId])
                            ? parseFloat(
                                betSlipData.position[other.selectionId],
                              )
                                .toFixed(2)
                                .replace(/\.?0+$/, "")
                            : ""}
                        </span>
                      ) : betSlipData.oddsType == "fancy" ? null : (
                        <span
                          className={`${
                            !isNaN(betSlipData.position[other.selectionid]) &&
                            parseFloat(betSlipData.position[other.selectionid])
                              .toFixed(2)
                              .replace(/\.?0+$/, "") < 0
                              ? "text-red-500"
                              : "text-green-700"
                          } font-bold col-12 text-center`}
                        >
                          {!isNaN(betSlipData.position[other.selectionid])
                            ? parseFloat(
                                betSlipData.position[other.selectionid],
                              )
                                .toFixed(2)
                                .replace(/\.?0+$/, "")
                            : ""}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                ))
              : null}
          </div>
      
        </div>

        <div className="px-0 bg-[#ffffff45] grid grid-cols-2 justify-between items-center gap-2 mx-2 ">
          <div className="flex flex-col">
            {/* <span className="text-center text-[12px]">Odds</span> */}
            <div className="flex items-center w-full overflow-hidden bg-white border border-gray-300 h-9">
              <button
                className="h-9 py-[5px] px-1.5 text-white font-bold cursor-pointer bg-[#024F99]"
                onClick={decreaseCount}
              >
                <FaMinus size={13} />
              </button>
              <div className=" flex justify-center items-center text-left py-[17px] text-sm w-full h-9">
                {betSlipData.oddsType === "fancy" ? betSlipData.run : count}
              </div>
              <button
                className="h-9 flex justify-center items-center px-1.5 font-bold text-white cursor-pointer bg-[#024F99]"
                onClick={increaseCount}
              >
                <FaPlus size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full">
            {/* <span className="text-center text-[12px]">Amount</span> */}
            <input
              className="focus:outline-none text-sm w-full text-start px-2 py-4 bg-white h-8 border border-black"
              type="text"
              placeholder="0"
              value={betSlipData.stake}
              onChange={updateInputValue}
            />
          </div>
        </div>

    
        <div className="grid grid-cols-4 gap-[3px] px-2 py-2">
        

          {betchipdata &&
            betchipdata.length > 0 &&
            betchipdata.map((item, chip) => (
              <button
                key={chip}
                className="flex px-1.5 py-1 justify-center items-center bg-white text-black !border-0 "
                // onClick={() => updateStackOnclic(item)}
                onClick={() => arrayData(item, true)}
              >
                <span className="text-green-500 text-sm font-[700]"> + </span>{" "}
                <span className="text-black text-[12px] font-[500]">
                  {" "}
                  {formatNumber(item)}
                </span>
              </button>
            ))}

        </div>

        <div className="grid grid-cols-4 gap-[3px] px-2">
          <div
            className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#bd1828]  border-[1px] border-[#bd1828]  text-white text-center uppercase ld-over cursor-pointer `}
            onClick={() => {
              arrayData(isMatchCoin?.min);
            }}
          >
            Min Stake
            <div className="ld ld-ball ld-flip"></div>
          </div>
          <div
            className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#6D081D]  border-[1px] border-[#bd1828]  text-white text-center uppercase ld-over cursor-pointer `}
            onClick={() => {
              arrayData(isMatchCoin?.max);
            }}
          >
            Max Stake
            <div className="ld ld-ball ld-flip"></div>
          </div>

          <div
            className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#008000] text-white text-center uppercase ld-over cursor-pointer `}
            onClick={() => {
              handleButtonValues();
              setEditStake(true);
            }}
          >
            Edit Stake
            <div className="ld ld-ball ld-flip"></div>
          </div>

          <div
            className={` px-4 py-1 text-[13px] font-[400]  whitespace-nowrap btn bg-[#0b7d36] hover:bg-[#0b7d36]/90 border-[1px] border-[#0b7d36] hover:border-[#0b7d36]/90 text-white text-center uppercase ld-over cursor-pointer ${betLoading ? "opacity-50 border-2 border-green-900" : ""}`}
            onClick={() => {
              handleClear();
            }}
          >
            <b className="flex justify-center items-center">Clear</b>
            <div className="ld ld-ball ld-flip"></div>
          </div>
        </div>

        <div className="text-red-600 text-xs font-semibold  pl-2">
          min Bet :{isMatchCoin?.min} max Bet :{isMatchCoin?.max}
        </div>

        <div className="grid grid-cols-2 gap-1 p-1">
          <div>
            <div
              className={` px-4 py-1.5 text-[13px] font-[500] btn bg-[#F96F72] text-center uppercase text-white ld-over cursor-pointer `}
              onClick={() => handleClose()}
            >
              Cancel
              <div className="ld ld-ball ld-flip"></div>
            </div>
          </div>
          <div>
            <div
              className={` px-4 py-1.5 text-[13px] font-[500] btn bg-[#249C59] text-center uppercase text-white ld-over cursor-pointer `}
              onClick={() => {
                placeBet();
              }}
            >
              Placer Bet
              <div className="ld ld-ball ld-flip"></div>
            </div>
          </div>
        </div>
        {editStake && (
          <div
            onClick={(e) => {
              setEditStake(false);
              e.stopPropagation();
            }}
            className="fixed px-2 inset-0 z-50 top-0 left-0 h-full w-full flex justify-center items-start bg-black/50 "
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-[450px]  mt-6 bg-white "
            >
              <div className="bg-black flex justify-between items-center text-white p-2 w-full">
                Stacke{" "}
                <span
                  onClick={(e) => {
                    setEditStake(false);
                    e.stopPropagation();
                  }}
                >
                  X
                </span>
              </div>

              <div className="p-2">
                <StakeSettings />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
