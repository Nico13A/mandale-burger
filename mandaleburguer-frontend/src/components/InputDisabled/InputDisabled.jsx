const InputDisabled = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 border border-gray-300 rounded-md shadow-none
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300
        transition placeholder-gray-400 text-sm md:text-base
        ${props.disabled || props.readOnly ? "bg-orange-100 text-naranja-boton-hover border-orange-200 cursor-not-allowed" : "bg-white"} 
        ${className}`}
      {...props}
    />
  );
};

export default InputDisabled;
