const Input = ({ type = 'text', value, onChange, placeholder, name }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition placeholder-gray-400 text-sm md:text-base"
    />
  );
};

export default Input;

