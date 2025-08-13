import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAccountStatement } from "../../redux/reducers/user_reducer";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendar } from "react-icons/fa6";

const ProfitLoss = () => {
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
            <h2 className='text-[14px] text-white'>Profit Loss Total P/L : IR 0</h2>
          </div>
          <div className="mt-1.5 border-1 border-gray-400 space-y-2">
            {/* desktop view */}
            <div className="bg-[#DFDDE0] p-1 justify-start hidden sm:flex items-center">
              <div className="flex justify-between sm:space-x-8 ">
                <div className="">
                  <DatePicker
                    selected={payloadData?.fromDate}
                    onChange={(date) => setPayloadData({ ...payloadData, fromDate: date })}
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 w-[142px] rounded-md focus:outline-none text-black"
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
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 w-[142px] rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                <select
                  className="px-3 py-[2px] text-md bg-transparent border bg-white border-gray-400 w-[142px] rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="h-[30px] text-[12px] uppercase bg-black md:border-[var(--primary)] hover:bg-[var(--secondary)] text-white text-md w-[142px] rounded-md">
                  Get Statement
                </button>
              </div>
            </div>
            {/* mobile view */}
            <div className="flex flex-col sm:hidden justify-center items-center space-y-2 lg:space-y-0 space-x-0 lg:space-x-6">
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
                          <th className="px-3 py-2 w-[5%] border whitespace-nowrap border-[#c7c8ca]/50">Sr no</th>
                          <th className="px-3 py-2 w-[15%] border border-[#c7c8ca]/50">Date</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca]/50">Credit</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca]/50">Debit</th>
                          <th className="px-3 py-2 w-[10%] border border-[#c7c8ca]/50">Balance</th>
                          <th className="px-3 py-2 w-[50%] border border-[#c7c8ca]/50">Description</th>
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
                                {element?.amount > 0
                                  ? Number.parseFloat(element?.amount).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(0).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-red-600">
                                {element?.amount < 0
                                  ? "-" + Number.parseFloat(Math.abs(element?.amount)).toFixed(2)
                                  : element?.amount === 0
                                    ? Number.parseFloat(Math.abs(0)).toFixed(2)
                                    : "-"}
                              </td>

                              <td className="px-3 py-2 border border-[#c7c8ca]/50 text-green-600">
                                {Number.parseFloat(element?.balance).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.remark}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className=" text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-left">
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

export default ProfitLoss;


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import { FaCircleInfo } from "react-icons/fa6";
// import { getuserLedger } from "../../redux/reducers/user_reducer";
// import { domainName } from "../../config/Auth";


// function ProfitLoss() {
//   const [payloadData, setPayloadData] = useState({
//     fromDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
//     toDate: moment().format("YYYY-MM-DD"),
//     statementFor: "",
//   });
//   const dispatch = useDispatch();
//   const { userLedgerData } = useSelector((state) => state.user);
//   const ledgerData = userLedgerData?.ledgerData
//   const [pageNumber, setPageNumber] = useState(1)
//   const pageSize = 5
//   const downlineUserId = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.userId
//   const [modalData, setModalData] = useState({
//     status: false,
//     id: ""
//   })
//   useEffect(() => {
//     // const reqData = {
//     //     "pageNo": pageNumber,
//     //     "size": pageSize
//     // }
//     // dispatch(getuserLedger(reqData)); 
//     handleSubmit()
//   }, [dispatch, pageNumber]);


//   const groupedData = {};
//   ledgerData?.forEach((item) => {
//     const dateKey = moment(item.date).format("YYYY-MM-DD");
//     groupedData[dateKey] = groupedData[dateKey] || [];
//     groupedData[dateKey].push(item);
//   });

//   let totalAmount = 0;
//   ledgerData?.map((data) => {
//     totalAmount += data.amount;
//   });
//   let balance = 0;
//   let showAmount = 0;
//   let finalData = ledgerData?.map((data) => {
//     balance = totalAmount - showAmount;
//     showAmount += data.amount;
//     return {
//       amount: data.amount,
//       date: data.date,
//       balance: balance,
//       ledgerType: data.ledgerType,
//       remark: data.remark,
//       eventName: data.eventName,
//       statementFor: data.statementFor,
//       isComm: data.isComm,
//       marketId: data.marketId,
//       createdAt: data.createdAt,
//       selectionId: data.selectionId || "0",
//     };
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayloadData({
//       ...payloadData,
//       [name]: value,
//     });
//   };

//   // Handle change for the select dropdown
//   //   const handleSelectChange = (e) => {
//   //     setPayloadData({
//   //             "downlineUserId": downlineUserId
//   //     });
//   //     const reqData = {
//   //       fromDate: payloadData.fromDate,
//   //       toDate: payloadData.toDate,
//   //       "pageNo": pageNumber,
//   //       "size": pageSize,
//   //       statementFor: e.target.value,
//   //     };
//   //     dispatch(getuserLedger(reqData));
//   //   };


//   const handleSubmit = () => {
//     const reqData = {
//       "downlineUserId": downlineUserId
//     };
//     dispatch(getuserLedger(reqData));
//   };

//   const openModal = (id) => {
//     setModalData({ status: true, id });
//   };

//   const closeModal = () => {
//     setModalData({ status: false, id: '' });
//   };

//   return (
//     <>
//       {modalData.status && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mx-2">
//           <div className="bg-primary  max-w-[550px] md:min-w-[500px] min-w-[100%] rounded-2xl shadow-lg">
//             <div className="flex items-center justify-between mb-4 border-b border-secondary px-6 py-4">
//               <img src="/assets/logo.png" alt="Reddy Plus" className="h-10" />
//               <button
//                 onClick={closeModal}
//                 className="text-white bg-gray-700/70 w-9 h-9 rounded-full flex justify-center items-center  hover:text-white text-4xl"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="m-2 p-2 bg-gradient-to-b from-[#84c2f1] space-y-2 font-semibold capitalize to-blue-50 rounded-lg">
//               <div className="flex text-xs text-black justify-between items-center py-1 border-b border-black"><span>remark</span> <span>{modalData?.id?.remark}</span></div>
//               <div className="flex text-xs text-black justify-between items-center py-1 border-b border-black"><span>date</span> <span>{moment(modalData?.id?.date).format("DD-MM-YYYY HH:MM")}</span></div>
//               <div className="flex text-xs text-black justify-between items-center py-1 border-b border-black"><span>eventName</span> <span>{modalData?.id?.eventName}</span></div>
//               <div className="flex text-xs text-black justify-between items-center py-1 border-b border-black"><span>ledgerType</span> <span>{modalData?.id?.ledgerType}</span></div>
//               <div className="flex text-xs text-black justify-between items-center py-1 border-b border-black"><span>marketId</span> <span>{modalData?.id?.marketId}</span></div>
//             </div>
//           </div>
//         </div>
//       )}
//       <section className="w-full bg-black mb-28">
//         <div className="relative mx-auto text-center w-full max-w-full shadow-xl sm:rounded-md py-4">
//           <div className="px-2 space-y-1 h-auto afterFooter">
//             <div className="w-full overflow-x-auto">
//               <div className="flex md:flex-row flex-col justify-center text-center relative lg:gap-3 gap-1 py-2">

//                 <div className="flex w-full lg:w-52 items-start border-2 border-secondary  rounded-sm mb-6 transition-colors relative">
//                   <div className="absolute mx-2 -top-[10px] space-x-2 text-[#7b7b7b] max-w-[85%] flex justify-satrt items-center bg-main px-2">
//                     <h2 className="text-xs font-semibold">From</h2>
//                   </div>
//                   <input
//                     type="date"
//                     name="fromDate"
//                     id="fromDate"
//                     value={payloadData.fromDate}
//                     onChange={handleChange}
//                     className="block w-full  mt-1 border-white rounded-sm bg-black text-white py-3 px-3 shadow-sm focus:outline-none "
//                   />
//                 </div>
//                 <div className="flex w-full lg:w-52 items-start border-2 border-secondary  rounded-sm mb-6 transition-colors relative">
//                   <div className="absolute mx-2 -top-[10px] space-x-2 text-[#7b7b7b] max-w-[85%] flex justify-satrt items-center bg-main px-2">
//                     <h2 className="text-xs font-semibold">To</h2>
//                   </div>
//                   <input
//                     type="date"
//                     name="toDate"
//                     id="toDate"
//                     value={payloadData.toDate}
//                     onChange={handleChange}
//                     className="block w-full  mt-1 border-white rounded-sm bg-black text-white py-3 px-3 shadow-sm focus:outline-none "
//                   />
//                 </div>


//                 <div>
//                   <button
//                     type="submit"
//                     className="bg-button mt-1 text-white text-sm font-bold px-4 py-4 lg:w-52 w-full   rounded-sm"
//                     onClick={handleSubmit}
//                   >
//                     Load Report
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="py-4 space-y-1">
//               {finalData?.length > 0 ? (
//                 <>


//                   <div className="overflow-x-auto w-full">
//                     <table className="w-full text-sm text-left text-white bg-main border border-secondary capitalize">
//                       <thead className="text-xs uppercase bg-[#404040]">
//                         <tr>
//                           <th scope="col" className="px-6 py-3">
//                             Date
//                           </th>
//                           <th scope="col" className="px-6 py-3">
//                             DESC
//                           </th>
//                           <th scope="col" className="px-6 py-3">
//                             Amount
//                           </th>
//                           <th scope="col" className="px-6 py-3">
//                             Balance
//                           </th>
//                           <th scope="col" className="px-6 py-3">Action </th>

//                         </tr>
//                       </thead>
//                       {finalData?.map((item, index) => (
//                         <tbody key={index}>
//                           <tr className="bg-main border-b-[1px] border-secondary">
//                             <th
//                               scope="row"
//                               className="px-6 py-4 font-medium whitespace-nowrap"
//                             >
//                               {moment(item.date).format("DD/MM/YYYY hh:mm:ss A")}
//                             </th>
//                             <td className="px-6 py-4">{item.remark}</td>
//                             <td
//                               className={`px-6 py-4 ${item.amount > 0
//                                 ? "text-green-600"
//                                 : item.amount < 0
//                                   ? "text-red-600"
//                                   : "text-white"
//                                 }`}
//                             >
//                               {parseFloat(item.amount)
//                                 .toFixed(2)
//                                 .replace(/\.?0+$/, "")}
//                             </td>
//                             <td className={`px-6 py-4 ${Number(item.balance) > 0
//                               ? "text-green-600"
//                               : Number(item.balance) < 0
//                                 ? "text-red-600"
//                                 : "text-white"
//                               }`}>
//                               {parseFloat(item.balance)
//                                 .toFixed(2)
//                                 .replace(/\.?0+$/, "")}
//                             </td>
//                             <td className="px-6 py-4 text-center space-x-2 ">
//                               <FaCircleInfo onClick={() => openModal(item)} size={20} />
//                             </td>

//                           </tr>
//                         </tbody>
//                       ))}
//                     </table>

//                   </div>
//                   <CustomPagination totalCount={userLedgerData?.totalCount} pageSize={pageSize} currentPage={pageNumber} onChange={setPageNumber} />
//                 </>
//               ) :
//                 <div className="text-center border-2 border-button  px-2 py-3 text-md text-button uppercase"> No data found</div>}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default ProfitLoss;