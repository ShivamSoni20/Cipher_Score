import { Search, Shield, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Wallet History Scanned",
    desc: "Your on-chain income data is read locally. Nothing sent to any server.",
    borderColor: "border-l-zk-green",
    borderStyle: "border-l-[#00FF88]",
  },
  {
    num: "02",
    icon: Shield,
    title: "ZK Proof Generated",
    desc: "A Noir circuit generates an UltraHonk proof in ~2 seconds. Client-side only. Your exact income amount is never revealed.",
    borderColor: "border-l-zk-blue",
    borderStyle: "border-l-[#1F6FEB]",
  },
  {
    num: "03",
    icon: CheckCircle,
    title: "Oracle Queried On-Chain",
    desc: 'Any lending protocol calls verify_income() and gets a boolean. That\'s it. No raw data. Ever.',
    borderColor: "border-l-zk-green",
    borderStyle: "border-l-[#00FF88]",
  },
];

const HowItWorks = () => {
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

  return (
    <section ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <p className="font-mono text-sm text-zk-text-secondary mb-10">// How it works</p>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`bg-zk-card border border-zk-border rounded-[6px] p-6 border-l-2 ${step.borderStyle} hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-default`}
          >
            <span className="font-mono text-3xl font-bold text-zk-green">{step.num}</span>
            <step.icon className="text-zk-text-secondary mt-4 mb-3" size={20} />
            <h3 className="font-mono text-base font-semibold text-zk-text-primary mb-2">{step.title}</h3>
            <p className="font-body text-sm text-zk-text-secondary leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
