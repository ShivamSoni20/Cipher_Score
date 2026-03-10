import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const { address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // For demo/simple use, we'll use the first available connector (Argent/Braavos)
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-zk-base border-b border-zk-border flex items-center px-4 md:px-6">
      <Link to="/" className="font-mono text-zk-green text-sm font-semibold flex items-center gap-0">
        <span className="text-zk-text-secondary">&gt; </span>
        cipher_score
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
        {status === "connected" ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] text-zk-green">Connected</span>
              <span className="font-mono text-xs text-zk-text-primary">{truncate(address!)}</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="p-1.5 text-zk-text-secondary hover:text-zk-amber transition-colors"
              title="Disconnect"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="font-mono text-sm text-zk-green border border-zk-green px-4 py-1.5 rounded-[4px] bg-transparent hover:bg-[rgba(0,255,136,0.08)] transition-all duration-200 animate-glow-pulse flex items-center gap-2"
          >
            <Wallet size={16} />
            Connect Wallet
          </button>
        )}
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
          {status === "connected" ? (
            <div className="flex items-center justify-between border border-zk-border p-2 rounded-[4px]">
              <span className="font-mono text-xs text-zk-text-primary">{truncate(address!)}</span>
              <button
                onClick={() => disconnect()}
                className="text-zk-amber text-xs font-mono"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="font-mono text-sm text-zk-green border border-zk-green px-4 py-1.5 rounded-[4px] bg-transparent w-fit flex items-center gap-2"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
