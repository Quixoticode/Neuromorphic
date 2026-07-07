import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Check, ChevronLeft,
  Mail, Lock, User, Shield, Smartphone, Bell, Fingerprint,
  LogOut, Zap, Activity, Database,
} from "lucide-react";

// ─── Theme ──────────────────────────────────────────────────────────────────
const T = {
  bg:      "#020407",
  bg2:     "#07101a",
  surface: "#0c1624",
  border:  "rgba(255,255,255,0.07)",
  primary: "#00E5FF",
  secondary:"#FFB300",
  accent:  "#7B4FFF",
  success: "#00FF88",
  error:   "#FF4060",
  text:    "#E8F4FF",
  muted:   "#4A6080",
};

// ─── Global Styles ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=JetBrains+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .sso-wrap {
      font-family: 'DM Sans', sans-serif;
      background: ${T.bg};
      color: ${T.text};
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: env(safe-area-inset-top, 24px) env(safe-area-inset-right, 16px) env(safe-area-inset-bottom, 24px) env(safe-area-inset-left, 16px);
      overflow-x: hidden;
      overflow-y: auto;
    }

    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono    { font-family: 'JetBrains Mono', monospace; }

    @keyframes blobMorph {
      0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
      25%  { border-radius: 70% 30% 40% 60% / 60% 40% 70% 40%; }
      50%  { border-radius: 30% 70% 60% 40% / 50% 70% 30% 60%; }
      75%  { border-radius: 60% 40% 30% 70% / 30% 60% 40% 70%; }
      100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    }

    @keyframes liqRipple {
      0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
      100% { transform: translate(-50%,-50%) scale(7); opacity: 0; }
    }

    .liq-ripple {
      position: absolute;
      width: 70px; height: 70px;
      border-radius: 50%;
      pointer-events: none;
      animation: liqRipple 0.75s ease-out forwards;
    }

    /* kill iOS autofill yellow */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: ${T.text};
      -webkit-box-shadow: 0 0 0 1000px ${T.bg2} inset;
      transition: background-color 5000s;
    }

    /* hide number spinners */
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  `}</style>
);

// ─── Liquid Button ───────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
interface LiqBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}
const variantBg: Record<BtnVariant, string> = {
  primary:   T.primary,
  secondary: T.secondary,
  accent:    T.accent,
  ghost:     "transparent",
  danger:    T.error,
};

const LiquidButton = ({ children, onClick, variant = "primary", fullWidth, type = "button", disabled, size = "md" }: LiqBtnProps) => {
  const [ripples, setRipples] = useState<{id:number;x:number;y:number}[]>([]);
  const [down, setDown] = useState(false);

  const fire = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setDown(true);
    setTimeout(() => { setRipples(p => p.filter(x => x.id !== id)); }, 760);
    setTimeout(() => setDown(false), 140);
    onClick?.();
  };

  const bg   = variantBg[variant];
  const isGhost = variant === "ghost";
  const pad  = { sm:"8px 18px", md:"13px 28px", lg:"18px 44px" }[size];
  const fz   = { sm:"13px", md:"15px", lg:"17px" }[size];
  const h    = { sm:"40px", md:"52px", lg:"64px" }[size];
  const textColor = isGhost ? T.muted : (variant === "primary" ? T.bg : "#fff");

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onPointerDown={fire}
      animate={{ scale: down ? 0.962 : 1 }}
      whileHover={!disabled ? { scale: 1.018 } : {}}
      transition={{ type:"spring", stiffness:500, damping:28 }}
      style={{
        position:"relative", overflow:"hidden",
        borderRadius:"14px",
        border: isGhost ? `1px solid ${T.border}` : "none",
        background: isGhost ? "rgba(255,255,255,0.03)" : `linear-gradient(130deg, ${bg}ee 0%, ${bg}99 100%)`,
        color: textColor,
        fontFamily:"'Space Grotesk', sans-serif",
        fontWeight:600, fontSize:fz, letterSpacing:"0.02em",
        padding:pad, height:h,
        width: fullWidth ? "100%" : "auto",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        boxShadow: isGhost ? "none" : `0 0 22px ${bg}28, 0 2px 12px ${bg}18`,
        transition:"box-shadow 0.3s",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      {ripples.map(rp => (
        <span
          key={rp.id}
          className="liq-ripple"
          style={{
            left: rp.x, top: rp.y,
            background: `radial-gradient(circle, ${bg}55 0%, transparent 70%)`,
          }}
        />
      ))}
      <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
        {children}
      </span>
    </motion.button>
  );
};

// ─── Spinner (reused) ────────────────────────────────────────────────────────
const Spinner = ({ color = T.bg }: { color?: string }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration:1, repeat:Infinity, ease:"linear" }}
    style={{ width:18, height:18, borderRadius:"50%", border:`2.5px solid ${color}30`, borderTop:`2.5px solid ${color}` }}
  />
);

// ─── Liquid Input ────────────────────────────────────────────────────────────
interface LiqInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ComponentType<any>;
  iconRight?: React.ReactNode;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}
const LiquidInput = ({ label, type="text", value, onChange, icon:Icon, iconRight, placeholder, error, autoComplete }: LiqInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      {label && (
        <label style={{
          display:"block", fontSize:"11px", fontWeight:700,
          letterSpacing:"0.1em", textTransform:"uppercase",
          color: focused ? T.primary : T.muted,
          marginBottom:"8px",
          fontFamily:"'Space Grotesk', sans-serif",
          transition:"color 0.3s",
        }}>{label}</label>
      )}
      <div style={{ position:"relative" }}>
        {Icon && (
          <div style={{
            position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)",
            color: focused ? T.primary : T.muted,
            transition:"color 0.3s", pointerEvents:"none", zIndex:1,
            display:"flex", alignItems:"center",
          }}>
            <Icon size={17} strokeWidth={1.6} />
          </div>
        )}
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:"100%",
            background: T.bg2,
            border:`1.5px solid ${focused ? T.primary+"66" : error ? T.error+"50" : T.border}`,
            borderRadius:"13px",
            color: T.text, fontSize:"15px",
            fontFamily:"'DM Sans', sans-serif",
            padding: Icon ? "14px 44px 14px 46px" : "14px 16px",
            paddingRight: iconRight ? "46px" : undefined,
            outline:"none",
            WebkitAppearance:"none",
            transition:"border-color 0.25s, box-shadow 0.25s",
            boxShadow: focused
              ? `0 0 0 3px ${T.primary}14, 0 1px 18px ${T.primary}0a`
              : error ? `0 0 0 3px ${T.error}12` : "none",
          }}
        />
        {iconRight && (
          <div style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", zIndex:1, display:"flex" }}>
            {iconRight}
          </div>
        )}
        {/* liquid flow line */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", pointerEvents:"none", borderRadius:"0 0 13px 13px", overflow:"hidden" }}>
          <motion.div
            animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
            initial={{ scaleX:0, opacity:0 }}
            transition={{ duration:0.35, ease:[0.4,0,0.2,1] }}
            style={{
              position:"absolute", inset:0,
              background:`linear-gradient(90deg, ${T.primary}, ${T.accent})`,
              transformOrigin:"left",
              filter:`drop-shadow(0 0 5px ${T.primary})`,
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ color:T.error, fontSize:"11.5px", marginTop:"5px" }}
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Liquid Toggle ───────────────────────────────────────────────────────────
const LiquidToggle = ({ checked, onChange, label }: { checked:boolean; onChange:(v:boolean)=>void; label?:string }) => (
  <button onClick={() => onChange(!checked)} style={{ display:"flex", alignItems:"center", gap:"10px", background:"none", border:"none", cursor:"pointer", padding:0 }}>
    <div style={{
      position:"relative", width:"46px", height:"26px", borderRadius:"13px",
      background: checked ? `${T.primary}25` : T.bg2,
      border:`1px solid ${checked ? T.primary+"55" : T.border}`,
      transition:"all 0.3s",
      boxShadow: checked ? `0 0 14px ${T.primary}28` : "none",
    }}>
      <motion.div
        animate={{ x: checked ? 21 : 2 }}
        transition={{ type:"spring", stiffness:600, damping:32 }}
        style={{
          position:"absolute", top:"3px",
          width:"18px", height:"18px", borderRadius:"50%",
          background: checked ? T.primary : T.muted,
          boxShadow: checked ? `0 0 8px ${T.primary}` : "none",
        }}
      />
    </div>
    {label && <span style={{ color:T.muted, fontSize:"13px", fontFamily:"'DM Sans', sans-serif" }}>{label}</span>}
  </button>
);

// ─── Liquid Checkbox ─────────────────────────────────────────────────────────
const LiquidCheckbox = ({ checked, onChange, children }: { checked:boolean; onChange:(v:boolean)=>void; children:React.ReactNode }) => (
  <button onClick={() => onChange(!checked)} style={{ display:"flex", alignItems:"flex-start", gap:"10px", background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>
    <div style={{
      flexShrink:0, width:"20px", height:"20px", borderRadius:"6px", marginTop:"2px",
      border:`1.5px solid ${checked ? T.primary : T.muted+"55"}`,
      background: checked ? `${T.primary}18` : "transparent",
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"all 0.25s",
      boxShadow: checked ? `0 0 12px ${T.primary}28` : "none",
    }}>
      <motion.div initial={{ scale:0 }} animate={{ scale: checked ? 1 : 0 }} transition={{ type:"spring", stiffness:600, damping:22 }}>
        <Check size={11} color={T.primary} strokeWidth={3} />
      </motion.div>
    </div>
    <span style={{ color:T.muted, fontSize:"13px", lineHeight:1.55 }}>{children}</span>
  </button>
);

// ─── Password Strength Bar ───────────────────────────────────────────────────
const StrengthBar = ({ password }: { password:string }) => {
  const s = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[^a-zA-Z0-9]/.test(password) ? 4 : 3;
  const cols = ["", T.error, T.secondary, T.secondary, T.success];
  const labs = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop:"8px" }}>
      <div style={{ display:"flex", gap:"5px", marginBottom:"5px" }}>
        {[1,2,3,4].map(i => (
          <motion.div key={i}
            animate={{ scaleX: s >= i ? 1 : 0, backgroundColor: cols[s] }}
            initial={{ scaleX:0 }}
            transition={{ duration:0.3, delay: i * 0.05 }}
            style={{ flex:1, height:"3px", borderRadius:"2px", transformOrigin:"left", background:T.border }}
          />
        ))}
      </div>
      <p style={{ fontSize:"11px", color:cols[s] }}>{labs[s]}</p>
    </div>
  );
};

// ─── OTP Input ───────────────────────────────────────────────────────────────
const OTPInput = ({ value, onChange }: { value:string; onChange:(v:string)=>void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const LEN = 6;
  return (
    <div style={{ position:"relative" }}>
      <div style={{ display:"flex", gap:"10px", justifyContent:"center" }} onClick={() => inputRef.current?.focus()}>
        {Array.from({ length:LEN }).map((_, i) => {
          const digit = value[i] ?? "";
          const isActive = value.length === i;
          return (
            <motion.div key={i}
              animate={{ scale: isActive ? 1.07 : 1 }}
              style={{
                width:"52px", height:"60px", borderRadius:"13px",
                border:`1.5px solid ${digit ? T.primary+"99" : isActive ? T.primary+"44" : T.border}`,
                background: digit ? `${T.primary}0d` : T.bg2,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"22px", fontFamily:"'JetBrains Mono', monospace", fontWeight:700, color:T.text,
                cursor:"text", position:"relative", overflow:"hidden",
                boxShadow: digit ? `0 0 18px ${T.primary}1a` : "none",
                transition:"border-color 0.2s, background 0.2s",
              }}
            >
              {digit ? (
                <motion.span key={i + digit} initial={{ y:-16, opacity:0 }} animate={{ y:0, opacity:1 }} style={{ position:"absolute" }}>
                  {digit}
                </motion.span>
              ) : isActive ? (
                <motion.div animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:0.85 }}
                  style={{ width:"2px", height:"22px", background:T.primary, borderRadius:"2px" }} />
              ) : null}
            </motion.div>
          );
        })}
      </div>
      <input
        ref={inputRef}
        type="tel" inputMode="numeric" pattern="[0-9]*"
        maxLength={LEN} value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, LEN))}
        style={{ position:"absolute", opacity:0, pointerEvents:"none", width:0, height:0, top:0, left:0 }}
        autoFocus
      />
    </div>
  );
};

// ─── Background blobs ────────────────────────────────────────────────────────
type BlobCfg = { color:string; size:number; cx:string; cy:string; dur:number; delay:number };
const BlobLayer = ({ blobs }: { blobs:BlobCfg[] }) => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
    <AnimatePresence>
      {blobs.map((b, i) => (
        <motion.div key={b.color+i}
          initial={{ opacity:0, scale:0.75 }}
          animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0, scale:0.75 }}
          transition={{ duration:1.4, ease:[0.4,0,0.2,1] }}
          style={{
            position:"absolute",
            width:b.size, height:b.size,
            left:b.cx, top:b.cy,
            transform:"translate(-50%,-50%)",
            background:b.color,
            filter:`blur(${Math.round(b.size * 0.19)}px)`,
            animation:`blobMorph ${b.dur}s ease-in-out infinite`,
            animationDelay:`${b.delay}s`,
            mixBlendMode:"screen",
          }}
        />
      ))}
    </AnimatePresence>
  </div>
);

// ─── Page Transition ─────────────────────────────────────────────────────────
const pv = {
  initial: { opacity:0, y:18, filter:"blur(5px)" },
  animate: { opacity:1, y:0,  filter:"blur(0px)" },
  exit:    { opacity:0, y:-18, filter:"blur(5px)" },
};
const pt = { duration:0.38, ease:[0.4,0,0.2,1] as any };

// ─── xSyna Logo ──────────────────────────────────────────────────────────────
const XSynaLogo = ({ size = 44 }: { size?:number }) => (
  <svg viewBox="0 0 100 100" style={{ width:size, height:size, display:"block" }}>
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={T.primary} />
        <stop offset="100%" stopColor={T.secondary} />
      </linearGradient>
    </defs>
    <path d="M18,18 Q50,50 82,82 M18,82 Q50,50 82,18" stroke="url(#lg1)" strokeWidth="7" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="50" r="9" fill={T.bg} stroke="url(#lg1)" strokeWidth="4.5" />
  </svg>
);

// ─── Section Heading ─────────────────────────────────────────────────────────
const Heading = ({ title, sub }: { title:string; sub:string }) => (
  <div style={{ marginBottom:"32px" }}>
    <h2 className="font-display" style={{ fontSize:"28px", fontWeight:700, lineHeight:1.15, marginBottom:"7px" }}>{title}</h2>
    <p style={{ color:T.muted, fontSize:"15px" }}>{sub}</p>
  </div>
);

// ─── Social button row ───────────────────────────────────────────────────────
const SocialRow = () => (
  <>
    <div style={{ display:"flex", alignItems:"center", gap:"14px", margin:"6px 0" }}>
      <div style={{ flex:1, height:"1px", background:T.border }} />
      <span style={{ color:T.muted, fontSize:"11.5px", letterSpacing:"0.05em" }}>or continue with</span>
      <div style={{ flex:1, height:"1px", background:T.border }} />
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
      {["Google","GitHub"].map(name => (
        <LiquidButton key={name} variant="ghost" fullWidth onClick={() => {}}>
          <span style={{ fontSize:"14px" }}>{name}</span>
        </LiquidButton>
      ))}
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────────────────
type Screen = "login" | "signup" | "verify" | "reset" | "profile";

const LoginScreen = ({ go }: { go:(s:Screen)=>void }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email || !pw) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); go("profile"); }, 1700);
  };

  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ width:"100%" }}>
      <Heading title="Welcome back" sub="Sign in to your xSyna account" />
      <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
        <LiquidInput label="Email" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@xsyna.ai" autoComplete="email" />
        <LiquidInput label="Password" type={showPw ? "text" : "password"} value={pw} onChange={setPw} icon={Lock} placeholder="••••••••" autoComplete="current-password"
          iconRight={
            <button onClick={() => setShowPw(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:0, display:"flex" }}>
              {showPw ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
            </button>
          }
        />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <LiquidToggle checked={remember} onChange={setRemember} label="Remember me" />
          <button onClick={() => go("reset")} style={{ background:"none", border:"none", cursor:"pointer", color:T.primary, fontSize:"13px", fontFamily:"'DM Sans', sans-serif" }}>
            Forgot password?
          </button>
        </div>
        <LiquidButton fullWidth onClick={submit} disabled={loading}>
          {loading ? <><Spinner />Signing in…</> : <><span>Sign In</span><ArrowRight size={17} /></>}
        </LiquidButton>
        <SocialRow />
      </div>
      <p style={{ textAlign:"center", marginTop:"28px", color:T.muted, fontSize:"14px" }}>
        No account?{" "}
        <button onClick={() => go("signup")} style={{ background:"none", border:"none", cursor:"pointer", color:T.primary, fontFamily:"'DM Sans', sans-serif", fontSize:"14px", fontWeight:600 }}>
          Sign up free
        </button>
      </p>
    </motion.div>
  );
};

// ─── Sign Up ─────────────────────────────────────────────────────────────────
const SignupScreen = ({ go }: { go:(s:Screen)=>void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!agreed || !name || !email || !pw) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); go("verify"); }, 1700);
  };

  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ width:"100%" }}>
      <Heading title="Create account" sub="Join the neural network" />
      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
        <LiquidInput label="Full name" type="text" value={name} onChange={setName} icon={User} placeholder="Ada Lovelace" autoComplete="name" />
        <LiquidInput label="Email" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@xsyna.ai" autoComplete="email" />
        <div>
          <LiquidInput label="Password" type={showPw ? "text" : "password"} value={pw} onChange={setPw} icon={Lock} placeholder="Min. 8 characters" autoComplete="new-password"
            iconRight={
              <button onClick={() => setShowPw(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:0, display:"flex" }}>
                {showPw ? <EyeOff size={17} strokeWidth={1.6} /> : <Eye size={17} strokeWidth={1.6} />}
              </button>
            }
          />
          <StrengthBar password={pw} />
        </div>
        <LiquidCheckbox checked={agreed} onChange={setAgreed}>
          I agree to the{" "}<span style={{ color:T.primary }}>Terms of Service</span>{" "}and{" "}<span style={{ color:T.primary }}>Privacy Policy</span>
        </LiquidCheckbox>
        <LiquidButton fullWidth onClick={submit} disabled={loading || !agreed}>
          {loading ? <><Spinner />Creating account…</> : "Create Account"}
        </LiquidButton>
        <SocialRow />
      </div>
      <p style={{ textAlign:"center", marginTop:"28px", color:T.muted, fontSize:"14px" }}>
        Already have an account?{" "}
        <button onClick={() => go("login")} style={{ background:"none", border:"none", cursor:"pointer", color:T.primary, fontFamily:"'DM Sans', sans-serif", fontSize:"14px", fontWeight:600 }}>
          Sign in
        </button>
      </p>
    </motion.div>
  );
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
const VerifyScreen = ({ go }: { go:(s:Screen)=>void }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cd, setCd] = useState(30);

  useEffect(() => {
    if (cd <= 0) return;
    const t = setTimeout(() => setCd(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [cd]);

  const verify = () => {
    if (otp.length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); go("profile"); }, 1500);
  };

  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ width:"100%", textAlign:"center" }}>
      <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:300, damping:22 }}
        style={{ width:"68px", height:"68px", borderRadius:"22px", background:`${T.primary}12`, border:`1px solid ${T.primary}40`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
        <Smartphone size={30} color={T.primary} strokeWidth={1.5} />
      </motion.div>
      <Heading title="Verify your email" sub="Enter the 6-digit code we sent you" />
      <div style={{ marginBottom:"28px" }}>
        <OTPInput value={otp} onChange={setOtp} />
      </div>
      <LiquidButton fullWidth onClick={verify} disabled={loading || otp.length < 6}>
        {loading ? <><Spinner />Verifying…</> : "Verify Code"}
      </LiquidButton>
      <p style={{ marginTop:"22px", color:T.muted, fontSize:"13px" }}>
        {cd > 0
          ? <>Resend code in <span className="font-mono" style={{ color:T.primary }}>{cd}s</span></>
          : <button onClick={() => setCd(30)} style={{ background:"none", border:"none", cursor:"pointer", color:T.primary, fontSize:"13px", fontFamily:"'DM Sans', sans-serif" }}>Resend code</button>
        }
      </p>
      <button onClick={() => go("login")} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:"13px", fontFamily:"'DM Sans', sans-serif", margin:"16px auto 0" }}>
        <ChevronLeft size={15} />Back to login
      </button>
    </motion.div>
  );
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const ResetScreen = ({ go }: { go:(s:Screen)=>void }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ width:"100%" }}>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" variants={pv} initial="initial" animate="animate" exit="exit" transition={pt}>
            <div style={{ width:"68px", height:"68px", borderRadius:"22px", background:`${T.secondary}12`, border:`1px solid ${T.secondary}40`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px" }}>
              <Lock size={30} color={T.secondary} strokeWidth={1.5} />
            </div>
            <Heading title="Reset password" sub="We'll send you a link to reset it" />
            <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
              <LiquidInput label="Email" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@xsyna.ai" autoComplete="email" />
              <LiquidButton fullWidth variant="secondary" onClick={send} disabled={loading || !email}>
                {loading ? <><Spinner color="#000" />Sending…</> : "Send Reset Link"}
              </LiquidButton>
            </div>
            <button onClick={() => go("login")} style={{ display:"flex", alignItems:"center", gap:"5px", background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:"13px", fontFamily:"'DM Sans', sans-serif", marginTop:"24px" }}>
              <ChevronLeft size={15} />Back to login
            </button>
          </motion.div>
        ) : (
          <motion.div key="ok" variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ textAlign:"center", paddingTop:"16px" }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:300, damping:20, delay:0.1 }}
              style={{ width:"80px", height:"80px", borderRadius:"26px", background:`${T.success}12`, border:`1px solid ${T.success}50`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
              <Check size={38} color={T.success} strokeWidth={2.2} />
            </motion.div>
            <h2 className="font-display" style={{ fontSize:"26px", fontWeight:700, marginBottom:"10px" }}>Check your inbox</h2>
            <p style={{ color:T.muted, fontSize:"14px", lineHeight:1.7, marginBottom:"32px" }}>
              We sent a reset link to<br />
              <span style={{ color:T.text, fontWeight:500 }}>{email}</span>
            </p>
            <LiquidButton fullWidth variant="ghost" onClick={() => go("login")}>Back to Login</LiquidButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Profile ──────────────────────────────────────────────────────────────────
const ProfileScreen = ({ go }: { go:(s:Screen)=>void }) => {
  const [notifs, setNotifs] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [bio, setBio] = useState(true);

  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{ width:"100%" }}>
      {/* Avatar row */}
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px" }}>
        <div style={{ position:"relative" }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:300, damping:20 }}
            style={{
              width:"62px", height:"62px", borderRadius:"20px",
              background:`linear-gradient(135deg, ${T.primary}28, ${T.accent}28)`,
              border:`1px solid ${T.primary}40`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"24px", fontWeight:700, fontFamily:"'Space Grotesk', sans-serif", color:T.primary,
            }}>A</motion.div>
          <div style={{ position:"absolute", bottom:"-4px", right:"-4px", width:"18px", height:"18px", borderRadius:"6px", background:T.success, display:"flex", alignItems:"center", justifyContent:"center", border:`2.5px solid ${T.bg}` }}>
            <Check size={9} strokeWidth={3.5} color={T.bg} />
          </div>
        </div>
        <div style={{ flex:1 }}>
          <h2 className="font-display" style={{ fontSize:"19px", fontWeight:700, marginBottom:"2px" }}>Ada Lovelace</h2>
          <p style={{ color:T.muted, fontSize:"13px" }}>ada@xsyna.ai</p>
        </div>
        <div style={{ padding:"5px 12px", borderRadius:"20px", background:`${T.primary}15`, border:`1px solid ${T.primary}30`, fontSize:"11px", fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, color:T.primary, letterSpacing:"0.06em" }}>
          PRO
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"24px" }}>
        {[
          { icon:Zap,      label:"Agents",   val:"12"   },
          { icon:Activity, label:"Sessions", val:"847"  },
          { icon:Database, label:"Uptime",   val:"99.9%"},
        ].map(({ icon:Icon, label, val }) => (
          <div key={label} style={{
            background:T.bg2, borderRadius:"14px", border:`1px solid ${T.border}`,
            padding:"14px 10px", textAlign:"center",
          }}>
            <Icon size={16} color={T.muted} strokeWidth={1.5} style={{ margin:"0 auto 6px" }} />
            <div className="font-display" style={{ fontSize:"19px", fontWeight:700, color:T.primary }}>{val}</div>
            <div style={{ fontSize:"10px", color:T.muted, marginTop:"2px", letterSpacing:"0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Settings list */}
      <div style={{ background:T.bg2, borderRadius:"16px", border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:"20px" }}>
        {[
          { icon:Bell,        label:"Push notifications", checked:notifs, set:setNotifs },
          { icon:Shield,      label:"Two-Factor Auth",    checked:twoFA,  set:setTwoFA  },
          { icon:Fingerprint, label:"Biometric login",   checked:bio,    set:setBio    },
        ].map(({ icon:Icon, label, checked, set }, i, arr) => (
          <div key={label} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"15px 18px",
            borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <Icon size={17} color={T.muted} strokeWidth={1.6} />
              <span style={{ fontSize:"14px" }}>{label}</span>
            </div>
            <LiquidToggle checked={checked} onChange={set} />
          </div>
        ))}
      </div>

      <LiquidButton fullWidth variant="ghost" onClick={() => go("login")}>
        <LogOut size={16} color={T.error} />
        <span style={{ color:T.error }}>Sign Out</span>
      </LiquidButton>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
type BlobSet = BlobCfg[];
const BLOBS: Record<Screen, BlobSet> = {
  login:   [{ color:`${T.primary}22`, size:640, cx:"12%",  cy:"22%", dur:20, delay:0  },
             { color:`${T.accent}18`,  size:520, cx:"88%",  cy:"72%", dur:27, delay:5  }],
  signup:  [{ color:`${T.accent}22`,  size:700, cx:"85%",  cy:"12%", dur:22, delay:0  },
             { color:`${T.primary}15`, size:420, cx:"15%",  cy:"80%", dur:30, delay:6  }],
  verify:  [{ color:`${T.secondary}20`,size:600, cx:"50%", cy:"40%", dur:18, delay:0  },
             { color:`${T.primary}12`, size:360, cx:"10%",  cy:"88%", dur:25, delay:4  }],
  reset:   [{ color:`${T.secondary}20`,size:540, cx:"75%", cy:"28%", dur:21, delay:0  },
             { color:`${T.accent}14`,  size:400, cx:"20%",  cy:"65%", dur:28, delay:7  }],
  profile: [{ color:`${T.success}16`, size:580, cx:"65%",  cy:"25%", dur:24, delay:0  },
             { color:`${T.primary}14`, size:420, cx:"18%",  cy:"72%", dur:20, delay:4  }],
};

export function DesignSystemV3() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <div className="sso-wrap" style={{ position:"relative" }}>
      <GlobalStyles />
      <BlobLayer blobs={BLOBS[screen]} />

      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:"440px",
        margin:"0 auto",
      }}>
        {/* Logo */}
        <motion.div
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", marginBottom:"40px" }}
          initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        >
          <XSynaLogo size={46} />
          <span className="font-display" style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.22em", color:T.muted, textTransform:"uppercase" }}>
            xSyna SSO
          </span>
        </motion.div>

        {/* Screen */}
        <AnimatePresence mode="wait">
          {screen === "login"   && <LoginScreen   key="login"   go={setScreen} />}
          {screen === "signup"  && <SignupScreen  key="signup"  go={setScreen} />}
          {screen === "verify"  && <VerifyScreen  key="verify"  go={setScreen} />}
          {screen === "reset"   && <ResetScreen   key="reset"   go={setScreen} />}
          {screen === "profile" && <ProfileScreen key="profile" go={setScreen} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
