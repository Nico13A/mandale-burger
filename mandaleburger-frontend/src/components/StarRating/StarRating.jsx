export default function StarRating({ value = 0, onChange, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const isFilled = star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            className={`text-3xl md:text-5xl cursor-pointer select-none leading-none
              ${isFilled ? "text-yellow-500" : "text-gray-400"}
            `}
          >
            {isFilled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}