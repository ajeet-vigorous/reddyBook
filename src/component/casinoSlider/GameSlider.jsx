import { message } from "antd";
import React from "react";

const GameSlider = ({ data, userInfo }) => {
  const handleImageClick = (img) => {
    let productParam = img?.product === "all" ? img?.product : img?.category;
    let catParam = img?.product === "all" ? img?.category : "all";
                        if(userInfo.data.isDemoClient){
 message.error("Demo User not allowed to play Casino. Play only with Real ID.");
    }else{
             window.location.href = `/casino/99998?name=${productParam}&gameName=${catParam}`;
    }
  
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-rows-2 grid-flow-col gap-0.5 w-max">
        {data
          ?.sort((a, b) => a.position - b.position)
          ?.map((img, index) => (
            <div
              key={index}
              className="w-[140px] overflow-hidden"
            >
              <img
                src={img?.url_thumb}
                alt={`slide-${index}`}
                onClick={() => handleImageClick(img)}
                className="w-full h-[90px]  cursor-pointer"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default GameSlider;
