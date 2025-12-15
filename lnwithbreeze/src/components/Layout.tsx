import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Toaster position="top-center" />
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#FFDE00] border-b-4 border-black px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          <span>⚡</span> BitNGN
        </Link>
        <nav className="flex gap-6">
          <Link
            to="/"
            className={`font-bold hover:underline decoration-4 decoration-black underline-offset-4 ${isActive('/') ? 'underline' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/remittance"
            className={`font-bold hover:underline decoration-4 decoration-black underline-offset-4 ${isActive('/remittance') ? 'underline' : ''}`}
          >
            Send Money
          </Link>
          <Link
            to="/merchant"
            className={`font-bold hover:underline decoration-4 decoration-black underline-offset-4 ${isActive('/merchant') ? 'underline' : ''}`}
          >
            Merchant
          </Link>
          <Link
            to="/wallet"
            className={`font-bold hover:underline decoration-4 decoration-black underline-offset-4 ${isActive('/wallet') ? 'underline' : ''}`}
          >
            Wallet
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-black text-white p-6 border-t-4 border-black">
        <div className="container mx-auto text-center font-bold">
          <p>BITNGN REMITTANCE © {new Date().getFullYear()}</p>
          <p className="text-sm opacity-50 mt-2">Built with Bitcoin Lightning ⚡</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
