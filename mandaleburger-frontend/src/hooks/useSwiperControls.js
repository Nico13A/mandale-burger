import { useState } from "react";

const useSwiperControls = () => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const onSwiperInit = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
        swiper.on("slideChange", () => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        });
    };
    return { isBeginning, isEnd, onSwiperInit };
}

export default useSwiperControls;
