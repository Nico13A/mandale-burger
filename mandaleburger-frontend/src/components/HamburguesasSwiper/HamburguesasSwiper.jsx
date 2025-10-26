import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Eye } from "lucide-react";

const HamburguesasSwiper = ({ items, prevRef, nextRef, onClickItem }) => {
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
          <div className="cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="flex justify-center items-center bg-gradient-to-b from-white to-orange-100 overflow-hidden rounded-2xl">
              <img
                className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105"
                src={item.img}
                alt={item.name}
              />
            </div>

            <div className="h-2 w-full bg-gradient-to-b from-white via-[#d9d9d9]/30 to-gris-boton"></div>

            <div className="bg-gris-boton p-5 flex flex-col justify-between h-[140px]">
              <h3 className="text-lg font-semibold text-white text-center mb-2 tracking-wider">
                {item.name}
              </h3>

              <div className="flex justify-between items-center">
                <p className="font-semibold text-orange-500 text-sm">
                  &#36;{item.price}
                </p>
                <button
                  onClick={() => onClickItem && onClickItem(item.id)}
                  className="cursor-pointer bg-naranja-boton hover:bg-naranja-boton-hover text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HamburguesasSwiper;
