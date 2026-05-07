import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  CheckCheck,
  Zap,
  ChevronDown,
  PaperclipIcon,
  FileText
} from 'lucide-react';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const constraintsRef = useRef(null);

  const suggestedReplies = [
    'Share payment link',
    'Schedule callback tomorrow',
    'Offer 3-month settlement'
  ];

  const messages = [
    { id: 1, text: 'Hello, how can I help you?', time: '09:09', sender: 'system' },
    { id: 2, text: 'Could you confirm a convenient time to discuss the pending EMI?', time: '09:10', sender: 'system' },
    { id: 3, text: 'I will pay by next week', time: '09:17', sender: 'user' },
    { id: 4, text: "Noted. I'll mark a PTP for 14th. You'll receive a payment link shortly.", time: '12:44', sender: 'system' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" ref={constraintsRef}>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`pointer-events-auto fixed bottom-6 right-6 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden ${isOpen ? 'hidden' : 'flex'}`}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '650px',
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="pointer-events-auto fixed bottom-6 right-6 w-[400px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between cursor-move">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    RS
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">Ramautar Singh Gurjar</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400">+91 90277 70325 • online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                >
                  {isMinimized ? <ChevronDown size={18} /> : <Minus size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Status Badges */}
                <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full flex flex-col items-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Last activity</span>
                    <span className="text-[9px] font-black text-slate-700">2 days ago (05 May 2026)</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full flex flex-col items-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Created</span>
                    <span className="text-[9px] font-black text-slate-700">2 days ago (05 May 2026)</span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] shadow-inner">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative ${
                          msg.sender === 'user' 
                            ? 'bg-white text-slate-800 rounded-tl-none' 
                            : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                        }`}
                      >
                        <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[9px] text-slate-400 font-bold">{msg.time}</span>
                          {msg.sender === 'system' && <CheckCheck size={12} className="text-[#34b7f1]" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggested Replies */}
                <div className="p-4 bg-white border-t border-slate-50">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Zap size={14} className="text-indigo-600 fill-indigo-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Replies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedReplies.map((reply) => (
                      <button 
                        key={reply}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Info */}
                <div className="px-4 py-3">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <div className="flex items-start gap-2 mb-1">
                      <Zap size={14} className="text-amber-600 mt-0.5" />
                      <span className="text-xs font-black text-amber-900">Template required</span>
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium leading-normal">
                      More than 24 hours have passed since your last message with this customer. To reopen the WhatsApp conversation, send an approved template first.
                    </p>
                    <button className="mt-3 w-full py-2 bg-white border border-emerald-500 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-emerald-50 transition-colors">
                      Select Template
                    </button>
                  </div>
                </div>

                {/* Footer / Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 px-4 shadow-inner">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <FileText size={20} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <PaperclipIcon size={20} />
                    </button>
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 py-2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <Smile size={20} />
                    </button>
                    <button 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        message.trim() ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-100' : 'bg-slate-200 text-slate-400 scale-95'
                      }`}
                    >
                      <Send size={18} fill={message.trim() ? 'white' : 'transparent'} />
                    </button>
                  </div>
                  <p className="text-center text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">
                    Showing last 7 days • max 30 days available
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppChat;
