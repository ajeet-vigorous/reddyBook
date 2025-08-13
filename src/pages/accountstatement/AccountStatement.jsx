import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAccountStatement } from "../../redux/reducers/user_reducer";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendar } from "react-icons/fa6";

const AccountSatement = () => {
  const [payloadData, setPayloadData] = useState({
    fromDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    statementFor: "",
  });
  const [paginationPage, setPaginationPage] = useState(1)
  const dispatch = useDispatch();
  const { accountStatement } = useSelector((state) => state.user);
  const statementData = accountStatement?.statementData;

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sportType, setSportType] = useState("");
  const [filteredData, setFilteredData] = useState();

  const totalPages = accountStatement?.totalCount && pageSize
    ? Math.ceil(accountStatement?.totalCount / pageSize)
    : 1


  useEffect(() => {
    handleSubmit();
  }, [dispatch, pageNumber, pageSize]);

  useEffect(() => {
    let dataFilter;
    if (sportType === "") {
      dataFilter = statementData;
    } else if (sportType === "cricket") {
      dataFilter = statementData?.filter(
        (ele) =>
          ele.statementFor !== "internationalCasino" &&
          ele.statementFor !== "diamondCasino"
      );
    } else {
      dataFilter = statementData?.filter(
        (ele) => ele.statementFor === sportType
      );
    }
    setFilteredData(dataFilter);
  }, [sportType, statementData]);

  const groupedData = {};
  filteredData?.forEach((item) => {
    const dateKey = moment(item.date).format("YYYY-MM-DD");
    groupedData[dateKey] = groupedData[dateKey] || [];
    groupedData[dateKey].push(item);
  });

  let totalAmount = 0;
  filteredData?.map((data) => {
    totalAmount += data.amount;
  });
  let balance = 0;
  let showAmount = 0;
  let finalData = filteredData?.map((data) => {
    balance = totalAmount - showAmount;
    showAmount += data.amount;
    return {
      amount: data.amount,
      date: data.date,
      balance: balance,
      gameType: data.gameType,
      remark: data.remark,
      userRemark: data.userRemark,
      statementFor: data.statementFor,
      isComm: data.isComm,
      marketId: data.marketId,
      createdAt: data.createdAt,
      selectionId: data.selectionId || "0",
      _id: data?._id
    };
  });

  const handleSelectChange = (e) => {
    setPayloadData({
      ...payloadData,
      statementFor: e.target.value,
    });
  };

  const handleSubmit = () => {
    const reqData = {
      fromDate: payloadData.fromDate,
      toDate: payloadData.toDate,
      pageNo: pageNumber,
      size: +pageSize,
    };
    if (payloadData?.statementFor) {
      reqData.statementFor = payloadData?.statementFor
    }
    dispatch(getAccountStatement(reqData));
  };

  const calendarIcon = (
    <FaRegCalendar className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
  );


  return (
    <>
      <div className="w-full min-h-screen flex">
        <div className="border w-full">
          <div className='bg-[var(--darkcolor)] uppercase text-black py-1 px-1.5'>
            <h2 className='text-[14px] text-white'>Account Statement</h2>
          </div>
          <div className="mt-1.5 border-1 border-gray-400 space-y-2">
            {/* desktop view */}
            <div className="bg-[#DFDDE0] p-1 justify-start hidden md:flex items-center">
              <div className="flex justify-between sm:space-x-8 ">
                <select
                  className="px-3 py-[2px] text-md bg-transparent border bg-white border-gray-400 xl:w-[252px] w-[165px] rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                <div className="">
                  <DatePicker
                    selected={payloadData?.fromDate}
                    onChange={(date) => setPayloadData({ ...payloadData, fromDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 xl:w-[252px] w-[165px] rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                <div className="">
                  <DatePicker
                    selected={payloadData?.toDate}
                    onChange={(date) => setPayloadData({ ...payloadData, toDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 xl:w-[252px] w-[165px] rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="h-[30px] text-[12px] uppercase bg-black md:border-[var(--primary)] hover:bg-[var(--secondary)] text-white text-md xl:w-[252px] w-[165px] rounded-md">
                  Get Statement
                </button>
              </div>
            </div>
            {/* mobile view */}
            <div className="flex flex-col bg-white md:hidden justify-center items-center space-y-2 lg:space-y-0 space-x-0 lg:space-x-6">
              <div className="flex w-full justify-center items-center  gap-2">
                <div className="">
                  <DatePicker
                    selected={payloadData?.fromDate}
                    onChange={(date) => setPayloadData({ ...payloadData, fromDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 w-full rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                <div className="">
                  <DatePicker
                    selected={payloadData?.toDate}
                    onChange={(date) => setPayloadData({ ...payloadData, toDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 w-full rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <select
                  className="px-3 py-[2px] text-md bg-transparent border bg-white w-1/2 border-gray-400 rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="h-[30px] text-[12px] uppercase bg-black md:border-[var(--primary)] hover:bg-[var(--secondary)] text-white text-md w-1/2 rounded-md">
                  Get Statement
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="max-w-full overflow-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden w-full">
                    <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                      <thead className="bg-[#DFDDE0]">
                        <tr className="text-left text-[12px] lg:bg-transparent text-[#212529]  font-semibold border border-[#c7c8ca]/50">
                          <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">No</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">Date</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">Total</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">Balance</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">D/C</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">Description</th>
                          <th className="px-3 py-2 border border-[#c7c8ca]/50">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalData && finalData.length > 0 ? (
                          finalData?.map((element, index) => (
                            <tr
                              className={index % 2 === 0 ? "bg-[#F2F2F2] text-[12px]" : "bg-[#E6E6E6] text-[12px]"}
                              key={index}
                            >
                              <td className="px-3 py-2 border border-[#c7c8ca]/50">{index + 1}</td>
                              <td className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">
                                {moment(element?.createdAt)
                                  .utcOffset("+05:30")
                                  .format("YYYY/MM/DD hh:mm:ss")}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                {Number.parseFloat(element?.balance).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                {Number.parseFloat(element?.balance).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-black flex space-x-2">
                                <p className="text-green-600">
                                  ( {element?.amount > 0
                                    ? Number.parseFloat(element?.amount).toFixed(2)
                                    : element?.amount === 0
                                      ? Number.parseFloat(0).toFixed(2)
                                      : "-"})
                                </p>
                                <p>/</p>
                                <p className="text-red-600">
                                  ({element?.amount < 0
                                    ? "-" + Number.parseFloat(Math.abs(element?.amount)).toFixed(2)
                                    : element?.amount === 0
                                      ? Number.parseFloat(Math.abs(0)).toFixed(2)
                                      : "-"})
                                </p>
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.remark}</td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.remark}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className=" text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-left">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:flex lg:flex-row flex-col  justify-start items-center my-1 gap-4">
              <div className="flex justify-start items-center ">
                {/* <button
                  onClick={() => {
                    setPageNumber(1);
                    setPaginationPage(1)
                  }}
                  className="px-3 py-1 border text-black text-sm"

                >
                  First
                </button> */}
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="px-3 py-1 border text-black text-sm"
                  disabled={pageNumber === 1}
                >
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 border text-black text-sm"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next Page
                </button>
                {/* <button
                  className="px-3 py-1 border text-black text-sm"
                  onClick={() => { setPageNumber(totalPages); setPaginationPage(totalPages) }}
                >
                  Last
                </button> */}

              </div>
              {/* <div className='space-x-2 flex justify-center items-center gap-2 lg:mt-0 mt-2'>
                <span>Page {pageNumber} of {totalPages}  </span>
                <span>Go to Page</span>
                <input
                  onChange={(e) => { setPaginationPage(e.target.value) }}
                  value={paginationPage}
                  className='border p-2 w-32'></input>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSatement
