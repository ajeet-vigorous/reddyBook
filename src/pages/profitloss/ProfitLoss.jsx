import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAccountStatement, getUserLedger } from "../../redux/reducers/user_reducer";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendar } from "react-icons/fa6";

const ProfitLoss = () => {

const { userLegderList } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [IsClienthistory, SetIsClienthistory] = useState(false);
  const [profitLossData, setProfitLossData] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sportType, setSportType] = useState("");
  
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const [selectedValue, setSelectedValue] = useState('5');

  // const handleChangeSelectedValue = (event) => {
  //   setSelectedValue(event.target.value);
  // };

  const fetchUserLedger = () => {
    const user = JSON.parse(localStorage.getItem('clientspuser'));

    const reqData = {
      isCreatorId: user.data.userId,
      fromDate: fromDate,
      toDate: toDate,
      size: selectedValue,
    };

    dispatch(getUserLedger(reqData));
  };

  useEffect(() => {
    fetchUserLedger();
  }, [dispatch, selectedValue]);


   let totalAmount = 0;
  userLegderList?.map((data, key) => {
    totalAmount += data.clientNetAmount
  })
  let balance = 0;
  let showAmount = 0;
  let finalData = userLegderList?.map((data, key) => {
    balance = totalAmount - showAmount;
    showAmount += data.userNetProfitLoss;
    const pushObj = {
      amount: data.sessionAmt + data.oddsAmt + data.userOddsComm + data.userSessionComm,
      Amt: data?.clientNetAmount,
      commisition: data.userOddsComm + data.userSessionComm,
      userOddsComm: data.userOddsComm,
      userSessionComm: data.userSessionComm,
      clientNetAmount: data.clientNetAmount,
      date: data.date,
      balance: balance,
      ledgerType: data.ledgerType,
      eventName: data.eventName,
      userRemark: data.userRemark,
      statementFor: data.statementFor,
      isComm: data.isComm,
      marketId: data.marketId,
      createdAt: data.createdAt,
      isCasino: data.isCasino,
      result: data.result ? data.result : '-' ,
      
    };
    return pushObj;
  });

  const handleSearch = () => {
    fetchUserLedger();
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
                 <input
                    type="date"
                    placeholder="From Date"
                    className="block w-full outline-1 outline-[#04699b] text-xs px-3 py-2"
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                  <DatePicker
      selected={fromDate}
      onChange={handleFromDateChange}
      dateFormat="dd/MM/yyyy"
      className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 xl:w-[252px] w-[165px] rounded-md focus:outline-none text-black"
      required
      showIcon
      icon={calendarIcon}
      placeholderText="From Date"
    />
                </div>
                <div className="">
                  <DatePicker
                   value={toDate}
                  onChange={handleToDateChange} 
                    dateFormat="dd/MM/yyyy"
                    className="!px-2 !py-[4px] text-sm border bg-white border-gray-400 w-[142px] rounded-md focus:outline-none text-black"
                    required
                    showIcon
                    icon={calendarIcon}
                  />
                </div>
                {/* <select
                  className="px-3 py-[2px] text-md bg-transparent border bg-white border-gray-400 w-[142px] rounded-md focus:outline-none text-[#495057] placeholder-text-gray-500"
                  onChange={handleSelectChange}
                  value={setPayloadData?.statementFor}
                >
                  <option value="">All</option>
                  <option value="profitLoss">Sports Reports</option>
                  <option value="ACCOUNT_STATEMENT">Deposit/Withdraw Reports</option>
                </select> */}
                <button
                  onClick={handleSearch}
                  className="h-[30px] text-[12px] uppercase bg-black md:border-[var(--primary)] hover:bg-[var(--secondary)] text-white text-md w-[142px] rounded-md">
                  Submit
                </button>
              </div>
            </div>
            {/* mobile view */}
            {/* <div className="flex flex-col sm:hidden justify-center items-center space-y-2 lg:space-y-0 space-x-0 lg:space-x-6">
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
            </div> */}

            <div className="overflow-hidden">
              <div className="max-w-full overflow-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden w-full">
                    <table className="min-w-full border-collapse border overflow-x-auto border-gray-400">
                      <thead className="bg-[#DFDDE0]">
                        <tr className="text-left text-[12px] lg:bg-transparent text-[#212529]  font-semibold border border-[#c7c8ca]/50">
                          <th className="px-3 py-2 border whitespace-nowrap border-[#c7c8ca]/50">No</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Date</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Credit</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Debit</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Balance</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">P&L</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Result</th>
                          <th className="px-3 py-2  border border-[#c7c8ca]/50">Description</th>
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
                              <td className={`px-3 py-2 border border-[#c7c8ca]/50 ${element?.Amt >= 0 ? "text-green-700" : 'text-red-600'}`}>
                                 {Math.abs(Math.floor(parseFloat(element?.Amt * 100) / 100) / 100).toFixed(2)}
                               </td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.result}</td>
                              <td className="px-3 py-2 border border-[#c7c8ca]/50 whitespace-nowrap">{element?.eventName}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={10} className=" text-[13px] p-2 border border-[#c7c8ca]/50 bg-white text-left">
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


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import moment from 'moment';
// // import './ProfitAndLoss.css'
// import { CiMenuBurger } from "react-icons/ci";
// // import { DownloadFileExcel, DownloadFilePdf, DownloadFileCsv } from '../../Components/DownloadFile/DownloadFile';
// import { FaRegCalendarDays } from 'react-icons/fa6';
// import { getuserLedger } from '../../redux/reducers/user_reducer';
// // import ClientProfit from '../../Components/clientprofit/ClientProfit';

