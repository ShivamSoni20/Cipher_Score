import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CONFIG } from "../../config";

const codeLines = [
  { text: '// Starknet Sepolia — Live', color: 'text-zk-text-secondary', size: 'text-sm md:text-base' },
  { text: 'verify_income(', color: 'text-zk-text-primary', size: 'text-2xl md:text-4xl lg:text-[56px] lg:leading-tight' },
  { text: '  address,', color: 'text-zk-blue-bright', size: 'text-2xl md:text-4xl lg:text-[56px] lg:leading-tight' },
  { text: '  threshold', color: 'text-zk-blue-bright', size: 'text-2xl md:text-4xl lg:text-[56px] lg:leading-tight' },
  { text: ')', color: 'text-zk-text-primary', size: 'text-2xl md:text-4xl lg:text-[56px] lg:leading-tight' },
  { text: '// → returns: QUALIFIED ✅', color: 'text-zk-green', size: 'text-sm md:text-base', delay: true },
];

const Hero = () => {
  const [displayedLines, setDisplayedLines] = useState<{ text: string; index: number }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      setTypingDone(true);
      return;
    }

    const line = codeLines[currentLine];

    if (line.delay && currentChar === 0) {
      const timer = setTimeout(() => {
        setCurrentChar(1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const charIndex = line.delay ? currentChar - 1 : currentChar;

    if (charIndex >= line.text.length) {
      setDisplayedLines(prev => [...prev, { text: line.text, index: currentLine }]);
      setCurrentLine(prev => prev + 1);
      setCurrentChar(0);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentChar(prev => prev + 1);
    }, 40);
    return () => clearTimeout(timer);
  }, [currentLine, currentChar]);

  const getCurrentText = () => {
    if (currentLine >= codeLines.length) return '';
    const line = codeLines[currentLine];
    const charIndex = line.delay ? Math.max(0, currentChar - 1) : currentChar;
    return line.text.slice(0, charIndex);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full bg-[#00FF88] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-[#1F6FEB] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#00FF88] opacity-[0.02] blur-[80px] pointer-events-none" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Code block */}
        <div className="text-left inline-block mb-8">
          {displayedLines.map(({ text, index }) => (
            <div key={index} className={`font-mono ${codeLines[index].size} ${codeLines[index].color} whitespace-pre`}>
              {text}
            </div>
          ))}
          {currentLine < codeLines.length && (
            <div className={`font-mono ${codeLines[currentLine].size} ${codeLines[currentLine].color} whitespace-pre`}>
              {getCurrentText()}
              <span className="animate-blink text-zk-green">|</span>
            </div>
          )}
          {typingDone && (
            <span className="animate-blink text-zk-green font-mono">|</span>
          )}
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: typingDone ? 1 : 0, y: typingDone ? 0 : 10 }}
          transition={{ duration: 0.5 }}
          className="font-body text-zk-text-secondary text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        >
          The private creditworthiness primitive for Starknet DeFi.
          Any lending protocol integrates in 3 lines. Zero data exposed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: typingDone ? 1 : 0, y: typingDone ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/dashboard"
            className="font-mono text-sm font-semibold bg-zk-green text-zk-base px-5 py-2.5 rounded-[4px] hover:brightness-110 transition-all duration-200 glow-green inline-flex items-center gap-2 justify-center active:scale-[0.98]"
          >
            → Generate Your Proof
          </Link>
          <a
            href={`${CONFIG.STARKSCAN_BASE}/contract/${CONFIG.ORACLE_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-zk-text-secondary border border-zk-border-bright px-5 py-2.5 rounded-[4px] hover:border-zk-green hover:text-zk-text-primary transition-all duration-200 inline-flex items-center gap-2 justify-center"
          >
            View on Starkscan ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
