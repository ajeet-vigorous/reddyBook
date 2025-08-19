/* eslint-disable react/prop-types */
// import loaderimg from "../../"
export default function Loader({ active }) {
    return (
        <>
            {active ? <>  <div className="fixed opacity-50 top-0 left-0 w-full h-full flex justify-center items-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <img className="w-20" src={"/images/loader.gif"} />
            </div>
            </> : null
            }
        </>
    );
}