import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const HamburguesasSwiper = ({ items, prevRef, nextRef }) => {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={12}
      slidesPerView={1.5}
      navigation={{
        prevEl: prevRef?.current,
        nextEl: nextRef?.current,
      }}
      onSwiper={(swiper) => {
        setTimeout(() => {
          if (swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef?.current;
            swiper.params.navigation.nextEl = nextRef?.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          }
        });
      }}
      breakpoints={{
        640: { slidesPerView: 2.5 },
        1024: { slidesPerView: 3.5 },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="aspect-square bg-gray-300 rounded-2xl flex items-center justify-center">
            {item.nombre}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HamburguesasSwiper;