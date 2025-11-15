"use client";

import React from 'react';
import Link from 'next/link';

/**
 * A modern, bright homepage component styled like the reference image.
 * Features white background, bright colors, and a two-column layout.
 */
export default function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Section - Text and CTA */}
          <div className="flex flex-col space-y-6">
            {/* Two-line Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl font-bold">
                <span className="text-sky-400">Free your</span>
                <br />
                <span className="text-gray-900">decision making</span>
              </h1>
            </div>

            {/* Description Paragraph */}
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Fast, simple, and incredibly powerful. Start with your preferences, and our AI-powered system creates personalized recommendations for you, complete with detailed insights and options that match your style.
            </p>

            {/* Call-to-Action Button */}
            <div className="pt-4">
              <Link
                href="/form"
                className="
                  inline-flex items-center gap-2
                  px-8 py-4 text-lg font-semibold
                  bg-sky-400 hover:bg-sky-500
                  text-white rounded-lg
                  shadow-lg shadow-sky-400/30
                  transition-all transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
                  cursor-pointer
                "
              >
                Get started for free
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Section - Visual Element */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-96">
              {/* 3D Cube-like Visual Element */}
              <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                {/* Glowing Cube Container */}
                <div className="
                  absolute inset-0
                  transform rotate-12
                  animate-pulse-slow
                ">
                  {/* Cube with gradient edges */}
                  <div 
                    className="relative w-full h-full transform-gpu"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front Face */}
                    <div className="
                      absolute inset-0
                      bg-gradient-to-br from-sky-400/20 via-purple-400/20 to-pink-400/20
                      rounded-2xl
                      border-2 border-sky-300/50
                      shadow-2xl
                      backdrop-blur-sm
                    "></div>
                    
                    {/* Top Face (Rotated) */}
                    <div 
                      className="
                        absolute inset-0
                        bg-gradient-to-br from-emerald-400/20 via-cyan-400/20 to-blue-400/20
                        rounded-2xl
                        border-2 border-emerald-300/50
                        shadow-2xl
                        backdrop-blur-sm
                      "
                      style={{ transform: 'rotateY(12deg) translateZ(20px)' }}
                    ></div>
                    
                    {/* Right Face (Rotated) */}
                    <div 
                      className="
                        absolute inset-0
                        bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-rose-400/20
                        rounded-2xl
                        border-2 border-purple-300/50
                        shadow-2xl
                        backdrop-blur-sm
                      "
                      style={{ transform: 'rotateX(12deg) translateZ(20px)' }}
                    ></div>

                    {/* Glowing Edges Effect */}
                    <div className="
                      absolute inset-0
                      rounded-2xl
                      bg-gradient-to-r from-sky-400/30 via-purple-400/30 to-pink-400/30
                      blur-xl
                      -z-10
                      animate-pulse
                    "></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-sky-300/40 rounded-full blur-xl animate-bounce-slow"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300/40 rounded-full blur-xl animate-bounce-slow-delayed"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
