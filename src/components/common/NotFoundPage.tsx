import LogoutWrapper from '@/features/auth/components/LogoutWrapper';

function NotFoundPage() {
  return (
    <div className="flex w-full h-full items-center justify-center pt-5">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl text-gray-600">Page Not Found</h2>
        <p className="mb-8 text-gray-500">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a
          href="/"
          className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 transition-colors"
        >
          Go to Homepage
        </a>
        <div className="flex items-center justify-center mt-8">
          <LogoutWrapper>
            <button className="p-2 rounded-full hover:bg-muted/20">
              logout
            </button>
          </LogoutWrapper>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
