import { useState, useEffect } from 'react';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

const MatchDetailsHeaderSection = ({ children, marketType, minMax ,cashOut }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    // Check if market is bookmarked on component mount
    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(marketType));
    }, [marketType]);

    // Handle bookmark toggle
    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        let updatedBookmarks;

        if (isBookmarked) {
            updatedBookmarks = bookmarks.filter(item => item !== marketType);
        } else {
            updatedBookmarks = [...bookmarks, marketType];
        }

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(!isBookmarked);
        showTempNotification();
    };

    // Show temporary notification
    const showTempNotification = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    // Toggle expand/collapse with animation
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <section className="mb-4 border-b border-gray-200 pb-2 my-1 ">
            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
                    {isBookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks!'}
                </div>
            )}

            {/* Header */}
            <div className="cursor-pointer bg-slate-300">
                <p className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center">
                        <span className="
              h-10 inline-flex items-center px-[10px] mr-[10px] relative 
              text-white text-[13px] font-semibold uppercase bg-[var(--primary)] 
              leading-none mobile:text-[11px] mobile:px-[5px] 
              before:content-[''] before:absolute before:right-[-17px] before:top-0 
              before:w-[18px] before:h-full 
              before:bg-[linear-gradient(180deg,var(--primary)_0,var(--primary))] 
              before:[clip-path:polygon(0_-1px,100%_-1px,1px_100%,0_100%)]
            ">
                            {marketType}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark();
                            }}
                            className="ml-2 focus:outline-none"
                            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                            {isBookmarked ? (
                                <FaBookmark size={16} className='text-[var(--primary)]' />
                            ) : (
                                <FaRegBookmark size={16} className='text-[var(--primary)]' />
                            )}
                        </button>
                        {cashOut}
                    </div>

                    <span  onClick={toggleExpand} className="h-10 flex items-center text-black text-[10px] font-semibold mobile:text-[9px]">
                        <span>Min: {minMax.min} | Max: {minMax.max}</span>
                        {isExpanded ? (
                            <MdOutlineKeyboardArrowUp size={20} className='text-[var(--primary)] ml-2' />
                        ) : (
                            <MdOutlineKeyboardArrowDown size={20} className='text-[var(--primary)] ml-2' />
                        )}
                    </span>
                </p>
            </div>

            {/* Content with animation */}
            <div className={`
        overflow-hidden transition-all duration-300 ease-in-out bg-white
        ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
                <div className="py-0">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default MatchDetailsHeaderSection;