import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { q: "Tell me about CampusX", a: "CampusX is an advanced AI consensus engine built during the HackSRM hackathon. It uses python frameworks and APIs to dynamically aggregate, evaluate, and rank multiple LLM outputs to yield more accurate answers." },
  { q: "Tell me about your Unity Zombie FPS", a: "It's a high-octane 3D first-person shooter game featuring custom-coded smart zombie AI (using state machines and navigation paths), dynamic weapon handling, and fluid physics-based player movement written in C# inside Unity." },
  { q: "What did you build at SRM University AP?", a: "As a CS student at SRM University AP, I've built CampusX (AI consensus), VOCA (AI language platform), SafeEcho (mental health analysis app), and a localized edition of Flappy Bird called Flappy Bhai with real-time Firebase high scores!" },
  { q: "How can I contact you?", a: "You can email me directly at shaikhasnain2007@gmail.com, or check out my LinkedIn (linkedin.com/in/shaik-hasnain-55a072396) and GitHub (github.com/ShaikHasnain-2007) profiles." },
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm Shaik's AI Portfolio Assistant. Ask me anything about his projects, skills, or hackathon timeline!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI Response calculation
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have that specific detail on record. You can try asking about 'CampusX', 'Unity Zombie FPS', 'SRM AP projects', or 'Contact details'!";
      
      const query = text.toLowerCase();

      // Simple keyword routing
      if (query.includes('campusx') || query.includes('consensus')) {
        botResponse = PRESETS[0].a;
      } else if (query.includes('unity') || query.includes('zombie') || query.includes('fps') || query.includes('game')) {
        botResponse = PRESETS[1].a;
      } else if (query.includes('srm') || query.includes('university') || query.includes('platform') || query.includes('voca') || query.includes('safeecho') || query.includes('flappy')) {
        botResponse = PRESETS[2].a;
      } else if (query.includes('contact') || query.includes('email') || query.includes('linkedin') || query.includes('github') || query.includes('social')) {
        botResponse = PRESETS[3].a;
      } else if (query.includes('cgpa') || query.includes('grades') || query.includes('gpa') || query.includes('semester')) {
        botResponse = "Shaik Hasnain completed his first semester at SRM University AP with a solid academic GPA of 8.4.";
      } else if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
        botResponse = "Hello! Nice to meet you. Ask me about Shaik's AI consensus engine (CampusX), Unity zombie FPS, or his hackathon history!";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200); // Realistic AI thinking delay
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-satoshi text-left">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[340px] md:w-[380px] h-[500px] border border-white/10 rounded-3xl bg-black/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden mb-4"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center relative">
                  <Bot size={16} className="text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sm text-white leading-tight">Hasnain's AI Companion</h3>
                  <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase">Active Agent</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-2 rounded-full bg-white/5 border border-white/5 transition-all duration-300 active:scale-95"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-4 select-text">
              {messages.map((m, i) => {
                const isBot = m.sender === 'bot';
                return (
                  <div 
                    key={i} 
                    className={`flex gap-3 max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    {/* Mini Icon */}
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                      isBot ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/25'
                    }`}>
                      {isBot ? <Bot size={12} /> : <User size={12} />}
                    </div>

                    {/* Chat Bubble */}
                    <div className={`rounded-2xl p-3 text-xs md:text-sm leading-relaxed ${
                      isBot 
                        ? 'bg-white/5 text-white border border-white/5 rounded-tl-none' 
                        : 'bg-gradient-to-r from-cyan-900/60 to-cyan-800/60 text-white border border-cyan-400/20 rounded-tr-none'
                    }`}>
                      <p>{m.text}</p>
                      <span className="text-[8px] text-white/30 block mt-1.5 text-right">{m.time}</span>
                    </div>
                  </div>
                );
              })}

              {/* Loader Typing animation */}
              {isTyping && (
                <div className="flex gap-3 self-start max-w-[85%]">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                    <Bot size={12} />
                  </div>
                  <div className="rounded-2xl p-3 bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Preset Questions list */}
            <div className="px-5 pb-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
              {PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(preset.q)}
                  className="shrink-0 bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/5 text-white/70 hover:text-white px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all duration-300"
                >
                  {preset.q.replace('Tell me about ', '')}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-4 bg-white/[0.01] border-t border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask Hasnain's AI..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.2)] outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-white hover:bg-cyan-400 hover:text-black text-black transition-all duration-300 font-bold p-3 rounded-xl flex items-center justify-center shrink-0 active:scale-95"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(34,211,238,0.4)] border border-white/10 hover:shadow-[0_10px_35px_rgba(217,70,239,0.5)] transition-shadow duration-500 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow pulsing ring around bubble */}
        <div className="absolute inset-[-4px] rounded-full border border-cyan-400/30 animate-pulse pointer-events-none" />
      </motion.button>
    </div>
  );
}
