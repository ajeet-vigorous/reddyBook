import { message } from "antd";


















function Providers({ name, data, userInfo }) {
    const handleResponseCasino = (product) => {
                    if(userInfo.data.isDemoClient){
 message.error("Demo User not allowed to play Casino. Play only with Real ID.");
    }else{
            window.location.href = `/casino/99998?name=${product?.category}&gameName=all`;
    }


    };



    return (
        <section className="py-0.5">
            <div className="pt-1">
                <div>
          <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
            <div className="flex space-x-2 items-center">
              <img src="/subHeader/menu-99998.png" className="w-[20px] h-[20px]" alt="menu" />
              <p>{name}</p>
            </div>
            <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
          </div>
        </div>
                <div className="grid lg:grid-cols-9 md:grid-cols-7 sm:grid-cols-5 grid-cols-3 gap-0.5 mt-0.5">
      {data?.sort((a, b) => a.position - b.position)?.map((item, idx) => (
        <div
          key={idx}
          onClick={() => handleResponseCasino(item)}
          className="relative cursor-pointer"
        >
          <div className="w-full ">
            <img
              src={`https://speedcdn.io/${item?.url_thumb}`}
              alt={item?.name}
              className="w-full h-full"
            />
             
          </div>

         
        </div>
      ))}
    </div>
            </div>
        </section>
    );
}

export default Providers;