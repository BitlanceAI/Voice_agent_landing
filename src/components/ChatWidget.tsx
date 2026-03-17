"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    toggleWidget?: () => void;
    sendText?: () => void;
  }
}

export default function ChatWidget() {
  useEffect(() => {
    // Prevent double-initialization during Fast Refresh
    if (document.getElementById("bitlance-chat-widget-script")) return;

    const script = document.createElement("script");
    script.id = "bitlance-chat-widget-script";
    script.type = "text/javascript";
    script.text = `
// ── CONFIG ───────────────────────────────────────────────────────────────
const WEBHOOK_URL  = 'https://bitlancetechhub.app.n8n.cloud/webhook/lead-chatbot';
const CALENDLY_URL = 'https://calendly.com/YOUR_CALENDLY_LINK'; // ← Replace
const SESSION_ID   = 'session_' + Math.random().toString(36).substr(2, 9);

// ── STATE ────────────────────────────────────────────────────────────────
let isOpen = false, hasOpened = false;
let currentStep = 'welcome';
let selectedServices = [];   // multi-select array
let sessionData = {};
let contactInfo = { name: '', email: '', phone: '' };

const progressMap = { welcome:5, service:22, role:44, budget:66, timeline:85, contact:95, booked:100, end:100 };

// ── TOGGLE ───────────────────────────────────────────────────────────────
window.toggleWidget = function toggleWidget() {
  isOpen = !isOpen;
  document.getElementById('chat-widget')?.classList.toggle('open', isOpen);
  document.getElementById('chat-bubble')?.classList.toggle('open', isOpen);
  if (isOpen && !hasOpened) {
    hasOpened = true;
    const dot = document.querySelector('.notif-dot');
    if (dot) { dot.style.animation='none'; setTimeout(()=>dot.remove(),300); }
    setTimeout(() => startConversation(), 400);
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────
function setProgress(step) {
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = (progressMap[step]||0) + '%';
}
function scrollToBottom() {
  const el = document.getElementById('messages');
  if (!el) return;
  setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 80);
}
function fmt(text) {
  return text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\n/g,'<br/>');
}

// ── ADD MESSAGES ─────────────────────────────────────────────────────────
function addBotMessage(text, delay=0) {
  return new Promise(resolve => setTimeout(() => {
    const msgs = document.getElementById('messages');
    if (!msgs) return resolve();
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = \`<div class="msg-avatar">🤖</div><div class="msg-bubble">\${fmt(text)}</div>\`;
    msgs.appendChild(div); scrollToBottom(); resolve();
  }, delay));
}
function addUserMessage(text) {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = \`<div class="msg-bubble">\${text}</div>\`;
  msgs.appendChild(div); scrollToBottom();
}
function showTyping() {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'typing-bubble'; div.id = 'typing-indicator';
  div.innerHTML = \`<div class="msg-avatar">🤖</div><div class="typing-dots"><span></span><span></span><span></span></div>\`;
  msgs.appendChild(div); scrollToBottom();
}
function removeTyping() { const t=document.getElementById('typing-indicator'); if(t) t.remove(); }

// ── RENDER BUTTONS ───────────────────────────────────────────────────────
function addButtons(buttons, isMulti = false, confirmLabel = '✅ Continue') {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const wrap = document.createElement('div');
  wrap.className = 'multi-select-wrap';
  wrap.id = 'btn-options';

  if (isMulti) {
    buttons.forEach(btn => {
      const b = document.createElement('button');
      b.className = 'btn-option multi';
      b.textContent = btn.label;
      b.dataset.value = btn.value;
      b.dataset.step = btn.step;
      b.onclick = () => toggleMultiSelect(b, btn, confirmBtn);
      wrap.appendChild(b);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'confirm-btn';
    confirmBtn.textContent = confirmLabel;
    confirmBtn.onclick = () => submitMultiSelect(buttons[0].step, wrap, confirmBtn);
    wrap.appendChild(confirmBtn);
  } else {
    buttons.forEach(btn => {
      const b = document.createElement('button');
      b.className = 'btn-option single';
      b.textContent = btn.label;
      b.onclick = () => handleSingleClick(btn, wrap);
      wrap.appendChild(b);
    });
  }

  msgs.appendChild(wrap); scrollToBottom();
}

function toggleMultiSelect(btn, data, confirmBtn) {
  const val = btn.dataset.value;
  if (btn.classList.contains('checked')) {
    btn.classList.remove('checked');
    selectedServices = selectedServices.filter(s => s !== val);
  } else {
    btn.classList.add('checked');
    selectedServices.push(val);
  }
  if (selectedServices.length > 0) {
    confirmBtn.classList.add('active');
    confirmBtn.textContent = \`✅ Continue with \${selectedServices.length} selected\`;
  } else {
    confirmBtn.classList.remove('active');
    confirmBtn.textContent = '✅ Continue';
  }
}

function submitMultiSelect(nextStep, wrap, confirmBtn) {
  if (selectedServices.length === 0) return;
  wrap.querySelectorAll('.btn-option').forEach(b => b.style.pointerEvents='none');
  confirmBtn.style.pointerEvents = 'none';
  confirmBtn.textContent = '✓ Submitted';

  const serviceLabels = {
    ai_voice_bot:'🎙️ AI Voice Bot', ai_chatbot:'🤖 AI Chatbot', workflow_automation:'⚙️ Workflow Automation',
    crm_integration:'📊 CRM Integration', web_development:'🌐 Web / App Dev', ai_marketing:'📣 AI Marketing'
  };
  const summary = selectedServices.map(s => serviceLabels[s]||s).join(', ');
  addUserMessage(summary);

  sessionData.selectedServices = [...selectedServices];

  sendToWebhook({
    step: nextStep,
    selectedServices: [...selectedServices],
    selectedRole:     sessionData.selectedRole     || '',
    selectedBudget:   sessionData.selectedBudget   || '',
    selectedTimeline: sessionData.selectedTimeline || '',
    sessionId: SESSION_ID,
    ...contactInfo
  });
}

function handleSingleClick(btn, wrap) {
  wrap.querySelectorAll('.btn-option').forEach(b => { b.disabled=true; });
  const clicked = Array.from(wrap.querySelectorAll('.btn-option')).find(b=>b.textContent===btn.label);
  if (clicked) clicked.classList.add('selected');
  addUserMessage(btn.label);

  if (btn.step === 'role')     sessionData.selectedRole     = btn.value;
  if (btn.step === 'budget')   sessionData.selectedBudget   = btn.value;
  if (btn.step === 'timeline') sessionData.selectedTimeline = btn.value;

  sendToWebhook({
    step: btn.step,
    buttonValue: btn.value,
    sessionId: SESSION_ID,
    selectedServices: sessionData.selectedServices || [],
    selectedRole:     sessionData.selectedRole     || '',
    selectedBudget:   sessionData.selectedBudget   || '',
    selectedTimeline: sessionData.selectedTimeline || '',
    ...contactInfo
  });
}

// ── CONTACT FORM ─────────────────────────────────────────────────────────
function addContactForm() {
  const msgs = document.getElementById('messages');
  if (!msgs) return;
  const form = document.createElement('div');
  form.className = 'contact-form'; form.id = 'contact-form';
  form.innerHTML = \`
    <input id="cf-name"  type="text"  placeholder="Your full name *" required/>
    <input id="cf-email" type="email" placeholder="Email address *"  required/>
    <input id="cf-phone" type="tel"   placeholder="WhatsApp number (e.g. +91...)"/>
    <button onclick="submitContact()">🚀 Book My Free Strategy Call</button>
  \`;
  msgs.appendChild(form); scrollToBottom();
}

window.submitContact = function submitContact() {
  const name  = document.getElementById('cf-name')?.value.trim();
  const email = document.getElementById('cf-email')?.value.trim();
  const phone = document.getElementById('cf-phone')?.value.trim();
  if (!name||!email) return;
  contactInfo = { name, email, phone };
  const form = document.getElementById('contact-form');
  if (form) form.remove();
  addUserMessage(\`📧 \${email}\`);
  sendToWebhook({
    step: 'contact',
    sessionId: SESSION_ID,
    name, email, phone,
    selectedServices: sessionData.selectedServices || [],
    selectedRole:     sessionData.selectedRole     || '',
    selectedBudget:   sessionData.selectedBudget   || '',
    selectedTimeline: sessionData.selectedTimeline || ''
  });
}

// ── TEXT INPUT ────────────────────────────────────────────────────────────
window.sendText = function sendText() {
  const input = document.getElementById('footer-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMessage(text);
  sendToWebhook({ step:currentStep, message:text, sessionId:SESSION_ID, ...sessionData, ...contactInfo });
}

// ── START ─────────────────────────────────────────────────────────────────
function startConversation() {
  sendToWebhook({ step:'welcome', message:'hi', sessionId:SESSION_ID });
}

// ── SEND TO WEBHOOK ───────────────────────────────────────────────────────
async function sendToWebhook(payload) {
  showTyping(); setProgress(payload.step);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    removeTyping();
    if (!res.ok) throw new Error('HTTP '+res.status);
    handleResponse(await res.json());
  } catch(err) {
    removeTyping();
    console.error('Webhook error:', err);
    handleLocalFallback(payload);
  }
}

// ── HANDLE RESPONSE ───────────────────────────────────────────────────────
function handleResponse(data) {
  currentStep = data.nextStep || currentStep;
  if (data.selectedServices) sessionData.selectedServices = data.selectedServices;
  if (data.selectedRole)     sessionData.selectedRole     = data.selectedRole;
  if (data.selectedBudget)   sessionData.selectedBudget   = data.selectedBudget;
  if (data.selectedTimeline) sessionData.selectedTimeline = data.selectedTimeline;
  setProgress(currentStep);
  if (data.response) addBotMessage(data.response);
  if (data.buttons && data.buttons.length > 0) {
    setTimeout(() => addButtons(data.buttons, data.multiSelect||false, data.confirmButtonLabel), 300);
  }
  if (data.showContactForm)  setTimeout(() => addContactForm(), 400);
}

// ── LOCAL FALLBACK ────────────────────────────────────────────────────────
function handleLocalFallback(payload) {
  const step = payload.step;
  const flows = {
    welcome: {
      response: "👋 Welcome to **Bitlance TechHub**!\\n\\nWe build AI Voice Bots & Business Automation solutions. Let's find how we can help — just **4 quick steps**!\\n\\nWhich services are you interested in? *(Select all that apply)*",
      nextStep: 'service', multiSelect: true, confirmButtonLabel: '✅ Continue with selected',
      buttons: [
        { label:'🎙️ AI Voice Bot',          value:'ai_voice_bot',        step:'service' },
        { label:'🤖 AI Chatbot / Lead Bot',  value:'ai_chatbot',          step:'service' },
        { label:'⚙️ Workflow Automation',    value:'workflow_automation', step:'service' },
        { label:'📊 CRM Integration',        value:'crm_integration',     step:'service' },
        { label:'🌐 Web / App Development',  value:'web_development',     step:'service' },
        { label:'📣 AI Marketing Automation',value:'ai_marketing',        step:'service' }
      ]
    },
    service: {
      response: \`Excellent choices! 💪 We specialise in all of that.\\n\\nNow, what best describes your role?\`,
      nextStep:'role',
      buttons:[
        { label:'👔 Business Owner / Founder',        value:'owner',          step:'role' },
        { label:'📈 Sales / Marketing Manager',        value:'sales_marketing',step:'role' },
        { label:'💻 CTO / Tech Lead',                  value:'tech_lead',      step:'role' },
        { label:'🏢 Enterprise / Corp Decision Maker', value:'enterprise',     step:'role' }
      ]
    },
    role: {
      response:"What's your approximate project budget?", nextStep:'budget',
      buttons:[
        { label:'💵 Under $500',      value:'under_500',   step:'budget' },
        { label:'💰 $500 – $2,000',   value:'500_2000',    step:'budget' },
        { label:'💎 $2,000 – $10,000',value:'2000_10000',  step:'budget' },
        { label:'🏦 $10,000+',        value:'10000_plus',  step:'budget' }
      ]
    },
    budget: {
      response:"Almost there! 🎯 When are you looking to get started?", nextStep:'timeline',
      buttons:[
        { label:'🔥 ASAP – Within 1 week', value:'asap',       step:'timeline' },
        { label:'📅 This Month',            value:'this_month', step:'timeline' },
        { label:'🗓️ Next 1–3 Months',      value:'1_3_months', step:'timeline' },
        { label:'🔮 Just Exploring',        value:'exploring',  step:'timeline' }
      ]
    },
    timeline: {
      response:"🎉 You're a great fit for **Bitlance TechHub**!\\n\\nShare your contact details and we'll book a strategy call for you.",
      nextStep:'contact', showContactForm:true
    }
  };

  const flow = flows[step];
  if (!flow) return;
  currentStep = flow.nextStep;
  setProgress(currentStep);
  addBotMessage(flow.response);
  if (flow.buttons)         setTimeout(()=>addButtons(flow.buttons, flow.multiSelect||false, flow.confirmButtonLabel), 300);
  if (flow.showContactForm) setTimeout(()=>addContactForm(), 400);
}
`;

    document.body.appendChild(script);

    return () => {
      script.remove();
      delete window.toggleWidget;
      delete window.sendText;
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --bitlance-brand: #22c7c8;
          --bitlance-brand-dark: #0e8e90;
          --bitlance-brand-glow: rgba(34, 199, 200, 0.35);
          --bitlance-accent: rgba(34, 199, 200, 0.7);
          --bitlance-bg: #0c0b14;
          --bitlance-surface: #141220;
          --bitlance-surface2: #1d1a2f;
          --bitlance-border: rgba(255, 255, 255, 0.08);
          --bitlance-text: #f0eef8;
          --bitlance-muted: rgba(240, 238, 248, 0.55);
          --bitlance-radius: 18px;
          --bitlance-widget-w: 390px;
        }

        /* ── BUBBLE ── */
        #chat-bubble {
          position: fixed;
          bottom: 22px;
          right: 22px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--bitlance-brand), var(--bitlance-brand-dark));
          box-shadow: 0 8px 32px var(--bitlance-brand-glow), 0 2px 8px rgba(0, 0, 0, 0.18);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: bitlanceBubbleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        #chat-bubble:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 40px var(--bitlance-brand-glow);
        }
        #chat-bubble svg {
          transition: transform 0.3s, opacity 0.3s;
        }
        #chat-bubble.open .icon-chat {
          opacity: 0;
          transform: scale(0.5) rotate(90deg);
        }
        #chat-bubble.open .icon-close {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        #chat-bubble .icon-close {
          position: absolute;
          opacity: 0;
          transform: scale(0.5) rotate(-90deg);
        }
        .notif-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: rgba(34, 199, 200, 0.9);
          border-radius: 50%;
          border: 2px solid rgba(12, 11, 20, 0.9);
          animation: bitlancePulse 1.8s infinite;
        }
        @keyframes bitlanceBubbleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bitlancePulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.35);
          }
        }

        /* ── WIDGET ── */
        #chat-widget {
          position: fixed;
          bottom: 104px;
          right: 22px;
          width: var(--bitlance-widget-w);
          max-height: 640px;
          background: var(--bitlance-surface);
          border: 1px solid var(--bitlance-border);
          border-radius: var(--bitlance-radius);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 199, 200, 0.12);
          display: flex;
          flex-direction: column;
          z-index: 9998;
          overflow: hidden;
          transform: translateY(20px) scale(0.95);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.25s ease;
          color: var(--bitlance-text);
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #chat-widget.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: all;
        }

        .widget-header {
          background: linear-gradient(135deg, var(--bitlance-brand-dark) 0%, var(--bitlance-brand) 100%);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .widget-header::after {
          content: "";
          position: absolute;
          right: -20px;
          top: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
        }
        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.22);
        }
        .header-info {
          flex: 1;
        }
        .header-info strong {
          font-size: 0.95rem;
          font-weight: 800;
          display: block;
          color: #fff;
        }
        .header-info span {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .online-dot {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: bitlancePulse 2s infinite;
        }

        .progress-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.9));
          width: 0%;
          transition: width 0.6s ease;
        }

        .widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 16px 10px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .msg {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          animation: bitlanceMsgIn 0.35s cubic-bezier(0.34, 1.3, 0.64, 1) both;
        }
        @keyframes bitlanceMsgIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .msg.bot {
          flex-direction: row;
        }
        .msg.user {
          flex-direction: row-reverse;
        }
        .msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--bitlance-brand), var(--bitlance-brand-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }
        .msg-bubble {
          max-width: 82%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 0.875rem;
          line-height: 1.55;
        }
        .msg.bot .msg-bubble {
          background: var(--bitlance-surface2);
          border: 1px solid var(--bitlance-border);
          border-bottom-left-radius: 4px;
          color: var(--bitlance-text);
        }
        .msg.user .msg-bubble {
          background: linear-gradient(135deg, var(--bitlance-brand), var(--bitlance-brand-dark));
          border-bottom-right-radius: 4px;
          color: #fff;
        }
        .msg-bubble strong {
          font-weight: 700;
        }

        .typing-bubble {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .typing-dots {
          background: var(--bitlance-surface2);
          border: 1px solid var(--bitlance-border);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          padding: 12px 16px;
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .typing-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(240, 238, 248, 0.55);
          animation: bitlanceBounce 1.2s infinite;
        }
        .typing-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .typing-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bitlanceBounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        .multi-select-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: bitlanceMsgIn 0.4s 0.1s cubic-bezier(0.34, 1.3, 0.64, 1) both;
        }

        .btn-option {
          background: transparent;
          border: 1px solid rgba(34, 199, 200, 0.35);
          color: rgba(240, 238, 248, 0.85);
          font-size: 0.83rem;
          padding: 9px 14px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          position: relative;
        }
        .btn-option:hover {
          background: rgba(34, 199, 200, 0.14);
          border-color: rgba(34, 199, 200, 0.7);
          color: #fff;
        }
        .btn-option.single:hover {
          transform: translateX(3px);
        }
        .btn-option.single:active {
          transform: scale(0.97);
        }
        .btn-option.single.selected {
          background: rgba(34, 199, 200, 0.18);
          border-color: rgba(34, 199, 200, 0.85);
          color: #fff;
          pointer-events: none;
        }

        .btn-option.multi {
          padding-right: 40px;
        }
        .btn-option.multi::after {
          content: "";
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          border: 2px solid rgba(34, 199, 200, 0.5);
          border-radius: 5px;
          background: transparent;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-option.multi.checked {
          background: rgba(34, 199, 200, 0.18);
          border-color: rgba(34, 199, 200, 0.85);
          color: #fff;
        }
        .btn-option.multi.checked::after {
          background: rgba(34, 199, 200, 0.85);
          border-color: rgba(34, 199, 200, 0.85);
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='9' viewBox='0 0 12 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4L4.5 7.5L11 1' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
        }

        .confirm-btn {
          margin-top: 4px;
          background: linear-gradient(135deg, var(--bitlance-brand), var(--bitlance-brand-dark));
          color: #fff;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 11px 18px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
          opacity: 0.4;
          pointer-events: none;
        }
        .confirm-btn.active {
          opacity: 1;
          pointer-events: all;
        }
        .confirm-btn.active:hover {
          transform: translateY(-1px);
          opacity: 0.92;
        }

        .contact-form {
          background: var(--bitlance-surface2);
          border: 1px solid var(--bitlance-border);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          animation: bitlanceMsgIn 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) both;
        }
        .contact-form input {
          background: rgba(12, 11, 20, 0.85);
          border: 1px solid var(--bitlance-border);
          color: var(--bitlance-text);
          font-size: 0.85rem;
          padding: 9px 12px;
          border-radius: 9px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .contact-form input:focus {
          border-color: rgba(34, 199, 200, 0.8);
        }
        .contact-form input::placeholder {
          color: rgba(240, 238, 248, 0.45);
        }
        .contact-form button {
          background: linear-gradient(135deg, var(--bitlance-brand), var(--bitlance-brand-dark));
          color: #fff;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 10px;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .contact-form button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .widget-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--bitlance-border);
          background: rgba(20, 18, 32, 0.9);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-input {
          flex: 1;
          background: var(--bitlance-surface2);
          border: 1px solid var(--bitlance-border);
          border-radius: 999px;
          padding: 9px 16px;
          color: var(--bitlance-text);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .footer-input:focus {
          border-color: rgba(34, 199, 200, 0.8);
        }
        .footer-input::placeholder {
          color: rgba(240, 238, 248, 0.5);
        }
        .footer-send {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bitlance-brand);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .footer-send:hover {
          background: var(--bitlance-brand-dark);
          transform: scale(1.05);
        }
        .powered-by {
          text-align: center;
          font-size: 0.68rem;
          color: rgba(240, 238, 248, 0.5);
          padding: 5px 0 8px;
          opacity: 0.75;
          letter-spacing: 0.03em;
          background: rgba(20, 18, 32, 0.9);
        }

        @media (max-width: 440px) {
          #chat-widget {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 96px;
          }
          #chat-bubble {
            right: 16px;
            bottom: 20px;
          }
        }
      `}</style>

      <button id="chat-bubble" onClick={() => window.toggleWidget?.()} aria-label="Open chat">
        <div className="notif-dot" />
        <svg
          className="icon-chat"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <svg
          className="icon-close"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div id="chat-widget" aria-label="Chat widget" role="dialog" aria-modal="false">
        <div className="widget-header">
          <div className="header-avatar">🤖</div>
          <div className="header-info">
            <strong>Bitlance TechHub</strong>
            <span>
              <span className="online-dot" /> AI Assistant · Replies instantly
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" id="progress-fill" />
        </div>

        <div className="widget-messages" id="messages" />

        <div className="widget-footer">
          <input
            className="footer-input"
            id="footer-input"
            type="text"
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") window.sendText?.();
            }}
          />
          <button className="footer-send" onClick={() => window.sendText?.()} aria-label="Send">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div className="powered-by">Powered by Bitlance TechHub · AI Lead Qualifier</div>
      </div>
    </>
  );
}