// const ProfitLoss = () => {
//   const { userLegderList } = useSelector(state => state.user);
//   const dispatch = useDispatch();
//   const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
//   const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
//   const [IsClienthistory, SetIsClienthistory] = useState(false);
//   const [profitLossData, setProfitLossData] = useState('');

//   const handleApplyModal = (data) => {
//     SetIsClienthistory(!IsClienthistory);
//     setProfitLossData(data)

//   };
//   const handleFromDateChange = (event) => {
//     setFromDate(event.target.value);
//   };

//   const handleToDateChange = (event) => {
//     setToDate(event.target.value);
//   };

//   const [selectedValue, setSelectedValue] = useState('5');
//   const handleChangeSelectedValue = (event) => {
//     setSelectedValue(event.target.value);
//   };

//   const fetchUserLedger = () => {
//     const user = JSON.parse(localStorage.getItem('clientspuser'));

//     const reqData = {
//       isCreatorId: user.data.userId,
//       fromDate: fromDate,
//       toDate: toDate,
//       size: selectedValue,
//     };

//     dispatch(getuserLedger(reqData));
//   };

//   useEffect(() => {
//     fetchUserLedger();
//   }, [dispatch, selectedValue]);

//   const handleSearch = () => {
//     fetchUserLedger();
//   };



//   let totalAmount = 0;
//   userLegderList?.map((data, key) => {
//     totalAmount += data.clientNetAmount
//   })
//   let balance = 0;
//   let showAmount = 0;
//   let finalData = userLegderList?.map((data, key) => {
//     balance = totalAmount - showAmount;
//     showAmount += data.userNetProfitLoss;
//     const pushObj = {
//       amount: data.sessionAmt + data.oddsAmt + data.userOddsComm + data.userSessionComm,
//       Amt: data?.clientNetAmount,
//       commisition: data.userOddsComm + data.userSessionComm,
//       userOddsComm: data.userOddsComm,
//       userSessionComm: data.userSessionComm,
//       clientNetAmount: data.clientNetAmount,
//       date: data.date,
//       balance: balance,
//       ledgerType: data.ledgerType,
//       eventName: data.eventName,
//       userRemark: data.userRemark,
//       statementFor: data.statementFor,
//       isComm: data.isComm,
//       marketId: data.marketId,
//       createdAt: data.createdAt,
//       isCasino: data.isCasino,
//       result: data.result ? data.result : '-' ,
      
//     };
//     return pushObj;
//   });

//   const headers = [
//     { header: 'Market Name', dataKey: 'eventName' },
//     { header: 'Result', dataKey: 'Result' },
//     { header: 'P&L', dataKey: 'balance' },
//     { header: 'Start Date', dataKey: 'createdAt' },
//   ];
  

