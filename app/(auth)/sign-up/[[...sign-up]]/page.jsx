import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
    
      <div className="hidden md:flex items-center justify-center bg-gray-100 text-gray-900 p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            AI Mock Interview
          </h1>
          <p className="text-lg opacity-90 max-w-sm">
            Practice smarter and faster with AI-powered mock interviews.
          </p>
        </div>
      </div>

      
      <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <SignUp />
      </div>
    </div>
  );
}

