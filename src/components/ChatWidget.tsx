"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    toggleWidget?: () => void;
    sendText?: () => void;
  }
}

export default function ChatWidget() {
  const [showCta, setShowCta] = useState(false);
  const auditUrl = "https://www.bitlancetechhub.com/apply/audit";

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

  useEffect(() => {
    const openTimer = window.setTimeout(() => setShowCta(true), 1200);
    const autoHideTimer = window.setTimeout(() => setShowCta(false), 12000);
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(autoHideTimer);
    };
  }, []);

  return (
    <>
      <div id="chat-cta" className={showCta ? "visible" : ""} role="status" aria-live="polite">
        <div className="chat-cta-title">Book a Demo</div>
        <div className="chat-cta-sub">Get a quick walkthrough and free audit recommendations.</div>
        <div className="chat-cta-actions">
          <a className="chat-cta-btn" href={auditUrl} target="_blank" rel="noreferrer">
            Book a Demo
          </a>
          <button className="chat-cta-close" type="button" onClick={() => setShowCta(false)}>
            Dismiss
          </button>
        </div>
      </div>

      <button
        id="chat-bubble"
        onClick={() => {
          setShowCta(false);
          window.toggleWidget?.();
        }}
        aria-label="Open chat"
      >
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

