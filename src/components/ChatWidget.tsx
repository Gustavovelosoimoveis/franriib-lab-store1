import React, { useState } from 'react';
import { MessageSquare, Send, X, ShieldAlert, Mail, User, Info, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: 'Suporte Técnico 3D',
    message: ''
  });
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Quick message options for WhatsApp
  const quickOptions = [
    { label: 'Desejo customizar um objeto específico 3D', text: 'Olá Fran! Tenho um projeto de modelagem 3D personalizado e gostaria de saber se vocês conseguem fatiar e imprimir para mim.' },
    { label: 'Dúvidas sobre prazo de impressão e entrega', text: 'Olá! Gostaria de saber qual o prazo médio de postagem para peças sob encomenda na Franriib.' },
    { label: 'Quero saber se o filamento PLA é resistente', text: 'Olá! Tenho dúvidas sobre a resistência térmica e durabilidade mecânica das peças em filamento PLA.' },
  ];

  // Send to WhatsApp API (Real integration)
  const handleRedirectWhatsApp = (textToSend: string) => {
    const formattedText = encodeURIComponent(textToSend || 'Olá Franriib Lab! Gostaria de tirar algumas dúvidas sobre os produtos 3D.');
    const whatsappUrl = `https://wa.me/5511999999999?text=${formattedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Submit Technical Support Email Form (Simulation)
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.name || !emailForm.email || !emailForm.message) return;

    setSendingEmail(true);

    setTimeout(() => {
      setSendingEmail(false);
      setEmailSent(true);
      // Reset form
      setEmailForm({
        name: '',
        email: '',
        subject: 'Suporte Técnico 3D',
        message: ''
      });
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
    }, 1500); // 1.5s simulated shipping delay
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="support-widget-container">
      {/* Floating launcher button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            id="btn-chat-widget-launcher"
            className="w-14 h-14 bg-[#D48C8C] hover:bg-[#C68B75] text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-colors border border-[#FAF6F0]"
            title="Atendimento ao Cliente"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Interactive Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-80 sm:w-96 bg-white rounded-2xl border border-[#E9E3D9] shadow-2xl overflow-hidden flex flex-col max-h-[520px] h-[520px]"
            id="support-chat-expanded"
          >
            {/* Header banner */}
            <div className="bg-[#2E3A46] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                  <div className="w-10 h-10 bg-[#D48C8C] rounded-full flex items-center justify-center font-bold text-sm text-white">
                    FR
                  </div>
                </div>
                <div>
                  <h4 className="font-sans font-medium text-sm">Franriib Lab Atendimento</h4>
                  <p className="text-[10px] text-gray-300 font-mono">Resposta média em 15 minutos</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                id="btn-close-widget"
                className="p-1 hover:bg-[#3A4958] rounded text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle support tabs */}
            <div className="flex border-b border-[#E9E3D9] text-xs font-mono bg-[#FAF6F0]">
              <button
                onClick={() => setActiveTab('chat')}
                id="tab-widget-chat"
                className={`flex-1 py-3 text-center transition-colors uppercase tracking-wider ${
                  activeTab === 'chat'
                    ? 'border-b-2 border-[#D48C8C] font-semibold text-[#2E3A46]'
                    : 'text-gray-500 hover:text-[#2E3A46]'
                }`}
              >
                Atendimento WhatsApp
              </button>
              
              <button
                onClick={() => setActiveTab('email')}
                id="tab-widget-email"
                className={`flex-1 py-3 text-center transition-colors uppercase tracking-wider ${
                  activeTab === 'email'
                    ? 'border-b-2 border-[#D48C8C] font-semibold text-[#2E3A46]'
                    : 'text-gray-500 hover:text-[#2E3A46]'
                }`}
              >
                Suporte Técnico E-mail
              </button>
            </div>

            {/* Tab Panel contents */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAF6F0]/40 space-y-4">
              
              {/* TAB A: WHATSAPP DIRECT CHAT */}
              {activeTab === 'chat' && (
                <div className="space-y-4 animate-fadeIn" id="panel-widget-chat">
                  {/* Automated welcome bubble */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 bg-[#2E3A46] text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      FR
                    </div>
                    <div className="bg-white border border-[#E9E3D9] p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-[#2E3A46] leading-relaxed max-w-[80%] font-sans">
                      <p>Olá! Sou a <strong>Fran</strong> da Franriib Lab. 👋</p>
                      <p className="mt-1">Nossas impressoras estão prontas para fatiar seus desejos! Qual dúvida gostaria de tirar ou qual design 3D quer trazer ao mundo?</p>
                    </div>
                  </div>

                  {/* Suggestive quick options */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block pl-1">Selecione uma dúvida frequente:</span>
                    <div className="flex flex-col gap-1.5">
                      {quickOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRedirectWhatsApp(opt.text)}
                          id={`btn-quick-support-${idx}`}
                          className="w-full text-left p-2.5 bg-white hover:bg-[#D48C8C]/5 text-[#2E3A46] hover:text-[#D48C8C] border border-[#E9E3D9] hover:border-[#D48C8C]/30 text-xs rounded-xl shadow-sm transition-all flex items-center justify-between group"
                        >
                          <span className="line-clamp-1">{opt.label}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-gray-400 group-hover:text-[#D48C8C] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#E9E3D9] pt-4 text-center">
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Ao enviar uma mensagem personalizada abaixo, você será redirecionado para o WhatsApp da nossa central criativa.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB B: TECHNICAL EMAIL SUPPORT FORM */}
              {activeTab === 'email' && (
                <div className="animate-fadeIn" id="panel-widget-email">
                  {emailSent ? (
                    <div className="text-center p-8 bg-white border border-[#E9E3D9] rounded-2xl space-y-3 shadow-sm animate-scaleIn">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                        <Send className="w-5 h-5" />
                      </div>
                      <h5 className="font-sans font-medium text-sm text-[#2E3A46]">Chamado Aberto com Sucesso!</h5>
                      <p className="text-xs text-gray-500 font-sans">
                        Nosso suporte técnico foi notificado. Responderemos no endereço de e-mail fornecido em até 24 horas úteis.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitEmail} className="space-y-3.5 bg-white p-4 border border-[#E9E3D9] rounded-2xl shadow-sm">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Seu Nome completo</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400"><User className="w-3.5 h-3.5" /></span>
                          <input
                            type="text"
                            placeholder="Ex: Maria Clara Silva"
                            value={emailForm.name}
                            onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Seu E-mail para retorno</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400"><Mail className="w-3.5 h-3.5" /></span>
                          <input
                            type="email"
                            placeholder="nome@provedor.com"
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                            className="w-full pl-9 pr-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Assunto</label>
                        <select
                          value={emailForm.subject}
                          onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs text-[#2E3A46]"
                        >
                          <option value="Suporte Técnico 3D">Suporte Técnico 3D</option>
                          <option value="Dúvida sobre Modelagem">Dúvida sobre Modelagem</option>
                          <option value="Solicitação de Orçamento">Solicitação de Orçamento</option>
                          <option value="Falha no Pagamento / Envio">Falha no Pagamento / Envio</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">Sua Mensagem ou problema</label>
                        <textarea
                          rows={3}
                          placeholder="Descreva com detalhes o seu pedido ou dúvida técnica..."
                          value={emailForm.message}
                          onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E9E3D9] bg-[#FAF6F0]/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46] resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        id="btn-send-support-email"
                        disabled={sendingEmail}
                        className="w-full py-2 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-widest rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {sendingEmail ? 'Enviando Chamado...' : 'Enviar por E-mail'}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Custom Input messaging section for WhatsApp tab */}
            {activeTab === 'chat' && (
              <div className="p-3 border-t border-[#E9E3D9] bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Digite uma dúvida para enviar..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRedirectWhatsApp(chatMessage);
                      setChatMessage('');
                    }
                  }}
                  className="flex-1 px-3.5 py-2 border border-[#E9E3D9] bg-[#FAF6F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D48C8C] text-[#2E3A46]"
                />
                <button
                  onClick={() => {
                    handleRedirectWhatsApp(chatMessage);
                    setChatMessage('');
                  }}
                  id="btn-send-custom-chat"
                  className="w-9 h-9 bg-[#2E3A46] hover:bg-[#D48C8C] text-white rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
