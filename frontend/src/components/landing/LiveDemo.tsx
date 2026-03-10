import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LiveDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const terminalLines = [
    { text: '> query: verify_income(0x742d...8f3a, 3000)', color: 'text-zk-text-primary' },
    { text: '> checking nullifier... ✓', color: 'text-zk-green' },
    { text: '> checking commitment... ✓', color: 'text-zk-green' },
    { text: '> checking freshness... ✓', color: 'text-zk-green' },
    { text: '> result: true', color: 'text-zk-green' },
    { text: '> raw_income: [HIDDEN]', color: 'text-zk-red', hidden: true },
    { text: '> wallet_history: [HIDDEN]', color: 'text-zk-red', hidden: true },
    { text: '> proof_data: 0x1a2b...', color: 'text-zk-blue-bright' },
  ];

  return (
    <section ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <p className="font-mono text-sm text-zk-text-secondary mb-10">// Live Demo</p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Borrower View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="bg-zk-card border border-zk-border rounded-[6px] p-6 hover:-translate-y-0.5 transition-all duration-200"
        >
          <p className="font-mono text-xs text-zk-text-secondary mb-4 uppercase tracking-wider">Borrower View</p>
          <div className="space-y-3">
            <div>
              <span className="font-mono text-xs text-zk-text-secondary">Wallet</span>
              <p className="font-mono text-sm text-zk-blue-bright">0x742d...d4e7</p>
            </div>
            <div>
              <span className="font-mono text-xs text-zk-text-secondary">Income (90 days)</span>
              <p className="font-mono text-sm text-zk-text-primary">~$3,200 – $4,800</p>
            </div>
            <Link
              to="/dashboard"
              className="font-mono text-xs font-semibold bg-zk-green text-zk-base px-4 py-2 rounded-[4px] hover:brightness-110 transition-all duration-200 glow-green active:scale-[0.98] w-full mt-2 inline-block text-center"
            >
              Generate Proof
            </Link>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-zk-green animate-pulse-dot" />
              <span className="font-mono text-sm text-zk-green animate-success-pulse">VERIFIED ✅</span>
            </div>
          </div>
        </motion.div>

        {/* Protocol View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-zk-card border border-zk-border rounded-[6px] p-6 hover:-translate-y-0.5 transition-all duration-200"
        >
          <p className="font-mono text-xs text-zk-text-secondary mb-4 uppercase tracking-wider">What the Protocol Sees</p>
          <div className="font-mono text-xs space-y-1">
            {terminalLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }}
                className={`${line.hidden ? 'text-[#FF4444] opacity-60 animate-pulse' : line.color}`}
              >
                {line.text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemo;
