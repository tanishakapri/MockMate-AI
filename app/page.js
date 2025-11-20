import React from 'react'
import { Button } from '@/components/ui/button';
import Head from 'next/head';
import Contect from './_components/Contect';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";

const page = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Head>
        <title>AI Mock Interview</title>
        <meta
          name="description"
          content="Ace your next interview with AI-powered mock interviews"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">

        {/* Header */}
        <header className="w-full py-6 bg-white/80 backdrop-blur-md dark:bg-gray-800/90 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">


      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        AI Mock Interview
      </h1>




            <nav className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">

              {/* GitHub Link */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/tanishakapri"
                className="hover:scale-110 transition-transform"
              >
                <FaGithub className="w-10 h-8 text-gray-800 dark:text-gray-200" />
              </a>

              {/* Menu Links */}
              <div className="flex items-center space-x-6 font-medium">
                <a
                  href="#features"
                  className="text-gray-800 hover:text-blue-600 dark:text-gray-200"
                >
                  Features
                </a>
                <a
                  href="#contact"
                  className="text-gray-800 hover:text-blue-600 dark:text-gray-200"
                >
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </header>

       
        <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-950 dark:to-gray-800">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Ace Your Next Interview
          </h2>

          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
            Practice with AI-powered mock interviews and receive personalized,
            actionable feedback instantly.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <a
              href="/dashboard"
              className="px-8 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-200 transition-all"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="px-8 py-3 text-lg font-semibold border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Everything you need to prepare confidently for your next interview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-all">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  AI Mock Interviews
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Realistic interview simulations tailored to your skill level.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-all">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Instant Feedback
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Receive immediate insights to improve your performance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-all">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Detailed Reports
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Get a full breakdown of strengths, weaknesses, and tips.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-white dark:bg-gray-900 px-6">
          <Contect />
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center mt-10">
        <p className="text-lg font-medium tracking-wide">
          © {new Date().getFullYear()} AI Mock Interview
        </p>
      </footer>
    </div>
  );
};

export default page;

