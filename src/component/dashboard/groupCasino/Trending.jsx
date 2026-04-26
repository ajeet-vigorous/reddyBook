import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { message } from "antd";
import Login from "../../login/Login";

function TrendingGames({ name, data, userInfo }) {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [multiplyModal, setMultiplyModal] = useState({ open: false, gameId: null, product: null });

  const handleResponseCasino = (product) => {
    if (!localStorage.getItem("token")) {
      setIsLoginOpen(true);
      localStorage.setItem("unauthorized", true);
      return;
    }
    const multiply = userInfo?.data?.intCasinoMultiply;
    if (multiply > 1) {
      setMultiplyModal({ open: true, gameId: product?.id, product: product?.product, value: multiply });
    } else {
      navigate(`/iframe-casino-new/${product?.product}/${product?.id}`);
    }
  };

  return (
    <section>
      <Login
        isOpen={isLoginOpen}
        closeModal={() => setIsLoginOpen(false)}
        setIsLoginOpen={setIsLoginOpen}
      />
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
                  className="relative cuor-pointer w-full"
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

      {multiplyModal.open && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
          onClick={() => setMultiplyModal({ open: false, gameId: null, product: null })}
        >
          <div className="rounded-md w-[340px] text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0b1a3d] p-5 text-white">
              <p className="text-xl font-bold italic uppercase tracking-wide">Important Note</p>
              <p className="text-yellow-400 font-bold uppercase text-sm mt-1">Casino Bet Stakes</p>
              <p className="text-yellow-300 font-bold text-lg mt-1">
                1 Points =  100
              </p>
              <div className="flex gap-3 mt-3 text-sm leading-relaxed">
                <p className="flex-1 text-gray-200 text-left">
                  When your account balance is  100 then it will be shown 1 point when you enter the casino.
                  Similarly when 1 point is placed then the actual amount is
                  100 and all settlements will be done accordingly.
                </p>
                <p className="flex-1 text-gray-200 text-left">
                  जब आपके खाते में 100 होंगे, तो कैसीनो में प्रवेश करते समय 1 अंक दिखाई देंगे। इसी प्रकार, जब 1 अंक लगाए जाएंगे, तो वास्तविक राशि 100 होगी और सभी भुगतान उसी के अनुसार किए जाएंगे।
                </p>
              </div>
            </div>
            <div className="flex gap-2 p-3 bg-white">
              <button
                className="flex-1 py-2 bg-red-500 text-white font-semibold rounded"
                onClick={() => setMultiplyModal({ open: false, gameId: null, product: null })}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 bg-green-600 text-white font-semibold rounded"
                onClick={() => {
                  navigate(`/iframe-casino-new/${multiplyModal.product}/${multiplyModal.gameId}`);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TrendingGames;