//   return (
//     <div className="main-body  overflow-y-auto h-screen spacing-class">
//       <div className=''>
//         <div className='mx-3'>
//           <div className='accountFilterViewprofit'>
//             <div className="row mb-3">
//               <div className=" col-md-3 col-12 px-3">
//                 <label className='mb-2'>Total P&L:</label>
//                 <input
//                   type='text'
//                   readOnly
//                   value={Math.abs(parseFloat(totalAmount / 100).toFixed(2).replace(/\.?0+$/, ''))}
                  
//                   placeholder='0.00'
//                   className='block w-full outline-1 outline-[#04699b] text-xs px-2 py-2'
//                   style={{ color: totalAmount > 0 ? 'green' : totalAmount < 0 ? 'red' : 'black' }}
//                 />
//               </div>

//               <div className=" col-md-3 col-12 px-3">
//                 <label className='mb-1'>From:</label>
//                 <div className="relative w-full">
//                   <input
//                     type="date"
//                     placeholder="From Date"
//                     className="block w-full outline-1 outline-[#04699b] text-xs px-3 py-2"
//                     value={fromDate}
//                     onChange={handleFromDateChange}
//                   />
//                   <FaRegCalendarDays
//                     className="absolute right-[14px]  top-1/2 transform -translate-y-1/2 text-[#333C4B] pointer-events-none"
//                     size={16}
//                   />
//                 </div>

//               </div>

//               <div className=" col-md-3 col-12 px-3">
//                 <label className='mb-1'>To:</label>
//                 <div className='relative w-full'>
//                 <input placeholder="From Date" type="date" className='block w-full outline-1 outline-[#04699b] text-xs px-3 py-2' value={toDate}
//                   onChange={handleToDateChange} />
//                 <FaRegCalendarDays
//                     className="absolute right-[14px]  top-1/2 transform -translate-y-1/2 text-[#333C4B] pointer-events-none"
//                     size={16}
//                   />
//                   </div>
//               </div>

//               <div className=" col-md-3 col-12 px-3 search-profitloss">
//                 <label className='p-0 invisible mb-2'>btn</label>
//                 <button className='block bg-[var(--blue-button)] w-full text-white p-2 text-xs' onClick={handleSearch}>Search</button>
//               </div>
//             </div>
//           </div>
//           <div className='row'>
//             <div className='col-lg-6 col-md-4 col-4 '>
//               <div className='profit-lossselectnumber'>
//                 <label>Show:</label>
//                 <select className='w-full' value={selectedValue} onChange={handleChangeSelectedValue} >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="30">30</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//               </div>
//             </div>

//             <div className='col-lg-6 col-md-8 col-8'>
//               <div className='statment-download profitstatment-download'>
//                 <label className='invisible'>hidden</label>
//                 {/* <div className='d-flex download-button download-button2 justify-end'>
//                   <DownloadFilePdf headers={headers} data={finalData} fileName={`clientlist`} />
//                   <DownloadFileCsv data={headers} columns={finalData} fileName="clientlist" />
//                   <DownloadFileExcel headers={headers} data={finalData} fileName={`clientlist`} />
//                 </div> */}
//               </div>
//             </div>
//             <div></div>
//           </div>
//         </div>
//         <div>
//           <div className="profitloss-table2">
//             <table className="profitloss-table">
//               <thead className=''>
//                 <tr>
//                   <th scope="col" className=''>
//                     <div className='d-flex flex-wrap justify-between align-items-center'>
//                       <div className='d-flex flex-wrap justify-between align-items-center gap-2'>
//                         <p>App Sport</p>
//                       </div>
//                       <div className='menu-icon'><CiMenuBurger /></div>
//                     </div>
//                     <div className='statmenttable-filterwork'>
//                       <div className='w-44 border border-[#d2d6de] px-1'>
//                         <select className='tableselect-data w-full text-xs bg-white outline-1 border border-black'>
//                           <option value="equals">Equals</option>
//                           <option value="notEqual">Not equal</option>
//                           <option value="startsWith">Starts with</option>
//                           <option value="endsWith">Ends with</option>
//                           <option value="contains">Contains</option>
//                           <option value="notContains">Not contains</option>
//                         </select>
//                         <input className="statmenttable-filterinput block text-xs px-1 border border-black outline-none my-1 text-black placeholder:text-black w-full" id="filterText" type="text" placeholder="Filter..." />
//                         <div className='d-flex gap-3'>
//                           <div className='d-flex gap-2 items-center'>
//                             <input type="radio" className='statmenttable-filterradio' name="fav_language" value="HTML"></input>
//                             <label className='text-xs font-bold text-black'>AND</label>
//                           </div>
//                           <div className='d-flex gap-2'>
//                             <input type="radio" className='statmenttable-filterradio' name="fav_language" value="HTML"></input>
//                             <label className='text-xs font-bold text-black'>OR</label>
//                           </div>

