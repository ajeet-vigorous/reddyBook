import moment from "moment"
import { useEffect, useState } from "react"

const DepositWithdrawCom = ({data}) => {
const [depositWithdrawList, setDepositWithdrawList] = useState([])
    useEffect(() => {
setDepositWithdrawList(data)
    },[data])

 
    return(
        <div className="w-full overflow-x-auto bg-white">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr className="bg-[#0b6b63] text-white text-xs">
                            <th className="p-[7px] text-left text-nowrap font-[500] border-r border-[#0b6b63]">
                            TRANSACTION NO
                            </th>
                            <th className="p-[7px] text-left text-nowrap font-[500] border-r border-[#0b6b63]">
                            AMOUNT
                            </th>
                            <th className="p-[7px] text-left text-nowrap font-[500] border-r border-[#0b6b63]">
                            STATUS
                            </th>
                            <th className="p-[7px] text-left text-nowrap font-[500] border-r border-[#0b6b63]">
                            DATE
                            </th>
                            <th className="p-[7px] text-left text-nowrap font-[500]">
                            REASON
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                            {depositWithdrawList?.length > 0 ? depositWithdrawList.map((item, idx) => {
                                return(
                               <tr className="text-sm text-[#212529] border-b" key={idx}>
                                <td className="p-[7px] text-nowrap">
                                {item?.utrNo}
                                </td>
                                <td className="p-[7px] text-nowrap">
                                {(parseInt(item.amount * 100) / 100)}
                                </td>

                                <td className="p-[7px] text-nowrap">
                                <span className={`inline-block px-2 py-1 text-xs font-[400] rounded border ${item.status == "accept"  ? "border-[#28a745] text-[#28a745] hover:bg-[#28a745] hover:text-black" : item.status == "pending" ? "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black" : "border-[#df3805] hover:bg-[#df3805] hover:text-black text-[#df3805]"}  uppercase`}>
                                   {item.status}
                                </span>
                                </td>

                                <td className="p-[7px] text-nowrap">
                                {moment(item?.createdAt).format("DD-MM-YYYY hh:mm:ss A")}
                                </td>

                                <td className="p-[7px] text-nowrap text-center">
                             {item?.canceledRemark || item?.remark || "-"}
                                </td>
                            </tr>
                                )
                            }) : (
<tr><td colSpan={5} className="text-sm text-center">No Record Found</td></tr>
                            )}
                          
                            
                        </tbody>
                    </table>
                </div>
    )
}

export default DepositWithdrawCom