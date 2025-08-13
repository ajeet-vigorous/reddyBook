import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getInternationalGroupCasinoList } from "../../redux/_reducers/_user_reducers";
import { json } from "react-router-dom";

export const useGroupCasinoList = () => {
    const [groupCasinoList, setGroupCasinoList] = useState({});

    const dispatch = useDispatch();
    const { getInternationalGroupCasinoListData } = useSelector(state => state.user);

    const casinoGroupData = JSON.parse(localStorage.getItem('casinoGroupData'))

    useEffect(() => {
        if (casinoGroupData) {
            setGroupCasinoList(casinoGroupData);
        }
    }, [getInternationalGroupCasinoListData]);

    return groupCasinoList;
};

export default useGroupCasinoList;