//                         </div>
//                         <div className='block mt-1'>
//                           <select className='tableselect-data w-full text-xs bg-white outline-1 border border-black block'>
//                             <option value="equals">Equals</option>
//                             <option value="notEqual">Not equal</option>
//                             <option value="startsWith">Starts with</option>
//                             <option value="endsWith">Ends with</option>
//                             <option value="contains">Contains</option>
//                             <option value="notContains">Not contains</option>
//                           </select>
//                           <input class="statmenttable-filterinput block text-xs px-1 border border-black outline-none my-1 text-black placeholder:text-black w-full" id="filterText" type="text" placeholder="Filter..." />
//                         </div>
//                       </div>
//                     </div>
//                   </th>
//                   <th scope="col">
//                     <div className='d-flex flex-wrap justify-between align-items-center'>
//                       <div className='d-flex flex-wrap justify-between align-items-center gap-2'>
//                         <p>Market Name</p>
//                       </div>
//                       <div className='menu-icon'><CiMenuBurger /></div>
//                     </div>
//                   </th>
//                   <th scope="col" className=''>
//                     <div className='d-flex flex-wrap justify-between align-items-center'>
//                       <div className='d-flex flex-wrap justify-between align-items-center gap-2'>
//                         <p>Result</p>
//                       </div>
//                       <div className='menu-icon'><CiMenuBurger /></div>
//                     </div>
//                   </th>
//                   {/* <th scope="col">COM OUT</th> */}
//                   <th scope="col" className=''>
//                     <div className='d-flex flex-wrap justify-between align-items-center'>
//                       <div className='d-flex flex-wrap justify-between align-items-center gap-2'>
//                         <p>P&L</p>
//                       </div>
//                       <div className='menu-icon'><CiMenuBurger /></div>
//                     </div>
//                   </th>
//                   <th scope="col">
//                     <div className='d-flex flex-wrap justify-between align-items-center'>
//                       <div className='d-flex flex-wrap justify-between align-items-center gap-2'>
//                         <p>Started Date</p>
//                       </div>
//                       <div className='menu-icon'><CiMenuBurger /></div>
//                     </div>
//                   </th>
//                 </tr>
//               </thead>             
//               {finalData && finalData.length > 0 && (
//                 <>
//                   {finalData?.map((item, index) => (
//                     <tbody className='profittableBody text-left' key={index}>
//                       <tr>
                       
//                         <td className='anySecHide'><b>-</b></td>
//                         <td style={{ color: "#039be5" }} onClick={() => handleApplyModal(item?.marketId)}>
//                           {item.eventName}
//                         </td>
//                         <td className='anySecHide'>{item.result}</td>
//                         <td className={`anySecHide ${item.Amt >= 0 ? "text-green-700" : 'text-red-600' }`}>{Math.abs(Math.floor(parseFloat(item.Amt * 100) / 100) / 100).toFixed(2)} </td>
//                         <td>{moment(item.createdAt).format('DD/MM/YYYY, hh:mm A')}</td>

//                       </tr>
//                     </tbody>
//                   ))}
//                 </>
//               )}
//             </table>
//           </div>
//         </div>

//       </div>
//       {/* {IsClienthistory && (
//         <ClientProfit Clienthistory={IsClienthistory} handleClose={handleApplyModal} profitLossData={profitLossData} />
//       )} */}


//     </div>
//   );
// };

// export default ProfitLoss;


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