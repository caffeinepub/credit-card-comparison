import React from 'react';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'credit-card-comparison');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center shadow-teal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="white" strokeWidth="2"/>
                  <path d="M6 15H10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-700 text-lg text-foreground tracking-tight">CardCompare</span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-medium">Find your perfect card</span>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden md:block">
                Compare up to 3 cards side-by-side
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div
          className="w-full h-40 sm:h-52 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x300.png)' }}
        >
          <div className="absolute inset-0 gradient-teal opacity-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-display font-800 text-2xl sm:text-4xl text-white tracking-tight drop-shadow-sm">
              Find & Compare Credit Cards
            </h1>
            <p className="mt-2 text-white/85 text-sm sm:text-base max-w-xl font-medium">
              Browse top credit cards, filter by category, and compare side-by-side to find the best fit for you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded gradient-teal flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="2.5"/>
                  <path d="M2 10H22" stroke="white" strokeWidth="2.5"/>
                </svg>
              </div>
              <span className="font-display font-600 text-foreground">CardCompare</span>
              <span>© {year} All rights reserved.</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with{' '}
              <Heart className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
              {' '}using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
