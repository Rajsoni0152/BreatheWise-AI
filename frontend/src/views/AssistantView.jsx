import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  MapPin,
  Trash2
} from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { askAIAssistant } from '../api/client';
import { Card } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';

const PRESET_QUESTIONS = [
  'Why does smog get so much worse in winter mornings?',
  'What type of mask actually filters toxic PM2.5 particles?',
  'Is it safe for me to go for an outdoor run today?',
  'How can I prevent kitchen smoke and indoor pollution?',
  'How does the winter thermal inversion layer trap smog?'
];

export function AssistantView() {
  const { selectedCity, data } = useAirQuality();
  const currentAqi = data?.current?.us_aqi || 220;
  const pm25 = data?.current?.pm2_5 || 145.0;

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **BreatheWise AI**, your smart urban air quality assistant.\n\nI'm actively monitoring atmospheric conditions for **${selectedCity}** (Current AQI: **${currentAqi}**, PM2.5: **${pm25} µg/m³**).\n\nAsk me anything about winter smog, mask effectiveness, indoor air purifiers, or safe exercise routines!`,
      model_used: 'Google Gemini Pro / Flash Engine',
      suggested_actions: ['Ask about N95 Masks', 'Check Indoor Air Tips', 'Exercise Safety']
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send conversational history
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await askAIAssistant(
        userMessage.content,
        history,
        selectedCity,
        currentAqi,
        pm25
      );

      const aiMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.reply,
        model_used: response.model_used,
        provider: response.provider,
        is_fallback: response.is_fallback,
        suggested_actions: response.suggested_actions,
        safety_level: response.safety_level
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'I encountered an error connecting to the AI backend. Please verify your internet or try again shortly.',
          model_used: 'Error Fallback'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat cleared. Ready to assist with new questions about **${selectedCity}** air quality!`,
        model_used: 'BreatheWise AI Engine'
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-800 animate-fadeIn">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">BreatheWise AI Copilot</h3>
              <Badge variant="emerald" size="sm">
                Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Analyzing {selectedCity} • AQI {currentAqi} • PM2.5 {pm25} µg/m³</span>
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition text-xs flex items-center gap-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border ${
                  isUser
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Sub-actions for assistant response */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className={`w-3 h-3 ${msg.is_fallback ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className={msg.is_fallback ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                        {msg.provider || (msg.is_fallback ? 'Autonomous Knowledge Base' : 'Google Gemini Live API')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{msg.model_used || 'Google Gemini'}</span>
                    </span>

                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="hover:text-slate-300 flex items-center gap-1 transition"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {!isUser && msg.suggested_actions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(act)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 ml-1">Analyzing atmospheric science...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Inquiries */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        <span className="text-[11px] text-slate-500 font-semibold uppercase flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Quick Ask:
        </span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs transition shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder={`Ask about ${selectedCity} smog, N95 masks, indoor HEPA tips...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
