import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper";
import "../style.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/zoom";

const ImageCarousel = ({ images, caption }) => (
  <Swiper
    slidesPerView={"auto"}
    autoHeight={true}
    centeredSlides={true}
    spaceBetween={30}
    pagination={{
      clickable: true,
    }}
    zoom={true}
    navigation={true}
    modules={[Navigation, Pagination, Zoom]}
    className="mySwiper"
    style={{
      "--swiper-pagination-color": "#7EC1C6",
      "--swiper-navigation-color": "#7EC1C6",
    }}
  >
    {images.map((image, i) => {
      return (
        <SwiperSlide key={i} className="w-1/2">
          {/* <div className="swiper-zoom-container"> */}
          <img src={image} alt={caption} className="mx-auto min-w-60" />
          {/* </div> */}
        </SwiperSlide>
      );
    })}
  </Swiper>

  //   <div className="h-96">
  //     <Carousel slide={false}>
  //       {images.map((image) => {
  //         return <img src={image} alt={caption} className="object-scale-down" />;
  //       })}
  //     </Carousel>
  //   </div>

  //   <div id="indicators-carousel" className="relative" data-carousel="static">
  //     {/* <!-- Carousel wrapper --> */}
  //     <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
  //       {/* Images */}
  //       {images.map((image, i) => {
  //         return (
  //           <div
  //             className="hidden duration-700 ease-in-out"
  //             data-carousel-item={i === 0 ? "active" : ""}
  //           >
  //             <img
  //               src={image}
  //               className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
  //               alt={caption}
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //     {/* <!-- Slider indicators --> */}
  //     <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
  //       <button
  //         type="button"
  //         className="w-3 h-3 rounded-full"
  //         aria-current="true"
  //         aria-label="Slide 1"
  //         data-carousel-slide-to="0"
  //       ></button>
  //       <button
  //         type="button"
  //         className="w-3 h-3 rounded-full"
  //         aria-current="false"
  //         aria-label="Slide 2"
  //         data-carousel-slide-to="1"
  //       ></button>
  //     </div>
  //     {/* <!-- Slider controls --> */}
  //     <button
  //       type="button"
  //       className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
  //       data-carousel-prev
  //     >
  //       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
  //         <svg
  //           aria-hidden="true"
  //           className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2"
  //             d="M15 19l-7-7 7-7"
  //           ></path>
  //         </svg>
  //         <span className="sr-only">Previous</span>
  //       </span>
  //     </button>
  //     <button
  //       type="button"
  //       className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
  //       data-carousel-next
  //     >
  //       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
  //         <svg
  //           aria-hidden="true"
  //           className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2"
  //             d="M9 5l7 7-7 7"
  //           ></path>
  //         </svg>
  //         <span className="sr-only">Next</span>
  //       </span>
  //     </button>
  //   </div>

  // {images.map((image) => {
  //   return (
  //     <div>
  //       <img src={image} alt={caption} />
  //     </div>
  //   );
  // })}
);

export default ImageCarousel;
