import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getInternationalGroupCasinoList } from "../../redux/_reducers/_user_reducers";
import { json } from "react-router-dom";

export const useGroupCasinoList = () => {
    const [groupCasinoList, setGroupCasinoList] = useState({});

    const dispatch = useDispatch();
    const { getInternationalGroupCasinoListData } = useSelector(state => state.user);

    const cosinoGroupList = JSON.parse(localStorage.getItem('cosinoGroupList'))

    useEffect(() => {
        if (cosinoGroupList) {
            setGroupCasinoList(cosinoGroupList);
        }
    }, [getInternationalGroupCasinoListData]);

    return groupCasinoList;
};

export default useGroupCasinoList;