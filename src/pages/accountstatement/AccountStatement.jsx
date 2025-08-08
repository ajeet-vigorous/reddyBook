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
      <div className="bg-white w-full min-h-screen flex">
        <div className="border w-full">
          <div className='bg-[var(--darkcolor)] uppercase text-black py-1 px-1.5'>
            <h2 className='text-[14px] text-white'>Account Statement</h2>
          </div>
          <div className="p-1 border-1 border-gray-400 space-y-2">
            {/* desktop view */}
            <div className="justify-start hidden lg:flex items-center p-1">
              <div className="flex justify-between lg:space-x-4 ">
                <div className="">
                  <DatePicker
                    selected={payloadData?.fromDate}
                    onChange={(date) => setPayloadData({ ...payloadData, fromDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[6px] text-sm border bg-white border-gray-400 w-[257px] focus:outline-none text-black"
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
                    className="!px-2 !py-[6px] text-sm border bg-white border-gray-400 w-[257px] focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                <select
                  className="px-3 py-1 text-md bg-transparent border bg-white  border-gray-500/30 w-[260px] focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="py-1.5 ml-2 md:bg-[var(--bluebtn)] md:border-[var(--bluebtn)]  bg-[var(--primary)] hover:opacity-85 text-white text-md w-[150px] rounded-sm">
                  Submit
                </button>
              </div>
            </div>
            {/* mobile view */}
            <div className="flex flex-col lg:hidden items-center space-y-2 lg:space-y-0 space-x-0 lg:space-x-6">
              <div className="flex w-full gap-2 justify-around">
                <div className="relative w-48">
                  <DatePicker
                    selected={payloadData?.fromDate}
                    onChange={(date) => setPayloadData({ ...payloadData, fromDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[5px] text-sm border bg-white border-gray-400 w-full focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                <div className="relative w-48">
                  <DatePicker
                    selected={payloadData?.toDate}
                    onChange={(date) => setPayloadData({ ...payloadData, toDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[5px] text-sm border bg-white border-gray-400 w-full focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>

              </div>
              <div className="flex flex-col gap-2 w-full">
                <select
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                  className="px-3 py-1.5 text-[0.8125rem] bg-transparent border w-full text-black border-gray-500/30"
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                <button onClick={handleSubmit} className="py-2 px-3 bg-[var(--primary)] hover:bg-[#6C2D2CB3] text-white text-[16px] w-full lg:w-auto">
                  Submit
                </button>
              </div>
            </div>

            {/* <div className="w-full flex justify-between items-center gap-2 p-1">
              <div className="flex items-center input-group relative space-x-1">
                <span className="mr-2 lg:text-[14px] text-[12px]">Show</span>
                <select value={pageSize} onChange={(e) => { setPageSize(e.target.value) }} className="lg:w-[150px] sm:w-1/3 bg-white border py-1.5 px-2">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
                <span className="lg:text-[14px] text-black text-[12px]">Entries</span>
              </div>
              <div className="flex justify-end items-center gap-2 input-group relative ">
                <span className="lg:text-[14px] text-black text-[12px]">Search:</span>
                <input
                  type="search"
                  className="px-3 py-1.5 text-[1rem] bg-transparent border border-gray-500/30 lg:w-full w-[80%] focus:outline-none text-[#495057] placeholder:text-gray-500"
                  placeholder={`${finalData?.length || 0} records...`}
                  value=""
                />

              </div>
            </div> */}

            <div className="overflow-hidden shadow-md">
              <div className="max-w-full overflow-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden w-full">
                    <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                      <thead className="lg:bg-[#F7F7F7] bg-[var(--secondary)]">
                        <tr className="text-left lg:text-md text-[14px] lg:bg-transparent text-white lg:text-black  font-semibold border border-[#c7c8ca]">
                          <th className="px-3 py-2 w-[5%] border whitespace-nowrap border-[#c7c8ca] text-right">Sr no</th>
                          <th className="px-3 py-2 w-[15%] border border-[#c7c8ca] text-left">Date</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca] text-right">Credit</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca] text-right">Debit</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca] text-right">Balance</th>
                          <th className="px-3 py-2 w-[50%] border border-[#c7c8ca] text-left">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalData && finalData.length > 0 ? (
                          finalData.map((element, index) => (
                            <tr
                              className={index % 2 === 0 ? "bg-[#E6E6E6] text-md" : "bg-[#F2F2F2] text-md"}
                              key={index}
                            >
                              <td className="px-3 py-2 border border-[#c7c8ca] text-right">{index + 1}</td>
                              <td className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca] text-left">
                                {moment(element?.createdAt)
                                  .utcOffset("+05:30")
                                  .format("YYYY/MM/DD hh:mm:ss")}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca] text-right text-green-600">
                                {element?.amount > 0
                                  ? Number.parseFloat(element?.amount).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(0).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca] text-right text-red-600">
                                {element?.amount < 0
                                  ? "-" + Number.parseFloat(Math.abs(element?.amount)).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(Math.abs(0)).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca] text-right text-green-600">
                                {Number.parseFloat(element?.balance).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca] text-left whitespace-nowrap">{element?.remark}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-2 border border-[#c7c8ca] text-center">
                              No records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:flex lg:flex-row flex-col  justify-center items-center my-2 gap-4">

              <div className="flex justify-center items-center ">
                <button
                  onClick={() => {
                    setPageNumber(1);
                    setPaginationPage(1)
                  }}
                  className="px-3 py-1 border text-black text-sm"

                >
                  First
                </button>
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="px-3 py-1 border text-black text-sm"
                  disabled={pageNumber === 1}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 border text-black text-sm"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                </button>
                <button
                  className="px-3 py-1 border text-black text-sm"
                  onClick={() => { setPageNumber(totalPages); setPaginationPage(totalPages) }}
                >
                  Last
                </button>

              </div>
              <div className='space-x-2 flex justify-center items-center gap-2 lg:mt-0 mt-2'>
                <span>Page {pageNumber} of {totalPages}  </span>
                <span>Go to Page</span>
                <input
                  onChange={(e) => { setPaginationPage(e.target.value) }}
                  value={paginationPage}
                  className='border p-2 w-32'></input>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSatement
