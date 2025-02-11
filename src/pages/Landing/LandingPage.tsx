import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-semibold text-purple-600">Simply Stoic</span>
            </a>
          </div>
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-24">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Master Your Mind with Ancient Wisdom
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Transform daily challenges into opportunities for growth using time-tested Stoic principles
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-lg bg-purple-600 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-700"
                >
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Morning Reflection',
                description: 'Start each day with purpose and clarity',
                date: '2 days ago',
                color: 'bg-purple-100',
                textColor: 'text-purple-900'
              },
              {
                title: 'Evening Review',
                description: 'Learn from your experiences',
                date: '1 day ago',
                color: 'bg-blue-100',
                textColor: 'text-blue-900'
              },
              {
                title: 'AI-Powered Insights',
                description: 'Gain deeper understanding of your progress',
                date: 'Just now',
                color: 'bg-green-100',
                textColor: 'text-green-900'
              }
            ].map((card, index) => (
              <div
                key={index}
                className={`rounded-2xl ${card.color} p-8 relative overflow-hidden group hover:shadow-lg transition-all`}
              >
                <div className="h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-semibold ${card.textColor}`}>
                      {card.title}
                    </h3>
                    <span className="text-sm text-gray-500">{card.date}</span>
                  </div>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Transformed Lives Through Stoic Practice
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands who have found inner peace and clarity
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "I've gone from constantly reacting to life's challenges to thoughtfully responding to them. This app has been transformative.",
                  author: "Sarah M.",
                  role: "Business Owner",
                  achievement: "180 days of practice"
                },
                {
                  quote: "The structured approach to Stoic practice has helped me maintain perspective during difficult times. It's become an essential part of my day.",
                  author: "Michael R.",
                  role: "Team Leader",
                  achievement: "365 days of practice"
                },
                {
                  quote: "The AI insights have helped me uncover patterns in my thinking I never noticed before. I'm more self-aware than ever.",
                  author: "Alex K.",
                  role: "Software Engineer",
                  achievement: "90 days of practice"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    <div className="mt-auto">
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-purple-600 mt-1">{testimonial.achievement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative isolate bg-purple-900 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Master Your Mind?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-purple-100">
                Join thousands of others who are transforming their lives through Stoic practice.
                Start your journey today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-purple-900 hover:bg-purple-50"
                >
                  Begin Your Practice
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Learn More <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}