import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-zk-base border-b border-zk-border flex items-center px-4 md:px-6">
      <Link to="/" className="font-mono text-zk-green text-sm font-semibold flex items-center gap-0">
        <span className="text-zk-text-secondary">&gt; </span>
        zk_income_oracle
        <span className="animate-blink text-zk-green ml-0.5">_</span>
      </Link>

      <div className="ml-auto hidden md:flex items-center gap-6">
        {isLanding && (
          <>
            <a href="#docs" className="font-mono text-sm text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150">Docs</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150">
              GitHub ↗
            </a>
          </>
        )}
        <button className="font-mono text-sm text-zk-green border border-zk-green px-4 py-1.5 rounded-[4px] bg-transparent hover:bg-[rgba(0,255,136,0.08)] transition-all duration-200 animate-glow-pulse">
          Connect Wallet
        </button>
      </div>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="ml-auto md:hidden text-zk-text-secondary hover:text-zk-text-primary"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-14 left-0 right-0 bg-zk-base border-b border-zk-border p-4 flex flex-col gap-4 md:hidden">
          {isLanding && (
            <>
              <a href="#docs" className="font-mono text-sm text-zk-text-secondary">Docs</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-zk-text-secondary">GitHub ↗</a>
            </>
          )}
          <button className="font-mono text-sm text-zk-green border border-zk-green px-4 py-1.5 rounded-[4px] bg-transparent w-fit">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
