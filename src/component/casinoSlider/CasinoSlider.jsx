import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { ourSlides } from '../../redux/_reducers/_reducers';

const CasinoSlider = ({ data }) => {
    const dispatch = useDispatch()
    // const { ourSlidesData, } = useSelector(
    //     (state) => state.authentication
    // );
    // const [sliderData, setslideData] = useState([])

    // useEffect(() => {
    //     const payload = { domain_id: 1 };
    //     dispatch(ourSlides(payload));
    // }, [dispatch]);

    // useEffect(() => {
    //     if (ourSlidesData) {
    //         const sliderFinaldata = ourSlidesData?.map(data => {
    //             return {
    //                 gameName: data?.title,
    //                 gameImg: data?.attachment,
    //             }
    //         })
    //           setslideData(sliderFinaldata);
    //     }
    // }, [ourSlidesData]);


    const CustomPrevArrow = ({ onClick }) => (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white"
            onClick={onClick}>
            <FaChevronLeft size={18} />
        </div>
    );

    const CustomNextArrow = ({ onClick }) => (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white"
            onClick={onClick}
        >
            <FaChevronRight size={18} />
        </div>
    );

    const settings = {
        // dots: true,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll: 1.5,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 2560,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,

                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,

                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,

                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    initialSlide: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    autoplay: true,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <section className="">
                <Slider {...settings}>
                    {data?.map((item, index) => (
                        <div key={index} className="cursor-pointer">
                            <a
                                className='flex gap-4'>
                                <img src={item.gameImg} alt={item.gameName} className='px-0 w-full' />
                            </a>
                        </div>
                    ))}
                </Slider>
            </section>
        </>
    )
}
export default CasinoSlider;