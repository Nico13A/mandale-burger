import HamburguesasSwiper from "../HamburguesasSwiper/HamburguesasSwiper";

const SwiperSection = ({ title, items, prevRef, nextRef, isBeginning, isEnd, onSwiper }) => {
    return (
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="hidden md:flex gap-2">
            <button
              ref={prevRef}
              disabled={isBeginning}
              className="cursor-pointer px-3 py-2 bg-gris-boton text-white rounded-full hover:bg-gris-boton-hover disabled:bg-gray-300"
            >
              &#8592;
            </button>
            <button
              ref={nextRef}
              disabled={isEnd}
              className="cursor-pointer px-3 py-2 bg-gris-boton text-white rounded-full hover:bg-gris-boton-hover disabled:bg-gray-300"
            >
              &#8594;
            </button>
          </div>
        </div>
        <HamburguesasSwiper
          items={items}
          prevRef={prevRef}
          nextRef={nextRef}
          onSwiper={onSwiper}
        />
      </section>
    );
}

export default SwiperSection;
