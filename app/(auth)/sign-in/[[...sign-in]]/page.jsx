import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        
        {/* Left Section */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Interview Illustration"
            src="https://www.southmoorschool.co.uk/wp-content/uploads/job_interview_illustration.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194..."
                  fill="currentColor"
                />
              </svg>
            </a>

            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Welcome to AI Interview Platform 🎯
            </h2>

            <p className="mt-4 max-w-md leading-relaxed text-white/90">
              Practice interviews, improve your skills, and boost your confidence
              with our AI-powered interview preparation system.
            </p>
          </div>
        </section>

        {/* Right Section */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">

            {/* Mobile Header */}
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20 dark:bg-gray-900"
                href="#"
              >
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0.41 10.3847..." fill="currentColor" />
                </svg>
              </a>

              <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                Welcome to AI Interview Platform 🎯
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                Your personalized space to practice interviews and track your
                progress anytime, anywhere.
              </p>
            </div>

            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}

