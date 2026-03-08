import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

const codeContent = `let oracle = IIncomeOracleDispatcher { 
    contract_address: ORACLE_ADDR 
};
let approved = oracle.verify_income(
    borrower, threshold, proof, inputs
);
// That's it. Undercollateralized lending, unlocked.`;

const IntegrationCode = () => {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSyntax = () => {
    const lines = codeContent.split('\n');
    return lines.map((line, i) => (
      <div key={i} className="leading-relaxed">
        {line.startsWith('//') ? (
          <span className="text-zk-text-secondary">{line}</span>
        ) : (
          <span>
            {line.split(/(\blet\b|IIncomeOracleDispatcher|\bcontract_address\b|\bORACLE_ADDR\b|\boracle\b|\bapproved\b|\bverify_income\b|\bborrower\b|\bthreshold\b|\bproof\b|\binputs\b)/).map((part, j) => {
              if (part === 'let') return <span key={j} className="text-[#FF7B72]">{part}</span>;
              if (part === 'IIncomeOracleDispatcher') return <span key={j} className="text-zk-green">{part}</span>;
              if (['oracle', 'approved', 'contract_address', 'ORACLE_ADDR', 'borrower', 'threshold', 'proof', 'inputs', 'verify_income'].includes(part))
                return <span key={j} className="text-zk-blue-bright">{part}</span>;
              return <span key={j} className="text-zk-text-primary">{part}</span>;
            })}
          </span>
        )}
      </div>
    ));
  };

  return (
    <section ref={ref} className="py-20 bg-zk-surface">
      <div className="max-w-6xl mx-auto px-4">
        <p className="font-mono text-sm text-zk-text-secondary mb-10">// Protocol Integration</p>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-zk-text-primary mb-4">
              3 lines of Cairo.
            </h2>
            <p className="font-body text-zk-text-secondary text-base leading-relaxed">
              Any Starknet lending protocol adds undercollateralized lending today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative group"
          >
            <div className="bg-zk-surface border border-zk-border rounded-[6px] p-5 transition-colors duration-300 group-hover:border-[rgba(0,255,136,0.3)]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-zk-text-secondary">cairo</span>
                <button
                  onClick={handleCopy}
                  className="font-mono text-xs text-zk-text-secondary hover:text-zk-green transition-colors duration-150 flex items-center gap-1"
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre className="font-mono text-sm overflow-x-auto">
                {renderSyntax()}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationCode;
