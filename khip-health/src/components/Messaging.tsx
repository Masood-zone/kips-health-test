import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Message } from '../types';
import { Mail, Search, Paperclip, Send, Inbox, ShieldCheck, MailOpen, PlusCircle, X, ChevronRight, Check } from 'lucide-react';

export default function Messaging() {
  const { messages, sendMessage, markMessageAsRead, currentUser } = useAppStore();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'General' | 'Referral' | 'Alert'>('All');

  // Compose Message form state
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [recipient, setRecipient] = useState('Komfo Anokye Teaching Hospital (KATH)');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Message['category']>('Referral Out');
  const [attachment, setAttachment] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return alert('Subject and details are required.');

    sendMessage(recipient, category, subject, body, attachment || undefined);

    // Reset composer state
    setSubject('');
    setBody('');
    setAttachment('');
    setShowComposeForm(false);
    setSelectedMessageId(messages[0]?.id || null); // auto select newly created
  };

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    markMessageAsRead(id);
  };

  // Filter messages based on search query & category tab selectors
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'All' ||
      (filterCategory === 'General' && msg.category === 'General') ||
      (filterCategory === 'Referral' && (msg.category === 'Referral Out' || msg.category === 'Referral In')) ||
      (filterCategory === 'Alert' && msg.category === 'Lab Alert');

    return matchesSearch && matchesCategory;
  });

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || null;

  return (
    <div className="space-y-6 font-sans">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Secure Messaging & Referrals</h2>
          <p className="text-sm text-slate-500">Coordinate specialist referral letters, clinical lab findings alerts, and district health briefs</p>
        </div>
        <button
          onClick={() => setShowComposeForm(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
        >
          <Inbox size={16} />
          Compose Referral / Memo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Inbox List Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search mail archives..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none bg-slate-55"
              />
              <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
            </div>

            {/* Category tabs */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">Mail Category</label>
              <div className="grid grid-cols-4 gap-1 select-none">
                {(['All', 'General', 'Referral', 'Alert'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`py-1 rounded text-center text-xxs font-semibold transition ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inbox items loop */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="p-8 text-center text-slate-400 text-xs italic">Secure inbox is empty.</p>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = msg.id === selectedMessageId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                      isActive ? 'bg-slate-50 border-l-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {msg.read ? (
                        <MailOpen size={16} className="text-slate-400" />
                      ) : (
                        <Mail size={16} className="text-emerald-500 animate-bounce" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{msg.senderRole}</span>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className={`text-xs font-semibold truncate mt-0.5 ${msg.read ? 'text-slate-700' : 'text-slate-900 font-bold'}`}>
                        {msg.subject}
                      </h4>
                      <p className="text-xxs text-slate-500 truncate mt-0.5">From: {msg.sender}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Expanded Reader Content */}
        <div className="lg:col-span-2">
          {activeMessage ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Reader Header Band */}
              <div className="bg-slate-900 text-white p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-400 font-bold">Secure health Service correspondence</span>
                    <h3 className="text-base font-bold mt-1 text-white">{activeMessage.subject}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    activeMessage.category === 'Lab Alert' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {activeMessage.category}
                  </span>
                </div>

                {/* Sender card detail */}
                <div className="flex flex-wrap gap-x-6 items-center text-xs text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500">SENDER:</span> <span className="text-slate-200 font-sans font-bold">{activeMessage.sender}</span> ({activeMessage.senderRole})
                  </div>
                  <div>
                    <span className="text-slate-500">RECIPIENT:</span> <span className="text-slate-200 font-sans">{activeMessage.recipient}</span>
                  </div>
                </div>
              </div>

              {/* Message body original detail */}
              <div className="p-6 space-y-6 font-sans">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 leading-relaxed text-sm text-slate-800 select-text whitespace-pre-wrap">
                  {activeMessage.body}
                </div>

                {/* Mail attachments if any */}
                {activeMessage.attachment && (
                  <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Paperclip size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{activeMessage.attachment}</span>
                        <span className="text-xxs font-mono text-slate-400">PDF Clinical Diagnostic referral File • 325 KB</span>
                      </div>
                    </div>
                    <button
                      className="text-xs bg-slate-900 text-white px-3 py-1 bg-none rounded hover:bg-slate-800 transition font-semibold"
                      onClick={() => alert(`Initiating direct administrative extraction for folder item: ${activeMessage.attachment}`)}
                    >
                      Inspect File
                    </button>
                  </div>
                )}

                {/* Bottom administrative advice metadata footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xxs font-mono text-slate-400">
                  <span>SECURE CHANNEL ENCRYPTED (AES-256)</span>
                  <span>IP: 192.168.1.13</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
              <Mail size={40} className="text-slate-350 mx-auto mb-2" />
              <h3 className="text-xs font-semibold text-slate-700">No Clinic Telegram Opened</h3>
              <p className="text-xxs text-slate-400 mt-1">Pick a message from the secure log to inspect content or compose outbound specialist referral letters.</p>
            </div>
          )}
        </div>
      </div>

      {/* COMPOSE DIALOG MODAL LAYOUT */}
      {showComposeForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Compose Clinical Correspondence</h3>
                <p className="text-[10px] text-slate-400 font-mono text-left">GHS TELEGRAM OUTBOX</p>
              </div>
              <button onClick={() => setShowComposeForm(false)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Destination Department / Outpost *</label>
                <select
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Komfo Anokye Teaching Hospital (KATH)">Komfo Anokye Teaching Hospital (KATH — Referral Hub)</option>
                  <option value="District Directorate General Outpost">District Directorate (Kwadaso Municipal Admin)</option>
                  <option value="Kwadaso Lab Section">Samuel Osei (Lead Laboratory Analyst)</option>
                  <option value="Dr. Kwabena Addo">Dr. Kwabena Addo (MD Consultant desk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Classification Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Referral Out">Specialist Referral Outgoing Letter</option>
                  <option value="Referral In">Incoming Referral Intake Logs</option>
                  <option value="General">General Administrative Memo</option>
                  <option value="Lab Alert">Laboratory Status Emergency Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Memo / Referral Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Cardiological Evaluation: Amina Mensah"
                  className="w-full px-3 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Urgency Description & Details *</label>
                <textarea
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide deep clinical SOAP history details or administrative logistics instructions..."
                  className="w-full h-32 px-3 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">Attach Medical Records File reference (Optional)</label>
                <input
                  type="text"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  placeholder="e.g. Referral-Amina-Mensah.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-slate-205 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowComposeForm(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold cursor-pointer text-slate-705"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer"
                >
                  Dispatch Correspondence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
