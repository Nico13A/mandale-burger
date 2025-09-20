const Button = ({ onClick, children, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={type === "button" ? onClick : undefined} 
      className={`font-medium cursor-pointer w-full py-3  rounded-md  transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
