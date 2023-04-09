import React from "react";
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
          <div className="swiper-zoom-container">
            <img
              src={image}
              alt={caption}
              className="mx-auto min-w-60"
              style={{ maxHeight: "75vh" }}
            />
          </div>
        </SwiperSlide>
      );
    })}
  </Swiper>
);

export default ImageCarousel;
