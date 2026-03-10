import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, FileText, Code, ExternalLink, Lock, Check, Copy, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

const WALLET = "0x742d35Cc6634C0532925a3b8D4C9E8f3a2b1d4e7";
const COMMITMENT = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";
const NULLIFIER = "0x9f8e7d6c5b4a3928170615043322110e0f0e0d0c";

const sidebarItems = [
  { icon: Zap, label: "Generate Proof", active: true },
  { icon: FileText, label: "My Commitments", active: false },
  { icon: Code, label: "Integration Guide", active: false },
  { icon: ExternalLink, label: "View on Starkscan", active: false },
];

const stepLabels = ["Connect Wallet", "Scan History", "Generate Proof", "Register On-Chain"];

type ProofStep = 0 | 1 | 2 | 3;

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState<ProofStep>(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showSnippet, setShowSnippet] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-progress through steps
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    return () => clearTimeout(timer1);
  }, []);

  // Scan progress
  useEffect(() => {
    if (currentStep !== 1) return;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep(2), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Terminal lines for proof generation
  useEffect(() => {
    if (currentStep !== 2) return;
    const lines = [
      "> Loading Noir circuit...  ✓",
      "> Computing witness...     ✓",
      "> Generating proof...      ✓",
      "> Verifying locally...     ✓",
    ];
    lines.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        if (i === lines.length - 1) {
          setTimeout(() => setCurrentStep(3), 800);
        }
      }, (i + 1) * 600);
    });
  }, [currentStep]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const mockTxRows = Array.from({ length: 8 }, (_, i) => ({
    date: `2026-0${1 + Math.floor(i / 3)}-${10 + i * 3}`,
    type: ["Transfer", "Swap", "Stake", "Bridge", "Transfer", "Swap", "Claim", "Stake"][i],
    amount: "█████",
    status: "✓",
  }));

  return (
    <div className="min-h-screen bg-zk-base">
      <Navbar />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-16 left-4 z-40 md:hidden bg-zk-card border border-zk-border p-2 rounded-[4px]"
      >
        {sidebarOpen ? <X size={16} className="text-zk-text-secondary" /> : <Menu size={16} className="text-zk-text-secondary" />}
      </button>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-14 left-0 z-30 w-60 h-[calc(100vh-56px)] bg-zk-surface border-r border-zk-border flex flex-col transition-transform duration-200`}>
          <div className="p-4">
            <span className="font-mono text-sm text-zk-green flex items-center">
              <span className="text-zk-text-secondary">&gt; </span>zk_oracle
              <span className="animate-blink text-zk-green ml-0.5">_</span>
            </span>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] font-mono text-sm transition-colors duration-150 ${item.active
                    ? "text-zk-green border-l-2 border-l-[#00FF88] bg-[rgba(0,255,136,0.05)]"
                    : "text-zk-text-secondary hover:text-zk-text-primary hover:bg-[rgba(255,255,255,0.03)]"
                  }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zk-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zk-green animate-pulse-dot" />
              <div>
                <p className="font-mono text-xs text-zk-green">Connected</p>
                <p className="font-mono text-[10px] text-zk-text-secondary">{truncate(WALLET)}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 min-h-[calc(100vh-56px)]">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="font-mono text-xl font-bold text-zk-text-primary">Generate CIPHER SCORE</h1>
                <p className="font-body text-sm text-zk-text-secondary mt-1">Prove your creditworthiness without revealing any data</p>
              </div>
              <span className="font-mono text-xs text-zk-text-secondary flex items-center gap-1.5 mt-2 md:mt-0">
                <span className="w-2 h-2 rounded-full bg-zk-amber" />
                Sepolia Testnet
              </span>
            </div>

            {/* Step indicator */}
            <div className="flex items-center mb-10 overflow-x-auto pb-2">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all duration-500 ${i < currentStep
                        ? "bg-zk-green border-zk-green text-zk-base"
                        : i === currentStep
                          ? "border-zk-green text-zk-green animate-pulse"
                          : "border-zk-border text-zk-text-secondary"
                      }`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className={`font-mono text-[10px] mt-1 whitespace-nowrap ${i <= currentStep ? "text-zk-green" : "text-zk-text-secondary"
                      }`}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className="w-12 md:w-20 h-0.5 mx-1 relative">
                      <div className="absolute inset-0 bg-zk-border" />
                      <div
                        className="absolute inset-y-0 left-0 bg-zk-green transition-all duration-700"
                        style={{ width: i < currentStep ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1fr,280px] gap-6">
              {/* Main card */}
              <div className={`bg-zk-card border rounded-[6px] p-6 transition-all duration-500 ${currentStep === 3 ? "border-zk-green bg-[rgba(0,255,136,0.03)] animate-success-pulse" : "border-zk-border"
                }`}>
                {/* Step 1: Scanning */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="font-mono text-base font-semibold text-zk-text-primary mb-4">Scanning Wallet History</h2>
                    <div className="relative overflow-hidden rounded-[4px] border border-zk-border mb-4">
                      {/* Scan line */}
                      <div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zk-green to-transparent opacity-60 z-10 animate-scan-line"
                      />
                      <table className="w-full font-mono text-xs">
                        <thead>
                          <tr className="border-b border-zk-border text-zk-text-secondary">
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockTxRows.map((row, i) => (
                            <tr
                              key={i}
                              className={`border-b border-zk-border transition-colors duration-300 ${scanProgress > (i + 1) * 12 ? "bg-[rgba(0,255,136,0.03)]" : ""
                                }`}
                            >
                              <td className="p-2 text-zk-text-secondary">{row.date}</td>
                              <td className="p-2 text-zk-text-primary">{row.type}</td>
                              <td className="p-2 text-zk-text-secondary blur-sm">{row.amount}</td>
                              <td className="p-2 text-zk-green">{row.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-zk-border rounded-full h-1.5">
                        <div className="bg-zk-green h-1.5 rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-xs text-zk-text-secondary">Scanning 90-day history... {scanProgress}%</span>
                        <span className="font-mono text-[10px] text-zk-text-secondary">Your data never leaves your browser</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Generating */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="font-mono text-base font-semibold text-zk-text-primary mb-4">Generating ZK Proof</h2>
                    <div className="bg-zk-base border border-zk-border rounded-[4px] p-4 font-mono text-sm space-y-2">
                      {terminalLines.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-zk-green"
                        >
                          {line}
                        </motion.p>
                      ))}
                      {terminalLines.length < 4 && (
                        <span className="text-zk-green animate-pulse">⠋</span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-zk-text-secondary mt-3">Estimated: ~2 seconds</p>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
                    <p className="font-mono text-3xl font-bold text-zk-green mb-2">✓ INCOME VERIFIED</p>
                    <p className="font-mono text-sm text-zk-text-secondary mb-6">Threshold: $3,000 / 90 days — MET</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="font-mono text-xs text-zk-text-secondary">Generated in</p>
                        <p className="font-mono text-sm text-zk-text-primary">1.8s</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-xs text-zk-text-secondary">Expires</p>
                        <p className="font-mono text-sm text-zk-text-primary">30 days</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-xs text-zk-text-secondary">Network</p>
                        <p className="font-mono text-sm text-zk-text-primary">Sepolia</p>
                      </div>
                    </div>

                    <div className="text-left space-y-3 mb-6">
                      <CopyField label="Commitment" value={COMMITMENT} field="commitment" copiedField={copiedField} onCopy={copyToClipboard} />
                      <CopyField label="Nullifier" value={NULLIFIER} field="nullifier" copiedField={copiedField} onCopy={copyToClipboard} />
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 font-mono text-sm font-semibold bg-zk-green text-zk-base py-2.5 rounded-[4px] hover:brightness-110 transition-all duration-200 glow-green active:scale-[0.98]">
                        Register On-Chain
                      </button>
                      <button
                        onClick={() => copyToClipboard(COMMITMENT, "commit-btn")}
                        className="flex-1 font-mono text-sm text-zk-text-primary border border-zk-border-bright py-2.5 rounded-[4px] hover:border-zk-green hover:text-zk-green transition-all duration-200"
                      >
                        {copiedField === "commit-btn" ? "Copied!" : "Copy Commitment"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 0: Waiting */}
                {currentStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <p className="font-mono text-sm text-zk-text-secondary animate-pulse">Connecting wallet...</p>
                  </motion.div>
                )}
              </div>

              {/* Right sidebar panel */}
              <div className="space-y-4 hidden lg:block">
                <div className="bg-zk-card border border-zk-border rounded-[6px] p-4">
                  <h3 className="font-mono text-xs text-zk-text-secondary uppercase tracking-wider mb-4">How your proof works</h3>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-zk-text-secondary mb-4">
                    <span className="px-2 py-1 bg-zk-base border border-zk-border rounded-[4px]">Private Data</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-zk-base border border-zk-border rounded-[4px]">Noir Circuit</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-zk-base border border-zk-border rounded-[4px]">ZK Proof</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-zk-base border border-zk-border rounded-[4px]">Oracle</span>
                  </div>

                  <p className="font-mono text-xs text-zk-text-secondary mb-3">What protocols see:</p>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-zk-text-secondary">
                      <Lock size={12} className="text-[#FF4444]" />
                      Your exact income: <span className="text-[#FF4444]">Hidden</span>
                    </div>
                    <div className="flex items-center gap-2 text-zk-text-secondary">
                      <Lock size={12} className="text-[#FF4444]" />
                      Your transactions: <span className="text-[#FF4444]">Hidden</span>
                    </div>
                    <div className="flex items-center gap-2 text-zk-text-secondary">
                      <Lock size={12} className="text-[#FF4444]" />
                      Your wallet history: <span className="text-[#FF4444]">Hidden</span>
                    </div>
                    <div className="flex items-center gap-2 text-zk-green">
                      <Check size={12} />
                      Threshold met: <span className="font-semibold">TRUE</span>
                    </div>
                  </div>
                </div>

                {/* Integration snippet */}
                <div className="bg-zk-card border border-zk-border rounded-[6px]">
                  <button
                    onClick={() => setShowSnippet(!showSnippet)}
                    className="w-full flex items-center justify-between px-4 py-3 font-mono text-xs text-zk-text-secondary hover:text-zk-text-primary transition-colors duration-150"
                  >
                    Show integration code
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showSnippet ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showSnippet && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <pre className="font-mono text-[10px] text-zk-text-primary p-4 pt-0 leading-relaxed">
                          {`let oracle = IIncomeOracleDispatcher {
    contract_address: ORACLE_ADDR
};
let approved = oracle.verify_income(
    borrower, threshold, proof, inputs
);`}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const CopyField = ({
  label,
  value,
  field,
  copiedField,
  onCopy,
}: {
  label: string;
  value: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) => (
  <div>
    <span className="font-mono text-xs text-zk-text-secondary">{label}</span>
    <div
      className="flex items-center gap-2 group cursor-pointer"
      onClick={() => onCopy(value, field)}
    >
      <span className="font-mono text-sm text-zk-blue-bright">{value.slice(0, 12)}...{value.slice(-4)}</span>
      {copiedField === field ? (
        <span className="font-mono text-[10px] text-zk-green">Copied!</span>
      ) : (
        <Copy size={12} className="text-zk-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  </div>
);

export default Dashboard;
