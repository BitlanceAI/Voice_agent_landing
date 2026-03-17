"use client";

import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const WEBHOOK_URL = "https://bitlancetechhub.app.n8n.cloud/webhook/lead-chatbot";
const CALENDLY_URL = "https://calendly.com/bitlanceai/task-regarding";

// ─────────────────────────────────────────────────────────────────────────────
// 📊  TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Step = "welcome" | "service" | "role" | "budget" | "timeline" | "contact" | "booked" | "end";

interface ButtonOption {
  label: string;
  value: string;
  step: string;
}

interface FlowEntry {
  response: string;
  nextStep: Step;
  multiSelect?: boolean;
  confirmButtonLabel?: string;
  buttons?: ButtonOption[];
  showContactForm?: boolean;
  showCalendly?: boolean;
}

interface SessionData {
  selectedServices: string[];
  selectedRole: string;
  selectedBudget: string;
  selectedTimeline: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

type MessageType =
  | { type: "bot"; text: string }
  | { type: "user"; text: string }
  | { type: "buttons"; buttons: ButtonOption[]; isMulti: boolean; confirmLabel?: string; id: number }
  | { type: "contactForm" }
  | { type: "calendlyCTA"; url: string; message?: string }
  | { type: "bookingConfirmed"; email: string };

interface WebhookPayload {
  step: string;
  message?: string;
  sessionId: string;
  buttonValue?: string;
  selectedServices?: string[];
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

interface WebhookResponse {
  response?: string;
  nextStep?: Step;
  buttons?: ButtonOption[];
  multiSelect?: boolean;
  confirmButtonLabel?: string;
  showContactForm?: boolean;
  showCalendly?: boolean;
  calendlyUrl?: string;
  calendlyMessage?: string;
  selectedServices?: string[];
  selectedRole?: string;
  selectedBudget?: string;
  selectedTimeline?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 📊  PROGRESS MAP
// ─────────────────────────────────────────────────────────────────────────────
const PROGRESS_MAP: Record<string, number> = {
  welcome: 5,
  service: 22,
  role: 44,
  budget: 66,
  timeline: 85,
  contact: 95,
  booked: 100,
  end: 100,
};

// ─────────────────────────────────────────────────────────────────────────────
// 🗂️  LOCAL FALLBACK FLOWS
// ─────────────────────────────────────────────────────────────────────────────
const LOCAL_FLOWS: Record<string, FlowEntry> = {
  welcome: {
    response:
      "👋 Welcome to **Bitlance TechHub**!\n\nWe build AI Voice Bots & Business Automation solutions. Let's find how we can help — just **4 quick steps**!\n\nWhich services are you interested in? *(Select all that apply)*",
    nextStep: "service",
    multiSelect: true,
    confirmButtonLabel: "✅ Continue with selected",
    buttons: [
      { label: "🎙️ AI Voice Bot", value: "ai_voice_bot", step: "service" },
      { label: "🤖 AI Chatbot / Lead Bot", value: "ai_chatbot", step: "service" },
      { label: "⚙️ Workflow Automation", value: "workflow_automation", step: "service" },
      { label: "📊 CRM Integration", value: "crm_integration", step: "service" },
      { label: "🌐 Web / App Development", value: "web_development", step: "service" },
      { label: "📣 AI Marketing Automation", value: "ai_marketing", step: "service" },
    ],
  },
  service: {
    response: "Excellent choices! 💪 We specialise in all of that.\n\nNow, what best describes your role?",
    nextStep: "role",
    buttons: [
      { label: "👔 Business Owner / Founder", value: "owner", step: "role" },
      { label: "📈 Sales / Marketing Manager", value: "sales_marketing", step: "role" },
      { label: "💻 CTO / Tech Lead", value: "tech_lead", step: "role" },
      { label: "🏢 Enterprise / Corp Decision Maker", value: "enterprise", step: "role" },
    ],
  },
  role: {
    response: "What's your approximate project budget?",
    nextStep: "budget",
    buttons: [
      { label: "💵 Under $500", value: "under_500", step: "budget" },
      { label: "💰 $500 – $2,000", value: "500_2000", step: "budget" },
      { label: "💎 $2,000 – $10,000", value: "2000_10000", step: "budget" },
      { label: "🏦 $10,000+", value: "10000_plus", step: "budget" },
    ],
  },
  budget: {
    response: "Almost there! 🎯 When are you looking to get started?",
    nextStep: "timeline",
    buttons: [
      { label: "🔥 ASAP – Within 1 week", value: "asap", step: "timeline" },
      { label: "📅 This Month", value: "this_month", step: "timeline" },
      { label: "🗓️ Next 1–3 Months", value: "1_3_months", step: "timeline" },
      { label: "🔮 Just Exploring", value: "exploring", step: "timeline" },
    ],
  },
  timeline: {
    response:
      "🎉 You're a great fit for **Bitlance TechHub**!\n\nShare your contact details and we'll book a strategy call for you.",
    nextStep: "contact",
    showContactForm: true,
  },
  contact: {
    response:
      "🙌 You're all set!\n\nClick below to pick a time — our team will show you a live demo and outline a custom solution.",
    nextStep: "booked",
    showCalendly: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔤  HELPER: parse **bold** markdown + newlines → JSX
// ─────────────────────────────────────────────────────────────────────────────
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        return part;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 💬  TYPING INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={styles.msgRow}>
      <div style={styles.botAvatar}>🤖</div>
      <div style={styles.typingDots}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎉  CONFETTI
// ─────────────────────────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#5B4FE8", "#00E5A0", "#fff", "#a89fff", "#00c87a"];
  return (
    <>
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 + Math.random() * 60}%`,
            top: "30%",
            width: `${5 + Math.random() * 6}px`,
            height: `${5 + Math.random() * 6}px`,
            background: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: "2px",
            pointerEvents: "none",
            zIndex: 99999,
            animation: `confettiFall ${0.8 + Math.random() * 0.6}s ${Math.random() * 0.5}s linear both`,
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📅  CALENDLY OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
interface CalendlyOverlayProps {
  url: string;
  onClose: () => void;
  onBooked: (payload: Record<string, unknown>) => void;
}

function CalendlyOverlay({ url, onClose, onBooked }: CalendlyOverlayProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      const data = e.data as Record<string, unknown>;
      const name = (data.event as string) || (data.type as string) || "";
      if (name === "calendly.event_scheduled" || name === "event_scheduled") {
        onBooked((data.payload as Record<string, unknown>) || data);
      }
      if (typeof e.data === "string" && e.data.includes("event_scheduled")) {
        onBooked({});
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onBooked]);

  const embedUrl =
    url +
    (url.includes("?") ? "&" : "?") +
    "embed_domain=" +
    encodeURIComponent(window.location.hostname || "bitlancetechhub.com") +
    "&embed_type=inline&hide_landing_page_details=1&hide_gdpr_banner=1";

  return (
    <div
      style={{
        ...styles.calOverlay,
        transform: visible ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <div style={styles.calHeader}>
        <span style={styles.calHeaderTitle}>📅 Book Your Free Strategy Call</span>
        <button style={styles.calBackBtn} onClick={onClose}>
          ← Back
        </button>
      </div>

      {!iframeLoaded && (
        <div style={styles.calLoading}>
          <div style={styles.calSpinner} />
          <p style={{ color: "#7B78A0", fontSize: "0.85rem" }}>Loading calendar...</p>
        </div>
      )}

      <iframe
        src={embedUrl}
        style={{ ...styles.calIframe, opacity: iframeLoaded ? 1 : 0 }}
        onLoad={() => setIframeLoaded(true)}
        title="Book a call"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📋  CONTACT FORM
// ─────────────────────────────────────────────────────────────────────────────
interface ContactFormProps {
  onSubmit: (info: ContactInfo) => void;
}

function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function handleSubmit() {
    const e: Record<string, boolean> = {};
    if (!name.trim()) e.name = true;
    if (!email.trim()) e.email = true;
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  }

  return (
    <div style={styles.contactForm}>
      <input
        style={{ ...styles.cfInput, ...(errors.name ? styles.cfInputError : {}) }}
        placeholder="Your full name *"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((p) => ({ ...p, name: false }));
        }}
      />
      <input
        style={{ ...styles.cfInput, ...(errors.email ? styles.cfInputError : {}) }}
        placeholder="Email address *"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((p) => ({ ...p, email: false }));
        }}
      />
      <input
        style={styles.cfInput}
        placeholder="WhatsApp number (e.g. +91...)"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button style={styles.cfBtn} onClick={handleSubmit}>
        🚀 Book My Free Strategy Call
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔘  OPTION BUTTONS
// ─────────────────────────────────────────────────────────────────────────────
interface OptionButtonsProps {
  buttons: ButtonOption[];
  isMulti: boolean;
  confirmLabel?: string;
  onSingle: (btn: ButtonOption) => void;
  onMultiConfirm: (values: string[]) => void;
}

function OptionButtons({ buttons, isMulti, confirmLabel, onSingle, onMultiConfirm }: OptionButtonsProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function toggle(value: string) {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function confirmMulti() {
    if (!checked.length) return;
    setDone(true);
    onMultiConfirm(checked);
  }

  function clickSingle(btn: ButtonOption) {
    if (done) return;
    setDone(true);
    onSingle(btn);
  }

  return (
    <div style={styles.optionWrap}>
      {buttons.map((btn) => {
        const isChecked = checked.includes(btn.value);
        return (
          <button
            key={btn.value}
            disabled={done && !isMulti}
            style={{
              ...styles.optBtn,
              ...(isMulti ? styles.optBtnMulti : styles.optBtnSingle),
              ...(isChecked ? styles.optBtnChecked : {}),
            }}
            onClick={() => (isMulti ? toggle(btn.value) : clickSingle(btn))}
          >
            <span>{btn.label}</span>
            {isMulti && (
              <span
                style={{
                  ...styles.checkbox,
                  ...(isChecked ? styles.checkboxChecked : {}),
                }}
              >
                {isChecked && "✓"}
              </span>
            )}
          </button>
        );
      })}

      {isMulti && (
        <button
          style={{
            ...styles.confirmBtn,
            ...(checked.length > 0 && !done ? styles.confirmBtnActive : {}),
          }}
          onClick={confirmMulti}
          disabled={checked.length === 0 || done}
        >
          {done
            ? "✓ Submitted"
            : checked.length > 0
            ? `✅ Continue with ${checked.length} selected`
            : confirmLabel || "✅ Continue"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📅  CALENDLY CTA CARD
// ─────────────────────────────────────────────────────────────────────────────
interface CalendlyCTACardProps {
  url: string;
  message?: string;
  onOpen: (url: string) => void;
}

function CalendlyCTACard({ url, message, onOpen }: CalendlyCTACardProps) {
  return (
    <div style={styles.ctaCard}>
      <p style={styles.ctaMsg}>
        {message || "Pick a time that works for you — it's completely free!"}
      </p>
      <button style={styles.ctaBtn} onClick={() => onOpen(url)}>
        📅 Schedule My Free Call
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅  BOOKING CONFIRMED CARD
// ─────────────────────────────────────────────────────────────────────────────
function BookingConfirmedCard({ email }: { email: string }) {
  return (
    <div style={styles.bcCard}>
      <div style={styles.bcIcon}>🎉</div>
      <div style={styles.bcTitle}>Meeting Confirmed!</div>
      <div style={styles.bcSub}>
        Confirmation sent to
        <br />
        <strong style={{ color: "#F0EEF8" }}>{email || "your email"}</strong>
      </div>
      <a
        href="https://www.bitlancetechhub.com"
        target="_blank"
        rel="noreferrer"
        style={styles.bcLink}
      >
        Visit Our Website →
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🤖  MAIN CHATBOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface BitlanceChatbotProps {
  isOpen?: boolean;
  onToggle?: (next: boolean) => void;
}

export default function BitlanceChatbot({ isOpen: externalIsOpen, onToggle }: BitlanceChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const setIsOpen = (next: boolean) => {
    if (onToggle) onToggle(next);
    setInternalIsOpen(next);
  };

  const [hasOpened, setHasOpened] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showNotif, setShowNotif] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [calUrl, setCalUrl] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const convoStartedRef = useRef(false);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [sessionData, setSessionData] = useState<SessionData>({
    selectedServices: [],
    selectedRole: "",
    selectedBudget: "",
    selectedTimeline: "",
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    phone: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef("session_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (confetti) setTimeout(() => setConfetti(false), 1600);
  }, [confetti]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasOpened) {
        setHasOpened(true);
        setShowNotif(false);
        setIsOpen(true);
        setTimeout(startConversation, 400);
      }
    }, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpened, isOpen]);

  const addMsg = useCallback((msg: MessageType) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateProgress = useCallback((step: string) => {
    setProgress(PROGRESS_MAP[step] || 0);
  }, []);

  function toggleWidget() {
    const next = !isOpen;
    setIsOpen(next);
    if (next && !hasOpened) {
      setHasOpened(true);
      setShowNotif(false);
      setTimeout(startConversation, 400);
    }
  }

  function startConversation() {
    if (convoStartedRef.current) return;
    convoStartedRef.current = true;
    sendToWebhook({ step: "welcome", message: "hi", sessionId: sessionId.current });
  }

  async function sendToWebhook(payload: WebhookPayload) {
    setIsTyping(true);
    updateProgress(payload.step);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setIsTyping(false);
      if (!res.ok) throw new Error("HTTP " + res.status);
      handleResponse(await res.json() as WebhookResponse);
    } catch (err) {
      setIsTyping(false);
      console.warn("Webhook failed, using local fallback:", err);
      handleLocalFallback(payload);
    }
  }

  function handleResponse(data: WebhookResponse) {
    const nextStep = data.nextStep || currentStep;
    setCurrentStep(nextStep);

    setSessionData((prev) => ({
      ...prev,
      ...(data.selectedServices ? { selectedServices: data.selectedServices } : {}),
      ...(data.selectedRole ? { selectedRole: data.selectedRole } : {}),
      ...(data.selectedBudget ? { selectedBudget: data.selectedBudget } : {}),
      ...(data.selectedTimeline ? { selectedTimeline: data.selectedTimeline } : {}),
    }));

    updateProgress(nextStep);

    if (data.response) addMsg({ type: "bot", text: data.response });

    if (data.buttons?.length) {
      setTimeout(
        () =>
          addMsg({
            type: "buttons",
            buttons: data.buttons!,
            isMulti: data.multiSelect || false,
            confirmLabel: data.confirmButtonLabel,
            id: Date.now(),
          }),
        300
      );
    }

    if (data.showContactForm) setTimeout(() => addMsg({ type: "contactForm" }), 400);

    if (data.showCalendly)
      setTimeout(
        () =>
          addMsg({
            type: "calendlyCTA",
            url: data.calendlyUrl || CALENDLY_URL,
            message: data.calendlyMessage,
          }),
        400
      );
  }

  function handleLocalFallback(payload: WebhookPayload) {
    const flow = LOCAL_FLOWS[payload.step];
    if (!flow) return;

    setCurrentStep(flow.nextStep);
    updateProgress(flow.nextStep);

    const responseText =
      payload.step === "contact"
        ? `Hi **${payload.name || "there"}**! 🙌 You're all set!\n\nClick below to pick a time — our team will show you a live demo and outline a custom solution.`
        : flow.response;

    addMsg({ type: "bot", text: responseText });

    if (flow.buttons) {
      setTimeout(
        () =>
          addMsg({
            type: "buttons",
            buttons: flow.buttons!,
            isMulti: flow.multiSelect || false,
            confirmLabel: flow.confirmButtonLabel,
            id: Date.now(),
          }),
        300
      );
    }
    if (flow.showContactForm) setTimeout(() => addMsg({ type: "contactForm" }), 400);
    if (flow.showCalendly)
      setTimeout(
        () =>
          addMsg({
            type: "calendlyCTA",
            url: CALENDLY_URL,
          }),
        400
      );
  }

  function handleSingleClick(btn: ButtonOption) {
    addMsg({ type: "user", text: btn.label });
    const updatedSession: SessionData = {
      ...sessionData,
      ...(btn.step === "role" ? { selectedRole: btn.value } : {}),
      ...(btn.step === "budget" ? { selectedBudget: btn.value } : {}),
      ...(btn.step === "timeline" ? { selectedTimeline: btn.value } : {}),
    };
    setSessionData(updatedSession);
    sendToWebhook({
      step: btn.step,
      buttonValue: btn.value,
      sessionId: sessionId.current,
      ...updatedSession,
      ...contactInfo,
    });
  }

  function handleMultiConfirm(selectedValues: string[]) {
    const labelMap: Record<string, string> = {
      ai_voice_bot: "🎙️ AI Voice Bot",
      ai_chatbot: "🤖 AI Chatbot",
      workflow_automation: "⚙️ Workflow Automation",
      crm_integration: "📊 CRM Integration",
      web_development: "🌐 Web / App Dev",
      ai_marketing: "📣 AI Marketing",
    };
    const summary = selectedValues.map((v) => labelMap[v] || v).join(", ");
    addMsg({ type: "user", text: summary });

    const updatedSession: SessionData = { ...sessionData, selectedServices: selectedValues };
    setSessionData(updatedSession);

    sendToWebhook({
      step: "service",
      selectedServices: selectedValues,
      sessionId: sessionId.current,
      ...updatedSession,
      ...contactInfo,
    });
  }

  function handleContactSubmit(info: ContactInfo) {
    setContactInfo(info);
    addMsg({ type: "user", text: `📧 ${info.email}` });
    sendToWebhook({
      step: "contact",
      sessionId: sessionId.current,
      ...info,
      ...sessionData,
    });
  }

  function openCalendly(url: string) {
    setCalUrl(url);
  }

  function closeCalendly() {
    setCalUrl(null);
  }

  const handleBooked = useCallback(
    (_payload: Record<string, unknown>) => {
      closeCalendly();
      setProgress(100);
      setCurrentStep("booked");
      const name = contactInfo.name || "there";

      setTimeout(() => {
        addMsg({
          type: "bot",
          text: `✅ **Meeting Booked! You're all set, ${name}!**\n\nOur team at **Bitlance TechHub** is excited to speak with you. Check your email and WhatsApp for the confirmation & meeting link.`,
        });
      }, 200);

      setTimeout(() => {
        addMsg({ type: "bookingConfirmed", email: contactInfo.email });
        setConfetti(true);
      }, 800);
    },
    [contactInfo, addMsg]
  );

  function sendText() {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    addMsg({ type: "user", text });
    sendToWebhook({
      step: currentStep,
      message: text,
      sessionId: sessionId.current,
      ...sessionData,
      ...contactInfo,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🖼️  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        :root {
          --cb-bubble-bottom: 28px;
          --cb-bubble-right: 28px;
          --cb-widget-bottom: 104px;
          --cb-widget-right: 28px;
          --cb-widget-width: 390px;
          --cb-widget-max-height: 625px;
        }
        @media (max-width: 480px) {
          :root {
            --cb-bubble-bottom: 20px;
            --cb-bubble-right: 20px;
            --cb-widget-bottom: 85px;
            --cb-widget-right: 15px;
            --cb-widget-width: calc(100% - 30px);
            --cb-widget-max-height: calc(100svh - 105px);
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes bubbleIn   { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes pulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes msgIn      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce     { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes popIn      { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes confettiFall{ 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(180px) rotate(360deg);opacity:0} }
        .msg-anim   { animation: msgIn 0.35s cubic-bezier(0.34,1.3,0.64,1) both; }
        .btns-anim  { animation: msgIn 0.4s 0.1s cubic-bezier(0.34,1.3,0.64,1) both; }
        .bc-icon-anim { animation: popIn 0.5s 0.1s cubic-bezier(0.34,1.6,0.64,1) both; }
      `}</style>

      {/* ── BUBBLE BUTTON ── */}
      <button
        onClick={toggleWidget}
        aria-label="Open chat"
        style={{
          ...styles.bubble,
          animation: "bubbleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {showNotif && <div style={styles.notifDot} />}

        <svg
          style={{
            ...styles.bubbleIcon,
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "scale(0.5) rotate(90deg)" : "scale(1)",
            transition: "all 0.3s",
          }}
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
          style={{
            ...styles.bubbleIcon,
            position: "absolute",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0.5) rotate(-90deg)",
            transition: "all 0.3s",
          }}
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

      {/* ── CHAT WIDGET ── */}
      <div
        style={{
          ...styles.widget,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
        }}
      >
        <Confetti active={confetti} />

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerAvatar}>🤖</div>
          <div style={styles.headerInfo}>
            <strong style={styles.headerName}>Bitlance TechHub</strong>
            <span style={styles.headerSub}>
              <span style={styles.onlineDot} /> AI Assistant · Replies instantly
            </span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={styles.progressBg}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* MESSAGE LIST */}
        <div style={styles.messages}>
          {messages.map((msg, i) => {
            if (msg.type === "bot")
              return (
                <div key={i} className="msg-anim" style={styles.msgRow}>
                  <div style={styles.botAvatar}>🤖</div>
                  <div style={styles.botBubble}>
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              );

            if (msg.type === "user")
              return (
                <div key={i} className="msg-anim" style={styles.userRow}>
                  <div style={styles.userBubble}>{msg.text}</div>
                </div>
              );

            if (msg.type === "buttons")
              return (
                <div key={msg.id} className="btns-anim">
                  <OptionButtons
                    buttons={msg.buttons}
                    isMulti={msg.isMulti}
                    confirmLabel={msg.confirmLabel}
                    onSingle={handleSingleClick}
                    onMultiConfirm={handleMultiConfirm}
                  />
                </div>
              );

            if (msg.type === "contactForm")
              return (
                <div key={i} className="msg-anim">
                  <ContactForm onSubmit={handleContactSubmit} />
                </div>
              );

            if (msg.type === "calendlyCTA")
              return (
                <div key={i} className="msg-anim">
                  <CalendlyCTACard
                    url={msg.url}
                    message={msg.message}
                    onOpen={openCalendly}
                  />
                </div>
              );

            if (msg.type === "bookingConfirmed")
              return (
                <div key={i} className="msg-anim">
                  <BookingConfirmedCard email={msg.email} />
                </div>
              );

            return null;
          })}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <input
            style={styles.footerInput}
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
          />
          <button style={styles.sendBtn} onClick={sendText} aria-label="Send">
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
        <div style={styles.poweredBy}>
          Powered by Bitlance TechHub · AI Lead Qualifier
        </div>

        {calUrl && (
          <CalendlyOverlay
            url={calUrl}
            onClose={closeCalendly}
            onBooked={handleBooked}
          />
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎨  STYLES
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  brand: "#5B4FE8",
  brandDark: "#3D31CC",
  brandGlow: "rgba(91,79,232,0.35)",
  accent: "#00E5A0",
  bg: "#0C0B14",
  surface: "#141220",
  surface2: "#1D1A2F",
  border: "rgba(255,255,255,0.07)",
  text: "#F0EEF8",
  muted: "#7B78A0",
} as const;

const styles: Record<string, CSSProperties> = {
  bubble: {
    position: "fixed",
    bottom: "var(--cb-bubble-bottom)" as unknown as number,
    right: "var(--cb-bubble-right)" as unknown as number,
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.brand}, ${C.brandDark})`,
    boxShadow: `0 8px 32px ${C.brandGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    border: "none",
  },
  bubbleIcon: { display: "flex", alignItems: "center", justifyContent: "center" },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    background: C.accent,
    borderRadius: "50%",
    border: `2px solid ${C.bg}`,
    animation: "pulse 1.8s infinite",
  },
  widget: {
    position: "fixed",
    bottom: "var(--cb-widget-bottom)" as unknown as number,
    right: "var(--cb-widget-right)" as unknown as number,
    width: "var(--cb-widget-width)" as unknown as number,
    maxHeight: "var(--cb-widget-max-height)" as unknown as number,
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,79,232,0.1)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9998,
    overflow: "hidden",
    transition: "transform 0.35s cubic-bezier(0.34,1.3,0.64,1), opacity 0.25s ease",
  },
  header: {
    background: `linear-gradient(135deg, ${C.brandDark} 0%, ${C.brand} 100%)`,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    border: "2px solid rgba(255,255,255,0.2)",
  },
  headerInfo: { flex: 1 },
  headerName: {
    fontFamily: "Syne, sans-serif",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#fff",
    display: "block",
  },
  headerSub: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    background: C.accent,
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  progressBg: { height: 3, background: "rgba(255,255,255,0.1)", flexShrink: 0 },
  progressFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${C.accent}, #00c87a)`,
    transition: "width 0.6s ease",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 16px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  msgRow: { display: "flex", gap: 8, alignItems: "flex-end" },
  userRow: { display: "flex", flexDirection: "row-reverse", gap: 8, alignItems: "flex-end" },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: `linear-gradient(135deg,${C.brand},${C.brandDark})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    flexShrink: 0,
  },
  botBubble: {
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    background: C.surface2,
    border: `1px solid ${C.border}`,
    fontSize: "0.875rem",
    lineHeight: 1.55,
    color: C.text,
    fontFamily: "DM Sans, sans-serif",
  },
  userBubble: {
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    background: `linear-gradient(135deg,${C.brand},${C.brandDark})`,
    fontSize: "0.875rem",
    lineHeight: 1.55,
    color: "#fff",
    fontFamily: "DM Sans, sans-serif",
  },
  typingDots: {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: "12px 16px",
    display: "flex",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: C.muted,
    display: "inline-block",
    animation: "bounce 1.2s infinite",
  },
  optionWrap: { display: "flex", flexDirection: "column", gap: 6 },
  optBtn: {
    background: "transparent",
    border: `1px solid rgba(91,79,232,0.35)`,
    color: "#c4c0f0",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.83rem",
    padding: "9px 14px",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    transition: "all 0.15s",
  },
  optBtnSingle: {},
  optBtnMulti: { paddingRight: 40 },
  optBtnChecked: {
    background: "rgba(91,79,232,0.2)",
    borderColor: C.brand,
    color: "#fff",
  },
  checkbox: {
    width: 18,
    height: 18,
    border: `2px solid rgba(91,79,232,0.5)`,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    color: "#fff",
    flexShrink: 0,
  },
  checkboxChecked: { background: C.brand, borderColor: C.brand },
  confirmBtn: {
    marginTop: 4,
    background: `linear-gradient(135deg,${C.brand},${C.brandDark})`,
    color: "#fff",
    fontFamily: "Syne, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    padding: "11px 18px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
    opacity: 0.4,
    pointerEvents: "none",
    letterSpacing: "0.02em",
  },
  confirmBtnActive: { opacity: 1, pointerEvents: "all" },
  contactForm: {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  cfInput: {
    background: C.bg,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.85rem",
    padding: "9px 12px",
    borderRadius: 9,
    outline: "none",
    width: "100%",
  },
  cfInputError: { borderColor: "#ff6b6b" },
  cfBtn: {
    background: `linear-gradient(135deg,${C.brand},${C.brandDark})`,
    color: "#fff",
    fontFamily: "Syne, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    padding: 10,
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  ctaCard: {
    background: `linear-gradient(135deg,rgba(0,229,160,0.1),rgba(91,79,232,0.15))`,
    border: `1px solid rgba(0,229,160,0.3)`,
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
  },
  ctaMsg: {
    fontSize: "0.82rem",
    color: C.muted,
    marginBottom: 11,
    lineHeight: 1.5,
    fontFamily: "DM Sans, sans-serif",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: `linear-gradient(135deg,${C.accent},#00c87a)`,
    color: C.bg,
    fontFamily: "Syne, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    padding: "11px 22px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,229,160,0.3)",
    letterSpacing: "0.02em",
  },
  calOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    background: C.surface,
    display: "flex",
    flexDirection: "column",
    borderRadius: 18,
    overflow: "hidden",
    transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
  },
  calHeader: {
    background: `linear-gradient(135deg,${C.brandDark},${C.brand})`,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  calHeaderTitle: {
    fontFamily: "Syne, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#fff",
  },
  calBackBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 999,
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
  },
  calLoading: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    position: "absolute",
    inset: "56px 0 0 0" as unknown as number,
  },
  calSpinner: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `3px solid ${C.border}`,
    borderTopColor: C.brand,
    animation: "spin 0.8s linear infinite",
  },
  calIframe: {
    flex: 1,
    width: "100%",
    border: "none",
    background: "#fff",
    minHeight: 0,
    transition: "opacity 0.3s",
  },
  bcCard: {
    background:
      "linear-gradient(135deg,rgba(0,229,160,0.12),rgba(91,79,232,0.18))",
    border: "1px solid rgba(0,229,160,0.35)",
    borderRadius: 16,
    padding: "22px 18px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  bcIcon: { fontSize: "2.2rem" },
  bcTitle: {
    fontFamily: "Syne, sans-serif",
    fontSize: "1.1rem",
    fontWeight: 800,
    color: C.accent,
  },
  bcSub: {
    fontSize: "0.82rem",
    color: C.muted,
    lineHeight: 1.5,
    fontFamily: "DM Sans, sans-serif",
  },
  bcLink: {
    marginTop: 6,
    display: "inline-block",
    border: "1px solid rgba(91,79,232,0.5)",
    color: "#a89fff",
    fontFamily: "Syne, sans-serif",
    fontSize: "0.8rem",
    fontWeight: 600,
    padding: "8px 18px",
    borderRadius: 999,
    textDecoration: "none",
  },
  footer: {
    padding: "12px 14px",
    borderTop: `1px solid ${C.border}`,
    background: C.surface,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  footerInput: {
    flex: 1,
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 999,
    padding: "9px 16px",
    color: C.text,
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.85rem",
    outline: "none",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: C.brand,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  poweredBy: {
    textAlign: "center",
    fontSize: "0.68rem",
    color: C.muted,
    padding: "5px 0 8px",
    opacity: 0.6,
    letterSpacing: "0.03em",
    fontFamily: "DM Sans, sans-serif",
  },
};