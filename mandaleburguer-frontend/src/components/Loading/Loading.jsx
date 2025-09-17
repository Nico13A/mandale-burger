import Spinner from "../Spinner/Spinner";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
      <Spinner size="w-16 h-16" color="border-naranja-boton" />
    </div>
  );
};

export default Loading;
