import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import InplayMatches from '../../component/dashboard/InplayMatches';

const InPlayMatch = () => {
  const { gameId } = useParams();
  console.log(gameId, 'fdfdfd')
  const { sportMatchList } = useSelector((state) => state.sport);
  const [matchData, setMatchData] = useState([]);

  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;

  useEffect(() => {
    let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
    setMatchData(matchListData);
  }, [sportMatchList]);

  return (
    <div>
      <InplayMatches activeTab={gameId} matchlistItems={matchData} />
    </div>
  )
}

export default InPlayMatch;