import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 127, label: "Proofs Generated" },
  { value: 3, label: "Protocols Integrated" },
  { value: null, label: "Starknet Sepolia Live" },
];

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(stats.map(s => s.value ? Math.round(s.value * eased) : 0));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [visible]);

  return (
    <div ref={ref} className="w-full bg-zk-surface border-y border-zk-border py-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="text-center"
          >
            {stat.value ? (
              <>
                <span className="font-mono text-3xl font-bold text-zk-green">{counts[i]}</span>
                <span className="font-mono text-sm text-zk-text-secondary ml-2">{stat.label}</span>
              </>
            ) : (
              <span className="font-mono text-sm text-zk-text-secondary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zk-green animate-pulse-dot" />
                {stat.label}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
