import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { message } from "antd";

function TrendingGames({ name, data, userInfo }) {
  const navigate = useNavigate();

  const handleResponseCasino = (product) => {
    //                     if(userInfo.data.isDemoClient){
    //  message.error("Demo User not allowed to play Casino. Play only with Real ID.");
    //     }else{
    //     }
    navigate(`/iframe-casino-new/${product?.product}/${product?.id}`);
    // navigate(`/iframe-casino-new/${product?.product}/${product?.id}`)
  };

  return (
    <section>
      <div>
        <div className="text-white text-[16px] font-bold leading-none px-3 h-[29px] flex justify-start items-center uppercase bg-[#C10930]">
          <h2 className="textAnime tracking-tight w-full text-center">
            NEW LAUNCH
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="grid grid-rows-1 grid-flow-col gap-0.5 w-max">
            {data
              ?.sort((a, b) => a.position - b.position)
              .map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleResponseCasino(item)}
                  className="relative cursor-pointer w-full"
                >
                  <div className="w-28 ">
                    <img
                      src={`https://speedcdn.io/${item?.url_thumb}`}
                      alt={item?.name}
                      className="w-full h-32"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrendingGames;
