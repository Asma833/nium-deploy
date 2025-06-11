import { useNavigate } from 'react-router-dom';

function FallbackPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 text-gray-800 p-5">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-6">Please try refreshing the page or contact support if the issue persists.</p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Go Home
      </button>
    </div>
  );
}

export default FallbackPage;
