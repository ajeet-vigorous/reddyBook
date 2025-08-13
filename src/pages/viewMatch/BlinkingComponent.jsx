import React, { useState, useEffect } from 'react';
const BlinkingComponent = ({ price, size, color }) => {
    const [blink, setBlink] = useState(false);

    const [prevPrice, setPrevPrice] = useState(price);
    const [prevSize, setPrevSize] = useState(size);

    useEffect(() => {
        if (price !== prevPrice || size !== prevSize) {
            setBlink(true);
            const timeout = setTimeout(() => {
                setBlink(false);
                setPrevPrice(price);
                setPrevSize(size);
                setBlink(false);
            }, 300); 
            return () => clearTimeout(timeout);
        }
    }, [price,  prevPrice, prevSize, color]);
    return (

        <div className={`border-x h-12 border-gray-300 py-1 px-2 flex justify-center items-center ${blink ? `bg-[var(--blink-color)]` : `${color}`}`}>
        <div className='text-center leading-3'>
            <span className="2xl:text-[16px] lg:text-[16px] text-xs text-gray-800 font-bold">{price ? price : "-"}</span><br />
            <span className="2xl:text-xs lg:text-[10px] text-gray-900 text-xs">{size ? size : null}</span>
        </div>
    </div>
    );
};

export default BlinkingComponent;