import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-zk-border bg-zk-base py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-mono text-sm text-zk-green flex items-center">
          <span className="text-zk-text-secondary">&gt; </span>
          zk_income_oracle
        </Link>

        <p className="font-mono text-xs text-zk-text-secondary text-center">
          Built at Starknet Re&#123;define&#125; Hackathon · February 2026
        </p>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150">GitHub</a>
          <a href="#" className="font-mono text-xs text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150">Starkscan</a>
          <a href="#" className="font-mono text-xs text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150">Docs</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-zk-border">
        <p className="font-mono text-[10px] text-zk-text-secondary text-center">
          Powered by Starknet · Noir · Garaga · Tongo Protocol
        </p>
      </div>
    </footer>
  );
};

export default Footer;
