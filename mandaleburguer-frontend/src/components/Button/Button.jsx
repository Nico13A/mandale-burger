const Button = ({ onClick, children, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={type === "button" ? onClick : undefined} 
      className={`cursor-pointer w-full py-2  text-white rounded-lg  transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
