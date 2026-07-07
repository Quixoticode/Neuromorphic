import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Check, ChevronLeft, ChevronRight,
  Mail, Lock, User, Shield, Smartphone, Bell, Fingerprint,
  LogOut, Zap, Activity, Database, Brain, Waves, Droplets,
  Network, Cpu, Layers, Orbit, Sparkles, Star, Heart,
  Settings, ArrowUpRight, Play, Pause, Volume2, VolumeX,
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

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    .nl-root {
      font-family: 'DM Sans', sans-serif;
      background: ${T.bg};
      color: ${T.text};
      min-height: 100dvh;
      overflow-y: auto;
      overflow-x: hidden;
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
      0%   { transform: translate(-50%,-50%) scale(0); opacity:0.55; }
      100% { transform: translate(-50%,-50%) scale(7); opacity:0; }
    }
    .liq-ripple {
      position:absolute; width:70px; height:70px; border-radius:50%;
      pointer-events:none; animation: liqRipple 0.75s ease-out forwards;
    }

    @keyframes axonPulse {
      0%,100% { stroke-dashoffset:200; }
      50%     { stroke-dashoffset:0; }
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: ${T.text};
      -webkit-box-shadow: 0 0 0 1000px ${T.bg2} inset;
      transition: background-color 5000s;
    }

    .nl-section {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 80px 24px;
    }

    @media (max-width: 640px) {
      .nl-section { padding: 56px 16px; }
    }
  `}</style>
);

// ─── Blobs ───────────────────────────────────────────────────────────────────
const BgBlobs = () => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
    {[
      { c:`${T.primary}20`, s:700, x:"8%",  y:"10%", d:22, dl:0 },
      { c:`${T.accent}18`,  s:600, x:"90%", y:"60%", d:28, dl:6 },
      { c:`${T.secondary}14`,s:500,x:"50%", y:"85%", d:20, dl:3 },
    ].map((b,i)=>(
      <div key={i} style={{
        position:"absolute", width:b.s, height:b.s,
        left:b.x, top:b.y, transform:"translate(-50%,-50%)",
        background:b.c, filter:`blur(${Math.round(b.s*0.19)}px)`,
        animation:`blobMorph ${b.d}s ease-in-out infinite`, animationDelay:`${b.dl}s`,
        mixBlendMode:"screen",
      }} />
    ))}
  </div>
);

// ─── Liquid Button ───────────────────────────────────────────────────────────
type BtnV = "primary"|"secondary"|"accent"|"ghost"|"danger"|"success";
const VBg:Record<BtnV,string> = {
  primary:T.primary, secondary:T.secondary, accent:T.accent,
  ghost:"transparent", danger:T.error, success:T.success,
};
interface LBProps {
  children:React.ReactNode; onClick?:()=>void; variant?:BtnV;
  fullWidth?:boolean; type?:"button"|"submit"; disabled?:boolean; size?:"sm"|"md"|"lg";
}
const LiquidButton = ({ children, onClick, variant="primary", fullWidth, type="button", disabled, size="md" }:LBProps) => {
  const [ripples,setRipples] = useState<{id:number;x:number;y:number}[]>([]);
  const [down,setDown] = useState(false);
  const fire = (e:React.PointerEvent<HTMLButtonElement>) => {
    if(disabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now()+Math.random();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setDown(true);
    setTimeout(()=>setRipples(p=>p.filter(x=>x.id!==id)),760);
    setTimeout(()=>setDown(false),140);
    onClick?.();
  };
  const bg=VBg[variant]; const isG=variant==="ghost";
  const pad={sm:"8px 18px",md:"13px 26px",lg:"18px 44px"}[size];
  const fz={sm:"13px",md:"14px",lg:"16px"}[size];
  const h={sm:"38px",md:"50px",lg:"62px"}[size];
  const textC=isG?T.muted:(variant==="primary"?T.bg:"#fff");
  return (
    <motion.button type={type} disabled={disabled} onPointerDown={fire}
      animate={{scale:down?0.96:1}} whileHover={!disabled?{scale:1.02}:{}}
      transition={{type:"spring",stiffness:500,damping:28}}
      style={{
        position:"relative",overflow:"hidden",borderRadius:"13px",
        border:isG?`1px solid ${T.border}`:"none",
        background:isG?"rgba(255,255,255,0.03)":`linear-gradient(130deg,${bg}ee,${bg}99)`,
        color:textC, fontFamily:"'Space Grotesk', sans-serif",
        fontWeight:600, fontSize:fz, letterSpacing:"0.02em",
        padding:pad, height:h, width:fullWidth?"100%":"auto",
        cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.36:1,
        boxShadow:isG?"none":`0 0 22px ${bg}28,0 2px 12px ${bg}18`,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
      {ripples.map(rp=>(
        <span key={rp.id} className="liq-ripple"
          style={{left:rp.x,top:rp.y,background:`radial-gradient(circle,${bg}55 0%,transparent 70%)`}} />
      ))}
      <span style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"7px"}}>
        {children}
      </span>
    </motion.button>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spin = ({color=T.bg}:{color?:string}) => (
  <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}
    style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${color}30`,borderTop:`2px solid ${color}`}} />
);

// ─── Liquid Input ────────────────────────────────────────────────────────────
interface LIProps {
  label?:string; type?:string; value:string; onChange:(v:string)=>void;
  icon?:React.ComponentType<any>; iconRight?:React.ReactNode;
  placeholder?:string; error?:string; autoComplete?:string;
}
const LiquidInput = ({label,type="text",value,onChange,icon:Icon,iconRight,placeholder,error,autoComplete}:LIProps) => {
  const [focused,setFocused]=useState(false);
  return (
    <div>
      {label&&<label style={{display:"block",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",
        textTransform:"uppercase",color:focused?T.primary:T.muted,marginBottom:"7px",
        fontFamily:"'Space Grotesk', sans-serif",transition:"color 0.3s"}}>{label}</label>}
      <div style={{position:"relative"}}>
        {Icon&&<div style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",
          color:focused?T.primary:T.muted,transition:"color 0.3s",pointerEvents:"none",zIndex:1,display:"flex"}}>
          <Icon size={16} strokeWidth={1.6}/></div>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{width:"100%",background:T.bg2,
            border:`1.5px solid ${focused?T.primary+"66":error?T.error+"50":T.border}`,
            borderRadius:"12px",color:T.text,fontSize:"14px",
            fontFamily:"'DM Sans', sans-serif",
            padding:Icon?"13px 42px 13px 44px":"13px 14px",
            paddingRight:iconRight?"44px":undefined,
            outline:"none",WebkitAppearance:"none",
            transition:"border-color 0.25s,box-shadow 0.25s",
            boxShadow:focused?`0 0 0 3px ${T.primary}14`:error?`0 0 0 3px ${T.error}12`:"none"}} />
        {iconRight&&<div style={{position:"absolute",right:"13px",top:"50%",transform:"translateY(-50%)",zIndex:1,display:"flex"}}>
          {iconRight}</div>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",pointerEvents:"none",
          borderRadius:"0 0 12px 12px",overflow:"hidden"}}>
          <motion.div animate={{scaleX:focused?1:0,opacity:focused?1:0}} initial={{scaleX:0,opacity:0}}
            transition={{duration:0.35,ease:[0.4,0,0.2,1]}}
            style={{position:"absolute",inset:0,background:`linear-gradient(90deg,${T.primary},${T.accent})`,
              transformOrigin:"left",filter:`drop-shadow(0 0 5px ${T.primary})`}} />
        </div>
      </div>
      <AnimatePresence>
        {error&&<motion.p initial={{opacity:0,y:-3}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          style={{color:T.error,fontSize:"11px",marginTop:"4px"}}>{error}</motion.p>}
      </AnimatePresence>
    </div>
  );
};

// ─── Liquid Toggle ───────────────────────────────────────────────────────────
const LiquidToggle = ({checked,onChange,label}:{checked:boolean;onChange:(v:boolean)=>void;label?:string}) => (
  <button onClick={()=>onChange(!checked)} style={{display:"flex",alignItems:"center",gap:"10px",
    background:"none",border:"none",cursor:"pointer",padding:0}}>
    <div style={{position:"relative",width:"46px",height:"26px",borderRadius:"13px",
      background:checked?`${T.primary}25`:T.bg2,
      border:`1px solid ${checked?T.primary+"55":T.border}`,transition:"all 0.3s",
      boxShadow:checked?`0 0 14px ${T.primary}28`:"none"}}>
      <motion.div animate={{x:checked?21:2}} transition={{type:"spring",stiffness:600,damping:32}}
        style={{position:"absolute",top:"3px",width:"18px",height:"18px",borderRadius:"50%",
          background:checked?T.primary:T.muted,
          boxShadow:checked?`0 0 8px ${T.primary}`:"none"}} />
    </div>
    {label&&<span style={{color:T.muted,fontSize:"13px"}}>{label}</span>}
  </button>
);

// ─── Liquid Checkbox ─────────────────────────────────────────────────────────
const LiquidCheckbox = ({checked,onChange,children}:{checked:boolean;onChange:(v:boolean)=>void;children?:React.ReactNode}) => (
  <button onClick={()=>onChange(!checked)} style={{display:"flex",alignItems:"flex-start",gap:"10px",
    background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"left"}}>
    <div style={{flexShrink:0,width:"20px",height:"20px",borderRadius:"6px",marginTop:"1px",
      border:`1.5px solid ${checked?T.primary:T.muted+"55"}`,
      background:checked?`${T.primary}18`:"transparent",
      display:"flex",alignItems:"center",justifyContent:"center",
      transition:"all 0.25s",boxShadow:checked?`0 0 12px ${T.primary}28`:"none"}}>
      <motion.div initial={{scale:0}} animate={{scale:checked?1:0}}
        transition={{type:"spring",stiffness:600,damping:22}}>
        <Check size={11} color={T.primary} strokeWidth={3}/>
      </motion.div>
    </div>
    {children&&<span style={{color:T.muted,fontSize:"13px",lineHeight:1.55}}>{children}</span>}
  </button>
);

// ─── Liquid Slider ───────────────────────────────────────────────────────────
const LiquidSlider = ({value,onChange,color=T.primary,label}:{value:number;onChange:(n:number)=>void;color?:string;label?:string}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = value/100;

  const calc = (cx:number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return Math.max(0,Math.min(100,Math.round(((cx-r.left)/r.width)*100)));
  };
  const onPointerDown = (e:React.PointerEvent) => {
    dragging.current=true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onChange(calc(e.clientX));
  };
  const onPointerMove = (e:React.PointerEvent) => { if(dragging.current) onChange(calc(e.clientX)); };
  const onPointerUp = () => { dragging.current=false; };

  return (
    <div>
      {label&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}>
        <span style={{fontSize:"12px",color:T.muted}}>{label}</span>
        <span className="font-mono" style={{fontSize:"12px",color}}>{value}%</span>
      </div>}
      <div ref={trackRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        style={{position:"relative",height:"6px",borderRadius:"3px",background:T.border,cursor:"pointer",touchAction:"none"}}>
        <motion.div animate={{width:`${value}%`}} transition={{type:"spring",stiffness:400,damping:40}}
          style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:"3px",
            background:`linear-gradient(90deg,${color},${color}99)`,
            boxShadow:`0 0 10px ${color}60`}} />
        {/* wave at leading edge */}
        <motion.div animate={{left:`${value}%`}} transition={{type:"spring",stiffness:400,damping:40}}
          style={{position:"absolute",top:"50%",transform:"translate(-50%,-50%)",
            width:"20px",height:"20px",borderRadius:"50%",
            background:color,boxShadow:`0 0 0 4px ${color}30,0 0 14px ${color}80`,zIndex:2,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:T.bg}} />
        </motion.div>
      </div>
    </div>
  );
};

// ─── OTP Input ───────────────────────────────────────────────────────────────
const OTPInput = ({value,onChange}:{value:string;onChange:(v:string)=>void}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const LEN=6;
  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:"8px",justifyContent:"center"}} onClick={()=>inputRef.current?.focus()}>
        {Array.from({length:LEN}).map((_,i)=>{
          const digit=value[i]??""; const isActive=value.length===i;
          return (
            <motion.div key={i} animate={{scale:isActive?1.07:1}}
              style={{width:"46px",height:"54px",borderRadius:"12px",
                border:`1.5px solid ${digit?T.primary+"99":isActive?T.primary+"44":T.border}`,
                background:digit?`${T.primary}0d`:T.bg2,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"20px",fontFamily:"'JetBrains Mono', monospace",fontWeight:700,color:T.text,
                cursor:"text",position:"relative",overflow:"hidden",
                boxShadow:digit?`0 0 18px ${T.primary}1a`:"none",
                transition:"border-color 0.2s,background 0.2s"}}>
              {digit?(
                <motion.span key={i+digit} initial={{y:-14,opacity:0}} animate={{y:0,opacity:1}}
                  style={{position:"absolute"}}>{digit}</motion.span>
              ):isActive?(
                <motion.div animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:0.85}}
                  style={{width:"2px",height:"20px",background:T.primary,borderRadius:"2px"}} />
              ):null}
            </motion.div>
          );
        })}
      </div>
      <input ref={inputRef} type="tel" inputMode="numeric" maxLength={LEN} value={value}
        onChange={e=>onChange(e.target.value.replace(/\D/g,"").slice(0,LEN))}
        style={{position:"absolute",opacity:0,pointerEvents:"none",width:0,height:0,top:0,left:0}} />
    </div>
  );
};

// ─── Password Strength ───────────────────────────────────────────────────────
const StrengthBar = ({password}:{password:string}) => {
  const s=password.length===0?0:password.length<6?1:password.length<10?2:/[^a-zA-Z0-9]/.test(password)?4:3;
  const cols=["",T.error,T.secondary,T.secondary,T.success];
  const labs=["","Weak","Fair","Good","Strong"];
  if(!password) return null;
  return (
    <div style={{marginTop:"8px"}}>
      <div style={{display:"flex",gap:"4px",marginBottom:"4px"}}>
        {[1,2,3,4].map(i=>(
          <motion.div key={i} animate={{scaleX:s>=i?1:0,backgroundColor:cols[s]}}
            initial={{scaleX:0}}
            transition={{duration:0.3,delay:i*0.05}}
            style={{flex:1,height:"3px",borderRadius:"2px",transformOrigin:"left",background:T.border}} />
        ))}
      </div>
      <p style={{fontSize:"11px",color:cols[s]}}>{labs[s]}</p>
    </div>
  );
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
const Section = ({children,id,alt}:{children:React.ReactNode;id?:string;alt?:boolean}) => (
  <section id={id} style={{position:"relative",zIndex:1,background:alt?"rgba(255,255,255,0.018)":"transparent",
    borderTop:alt?`1px solid ${T.border}`:"none",borderBottom:alt?`1px solid ${T.border}`:"none"}}>
    <div className="nl-section">{children}</div>
  </section>
);

const SectionLabel = ({n,title,sub}:{n:string;title:string;sub:string}) => (
  <div style={{marginBottom:"52px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"12px"}}>
      <span className="font-mono" style={{fontSize:"11px",color:T.primary,letterSpacing:"0.15em"}}>{n}</span>
      <div style={{flex:1,height:"1px",background:`linear-gradient(90deg,${T.primary}40,transparent)`}} />
    </div>
    <h2 className="font-display" style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:700,marginBottom:"10px",lineHeight:1.15}}>{title}</h2>
    <p style={{color:T.muted,fontSize:"16px",maxWidth:"540px"}}>{sub}</p>
  </div>
);

// ─── SSO screens (minimal, embedded) ─────────────────────────────────────────
type Screen = "login"|"signup"|"verify"|"reset"|"profile";

const pv = { initial:{opacity:0,y:14,filter:"blur(4px)"}, animate:{opacity:1,y:0,filter:"blur(0px)"}, exit:{opacity:0,y:-14,filter:"blur(4px)"} };
const pt = { duration:0.35, ease:[0.4,0,0.2,1] as any };

const XSynaLogo = ({size=40}:{size?:number}) => (
  <svg viewBox="0 0 100 100" style={{width:size,height:size,display:"block"}}>
    <defs>
      <linearGradient id="xlg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={T.primary}/><stop offset="100%" stopColor={T.secondary}/>
      </linearGradient>
    </defs>
    <path d="M18,18 Q50,50 82,82 M18,82 Q50,50 82,18" stroke="url(#xlg)" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <circle cx="50" cy="50" r="9" fill={T.bg} stroke="url(#xlg)" strokeWidth="4.5"/>
  </svg>
);

const SSOLogin = ({go}:{go:(s:Screen)=>void}) => {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false); const [remember,setRemember]=useState(false);
  const [loading,setLoading]=useState(false);
  const submit=()=>{if(!email||!pw)return;setLoading(true);setTimeout(()=>{setLoading(false);go("profile");},1700);};
  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt}>
      <div style={{marginBottom:"28px"}}>
        <h3 className="font-display" style={{fontSize:"24px",fontWeight:700,marginBottom:"6px"}}>Welcome back</h3>
        <p style={{color:T.muted,fontSize:"14px"}}>Sign in to your xSyna account</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
        <LiquidInput label="Email" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@xsyna.ai" autoComplete="email"/>
        <LiquidInput label="Password" type={showPw?"text":"password"} value={pw} onChange={setPw} icon={Lock} placeholder="••••••••" autoComplete="current-password"
          iconRight={<button onClick={()=>setShowPw(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:0,display:"flex"}}>
            {showPw?<EyeOff size={16} strokeWidth={1.6}/>:<Eye size={16} strokeWidth={1.6}/>}</button>}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <LiquidToggle checked={remember} onChange={setRemember} label="Remember me"/>
          <button onClick={()=>go("reset")} style={{background:"none",border:"none",cursor:"pointer",color:T.primary,fontSize:"12px",fontFamily:"'DM Sans',sans-serif"}}>Forgot password?</button>
        </div>
        <LiquidButton fullWidth onClick={submit} disabled={loading}>
          {loading?<><Spin/>Signing in…</>:<><span>Sign In</span><ArrowRight size={16}/></>}
        </LiquidButton>
      </div>
      <p style={{textAlign:"center",marginTop:"22px",color:T.muted,fontSize:"13px"}}>
        No account?{" "}
        <button onClick={()=>go("signup")} style={{background:"none",border:"none",cursor:"pointer",color:T.primary,fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:600}}>Sign up free</button>
      </p>
    </motion.div>
  );
};

const SSOSignup = ({go}:{go:(s:Screen)=>void}) => {
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [pw,setPw]=useState(""); const [showPw,setShowPw]=useState(false);
  const [agreed,setAgreed]=useState(false); const [loading,setLoading]=useState(false);
  const submit=()=>{if(!agreed||!name||!email||!pw)return;setLoading(true);setTimeout(()=>{setLoading(false);go("verify");},1700);};
  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt}>
      <div style={{marginBottom:"28px"}}>
        <h3 className="font-display" style={{fontSize:"24px",fontWeight:700,marginBottom:"6px"}}>Create account</h3>
        <p style={{color:T.muted,fontSize:"14px"}}>Join the neural network</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
        <LiquidInput label="Full name" type="text" value={name} onChange={setName} icon={User} placeholder="Ada Lovelace" autoComplete="name"/>
        <LiquidInput label="Email" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@xsyna.ai" autoComplete="email"/>
        <div>
          <LiquidInput label="Password" type={showPw?"text":"password"} value={pw} onChange={setPw} icon={Lock} placeholder="Min. 8 characters" autoComplete="new-password"
            iconRight={<button onClick={()=>setShowPw(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:0,display:"flex"}}>
              {showPw?<EyeOff size={16} strokeWidth={1.6}/>:<Eye size={16} strokeWidth={1.6}/>}</button>}/>
          <StrengthBar password={pw}/>
        </div>
        <LiquidCheckbox checked={agreed} onChange={setAgreed}>
          I agree to the <span style={{color:T.primary}}>Terms</span> and <span style={{color:T.primary}}>Privacy Policy</span>
        </LiquidCheckbox>
        <LiquidButton fullWidth onClick={submit} disabled={loading||!agreed}>
          {loading?<><Spin/>Creating…</>:"Create Account"}
        </LiquidButton>
      </div>
      <p style={{textAlign:"center",marginTop:"22px",color:T.muted,fontSize:"13px"}}>
        Have an account?{" "}
        <button onClick={()=>go("login")} style={{background:"none",border:"none",cursor:"pointer",color:T.primary,fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:600}}>Sign in</button>
      </p>
    </motion.div>
  );
};

const SSOVerify = ({go}:{go:(s:Screen)=>void}) => {
  const [otp,setOtp]=useState(""); const [loading,setLoading]=useState(false);
  const verify=()=>{if(otp.length<6)return;setLoading(true);setTimeout(()=>{setLoading(false);go("profile");},1500);};
  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt} style={{textAlign:"center"}}>
      <div style={{width:"60px",height:"60px",borderRadius:"18px",background:`${T.primary}12`,border:`1px solid ${T.primary}40`,
        display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
        <Smartphone size={26} color={T.primary} strokeWidth={1.5}/>
      </div>
      <h3 className="font-display" style={{fontSize:"24px",fontWeight:700,marginBottom:"6px"}}>Verify email</h3>
      <p style={{color:T.muted,fontSize:"14px",marginBottom:"28px"}}>Enter the 6-digit code we sent you</p>
      <div style={{marginBottom:"24px"}}><OTPInput value={otp} onChange={setOtp}/></div>
      <LiquidButton fullWidth onClick={verify} disabled={loading||otp.length<6}>
        {loading?<><Spin/>Verifying…</>:"Verify Code"}
      </LiquidButton>
      <button onClick={()=>go("login")} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",
        background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:"12px",fontFamily:"'DM Sans',sans-serif",margin:"16px auto 0"}}>
        <ChevronLeft size={14}/>Back to login
      </button>
    </motion.div>
  );
};

const SSOProfile = ({go}:{go:(s:Screen)=>void}) => {
  const [notifs,setNotifs]=useState(true); const [twoFA,setTwoFA]=useState(false); const [bio,setBio]=useState(true);
  return (
    <motion.div variants={pv} initial="initial" animate="animate" exit="exit" transition={pt}>
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"24px"}}>
        <div style={{position:"relative"}}>
          <div style={{width:"56px",height:"56px",borderRadius:"18px",
            background:`linear-gradient(135deg,${T.primary}28,${T.accent}28)`,
            border:`1px solid ${T.primary}40`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"22px",fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",color:T.primary}}>A</div>
          <div style={{position:"absolute",bottom:"-3px",right:"-3px",width:"16px",height:"16px",borderRadius:"5px",
            background:T.success,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.bg}`}}>
            <Check size={8} strokeWidth={3.5} color={T.bg}/></div>
        </div>
        <div style={{flex:1}}>
          <div className="font-display" style={{fontSize:"18px",fontWeight:700}}>Ada Lovelace</div>
          <div style={{color:T.muted,fontSize:"12px"}}>ada@xsyna.ai</div>
        </div>
        <div style={{padding:"4px 10px",borderRadius:"20px",background:`${T.primary}15`,
          border:`1px solid ${T.primary}30`,fontSize:"10px",fontFamily:"'Space Grotesk',sans-serif",
          fontWeight:700,color:T.primary,letterSpacing:"0.06em"}}>PRO</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:"20px"}}>
        {[{l:"Agents",v:"12",icon:Zap},{l:"Sessions",v:"847",icon:Activity},{l:"Uptime",v:"99.9%",icon:Database}].map(({l,v,icon:Icon})=>(
          <div key={l} style={{background:T.bg2,borderRadius:"12px",border:`1px solid ${T.border}`,padding:"12px 8px",textAlign:"center"}}>
            <Icon size={14} color={T.muted} strokeWidth={1.5} style={{margin:"0 auto 5px"}}/>
            <div className="font-display" style={{fontSize:"17px",fontWeight:700,color:T.primary}}>{v}</div>
            <div style={{fontSize:"10px",color:T.muted,marginTop:"1px"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.bg2,borderRadius:"14px",border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:"16px"}}>
        {[{icon:Bell,label:"Notifications",checked:notifs,set:setNotifs},{icon:Shield,label:"Two-Factor Auth",checked:twoFA,set:setTwoFA},{icon:Fingerprint,label:"Biometric Login",checked:bio,set:setBio}].map(({icon:Icon,label,checked,set},i,arr)=>(
          <div key={label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <Icon size={15} color={T.muted} strokeWidth={1.6}/>
              <span style={{fontSize:"13px"}}>{label}</span>
            </div>
            <LiquidToggle checked={checked} onChange={set}/>
          </div>
        ))}
      </div>
      <LiquidButton fullWidth variant="ghost" onClick={()=>go("login")}>
        <LogOut size={14} color={T.error}/><span style={{color:T.error}}>Sign Out</span>
      </LiquidButton>
    </motion.div>
  );
};

// ─── Icon cell ────────────────────────────────────────────────────────────────
const IconCell = ({icon:Icon,name,color}:{icon:React.ComponentType<any>;name:string;color:string}) => {
  const [hov,setHov]=useState(false);
  return (
    <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      animate={{borderColor:hov?color+"66":T.border,background:hov?`${color}0d`:T.bg2}}
      style={{borderRadius:"14px",border:`1px solid ${T.border}`,
        padding:"18px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",
        cursor:"default",background:T.bg2,transition:"box-shadow 0.2s",
        boxShadow:hov?`0 0 16px ${color}28`:"none"}}>
      <motion.div animate={{color:hov?color:T.muted,scale:hov?1.18:1}} transition={{type:"spring",stiffness:400,damping:14}}>
        <Icon size={28} strokeWidth={1.5}/>
      </motion.div>
      <span style={{fontSize:"10px",letterSpacing:"0.06em",color:T.muted,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,textTransform:"uppercase"}}>{name}</span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function DesignSystemV3() {
  // Demo state
  const [ssoScreen,setSsoScreen]=useState<Screen>("login");
  const [toggle1,setToggle1]=useState(true);
  const [toggle2,setToggle2]=useState(false);
  const [toggle3,setToggle3]=useState(true);
  const [check1,setCheck1]=useState(true);
  const [check2,setCheck2]=useState(false);
  const [check3,setCheck3]=useState(true);
  const [slider1,setSlider1]=useState(65);
  const [slider2,setSlider2]=useState(30);
  const [slider3,setSlider3]=useState(80);
  const [demoInput,setDemoInput]=useState("");
  const [demoOTP,setDemoOTP]=useState("");
  const [btnClicks,setBtnClicks]=useState<Record<string,number>>({});
  const [playing,setPlaying]=useState(false);
  const [muted,setMuted]=useState(false);
  const click=(k:string)=>setBtnClicks(p=>({...p,[k]:(p[k]||0)+1}));

  // Axon animation lines for hero
  const AXONS = 8;

  return (
    <div className="nl-root" style={{position:"relative"}}>
      <GlobalStyles/>
      <BgBlobs/>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <Section>
        <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:"0"}}>
          {/* Logo */}
          <motion.div initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}} transition={{duration:0.7,ease:[0.4,0,0.2,1]}}
            style={{position:"relative",width:"120px",height:"120px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"32px"}}>
            <XSynaLogo size={72}/>
            <svg viewBox="0 0 200 200" style={{position:"absolute",inset:"-30%",width:"160%",height:"160%",opacity:0.45}}>
              {Array.from({length:AXONS}).map((_,i)=>(
                <motion.line key={i} x1="100" y1="100"
                  x2={100+Math.cos((i*Math.PI)/4)*80} y2={100+Math.sin((i*Math.PI)/4)*80}
                  stroke={T.primary} strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="200"
                  animate={{strokeDashoffset:[200,0,200]}}
                  transition={{duration:3.5,delay:i*0.22,repeat:Infinity,ease:"easeInOut"}}/>
              ))}
            </svg>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.15}}>
            <p className="font-mono" style={{fontSize:"11px",letterSpacing:"0.2em",color:T.muted,marginBottom:"18px",textTransform:"uppercase"}}>
              Neuromorphic Liquid · Design System
            </p>
            <h1 className="font-display" style={{fontSize:"clamp(40px,7vw,80px)",fontWeight:700,lineHeight:1.05,letterSpacing:"-0.02em",marginBottom:"20px"}}>
              <span style={{background:`linear-gradient(135deg,${T.primary},${T.secondary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                Liquid
              </span>
              {" "}by nature.
            </h1>
            <p style={{color:T.muted,fontSize:"clamp(15px,2vw,18px)",maxWidth:"520px",margin:"0 auto 44px",lineHeight:1.65}}>
              Every interaction breathes. Every component flows. A design language built for intelligence that moves.
            </p>
          </motion.div>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3}}
            style={{display:"flex",gap:"14px",flexWrap:"wrap",justifyContent:"center"}}>
            <LiquidButton size="lg" onClick={()=>{const el=document.getElementById("interactions");el?.scrollIntoView({behavior:"smooth"});}}>
              Explore System <ArrowRight size={18}/>
            </LiquidButton>
            <LiquidButton size="lg" variant="ghost" onClick={()=>{const el=document.getElementById("sso");el?.scrollIntoView({behavior:"smooth"});}}>
              SSO Demo <ArrowUpRight size={18}/>
            </LiquidButton>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}
            style={{display:"flex",gap:"40px",marginTop:"72px",flexWrap:"wrap",justifyContent:"center"}}>
            {[{v:"6",l:"Component types"},{v:"∞",l:"Ripple states"},{v:"3",l:"Brand themes"},{v:"60fps",l:"Animations"}].map(({v,l})=>(
              <div key={l} style={{textAlign:"center"}}>
                <div className="font-display" style={{fontSize:"28px",fontWeight:700,color:T.primary}}>{v}</div>
                <div style={{fontSize:"12px",color:T.muted,marginTop:"3px"}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── INTERACTIONS ────────────────────────────────────────────────── */}
      <Section alt id="interactions">
        <SectionLabel n="01 / INTERACTIONS" title="Liquid Buttons" sub="Every press generates a ripple wave from the exact contact point. Try them — each variant has its own glow signature." />

        {/* Button grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"16px",marginBottom:"40px"}}>
          {([
            {v:"primary",   label:"Primary",   desc:"Main actions"},
            {v:"secondary", label:"Secondary", desc:"Highlights"},
            {v:"accent",    label:"Accent",    desc:"Feature calls"},
            {v:"success",   label:"Success",   desc:"Confirmations"},
            {v:"danger",    label:"Danger",    desc:"Destructive"},
            {v:"ghost",     label:"Ghost",     desc:"Neutral"},
          ] as {v:BtnV;label:string;desc:string}[]).map(({v,label,desc})=>(
            <div key={v} style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              <LiquidButton variant={v} fullWidth onClick={()=>click(v)}>
                {label} {btnClicks[v]?<span style={{opacity:0.7,fontSize:"11px"}}>×{btnClicks[v]}</span>:null}
              </LiquidButton>
              <p style={{fontSize:"11px",color:T.muted,textAlign:"center"}}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Size row */}
        <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px",marginBottom:"40px"}}>
          <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"20px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Sizes</p>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"14px"}}>
            <LiquidButton size="sm" onClick={()=>{}}>Small</LiquidButton>
            <LiquidButton size="md" onClick={()=>{}}>Medium</LiquidButton>
            <LiquidButton size="lg" onClick={()=>{}}>Large</LiquidButton>
            <LiquidButton size="md" disabled onClick={()=>{}}>Disabled</LiquidButton>
            <LiquidButton size="md" onClick={()=>{}}><Spin/> Loading</LiquidButton>
          </div>
        </div>

        {/* Player demo */}
        <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px"}}>
          <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"20px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Icon Buttons</p>
          <div style={{display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap"}}>
            <LiquidButton variant={playing?"primary":"ghost"} size="md" onClick={()=>setPlaying(v=>!v)}>
              {playing?<><Pause size={18}/>Pause</>:<><Play size={18}/>Play</>}
            </LiquidButton>
            <LiquidButton variant={muted?"danger":"ghost"} size="md" onClick={()=>setMuted(v=>!v)}>
              {muted?<><VolumeX size={18}/>Muted</>:<><Volume2 size={18}/>Sound</>}
            </LiquidButton>
            <LiquidButton variant="accent" size="md" onClick={()=>{}}>
              <Settings size={18}/>Configure
            </LiquidButton>
            <LiquidButton variant="secondary" size="md" onClick={()=>{}}>
              <Star size={18}/>Favourite
            </LiquidButton>
            <LiquidButton variant="ghost" size="md" onClick={()=>{}}>
              <Heart size={18}/>Like
            </LiquidButton>
          </div>
        </div>
      </Section>

      {/* ── CONTROLS ─────────────────────────────────────────────────────── */}
      <Section id="controls">
        <SectionLabel n="02 / CONTROLS" title="Toggles & Sliders" sub="Spring physics on every state change. Liquid fill slides like water across the track." />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px"}}>
          {/* Toggles */}
          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"22px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Toggle Switches</p>
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"14px"}}>Neural sync</span>
                <LiquidToggle checked={toggle1} onChange={setToggle1}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"14px"}}>Dark protocol</span>
                <LiquidToggle checked={toggle2} onChange={setToggle2}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"14px"}}>Auto-learn</span>
                <LiquidToggle checked={toggle3} onChange={setToggle3}/>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"22px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Checkboxes</p>
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              <LiquidCheckbox checked={check1} onChange={setCheck1}>Enable telemetry layer</LiquidCheckbox>
              <LiquidCheckbox checked={check2} onChange={setCheck2}>Allow cross-agent memory</LiquidCheckbox>
              <LiquidCheckbox checked={check3} onChange={setCheck3}>Real-time inference mode</LiquidCheckbox>
            </div>
          </div>

          {/* Sliders */}
          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px",gridColumn:"1/-1"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"28px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Liquid Sliders</p>
            <div style={{display:"flex",flexDirection:"column",gap:"32px"}}>
              <LiquidSlider value={slider1} onChange={setSlider1} color={T.primary} label="Cortex sensitivity"/>
              <LiquidSlider value={slider2} onChange={setSlider2} color={T.secondary} label="Response latency"/>
              <LiquidSlider value={slider3} onChange={setSlider3} color={T.accent} label="Neural bandwidth"/>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FORM SYSTEM ─────────────────────────────────────────────────── */}
      <Section alt id="forms">
        <SectionLabel n="03 / FORM SYSTEM" title="Inputs & Verification" sub="Focus triggers a liquid gradient line. The OTP field responds with per-cell animation as digits fall in." />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px"}}>
          {/* Input demos */}
          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"22px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Text Inputs</p>
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              <LiquidInput label="Email" type="email" value={demoInput} onChange={setDemoInput} icon={Mail} placeholder="Focus to see the liquid line" autoComplete="off"/>
              <LiquidInput label="Password" type="password" value="" onChange={()=>{}} icon={Lock} placeholder="••••••••" autoComplete="off"/>
              <LiquidInput label="With error" type="text" value="" onChange={()=>{}} icon={User} placeholder="Invalid field state" error="This field is required" autoComplete="off"/>
            </div>
          </div>

          {/* OTP */}
          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"22px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>OTP Verification</p>
            <p style={{color:T.muted,fontSize:"13px",marginBottom:"22px",lineHeight:1.6}}>
              Tap the cells and type — each digit animates in individually.
            </p>
            <OTPInput value={demoOTP} onChange={setDemoOTP}/>
            <div style={{marginTop:"20px"}}>
              <StrengthBar password={demoOTP.padEnd(1," ")}/>
            </div>
            {demoOTP.length===6&&(
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{marginTop:"16px"}}>
                <LiquidButton fullWidth onClick={()=>setDemoOTP("")}>
                  <Check size={16}/>Clear & Reset
                </LiquidButton>
              </motion.div>
            )}
          </div>
        </div>
      </Section>

      {/* ── TYPOGRAPHY ──────────────────────────────────────────────────── */}
      <Section id="type">
        <SectionLabel n="04 / TYPOGRAPHY" title="Type System" sub="Space Grotesk carries the display hierarchy. DM Sans flows through body copy. JetBrains Mono marks data." />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px"}}>
          <div>
            {[
              {tag:"Display",size:"clamp(36px,5vw,56px)",weight:700,font:"'Space Grotesk'"},
              {tag:"Heading 1",size:"clamp(26px,3.5vw,40px)",weight:700,font:"'Space Grotesk'"},
              {tag:"Heading 2",size:"clamp(20px,2.5vw,30px)",weight:600,font:"'Space Grotesk'"},
              {tag:"Body",size:"16px",weight:400,font:"'DM Sans'"},
              {tag:"Caption",size:"13px",weight:400,font:"'DM Sans'"},
              {tag:"Mono",size:"14px",weight:400,font:"'JetBrains Mono'"},
            ].map(({tag,size,weight,font})=>(
              <div key={tag} style={{display:"flex",alignItems:"baseline",gap:"20px",
                padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{width:"90px",fontSize:"11px",color:T.muted,fontFamily:"'Space Grotesk',sans-serif",
                  fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>{tag}</span>
                <span style={{fontFamily:font,fontSize:size,fontWeight:weight,color:T.text,lineHeight:1.2}}>
                  Neuromorphic Liquid
                </span>
              </div>
            ))}
          </div>

          <div style={{background:T.bg2,borderRadius:"16px",border:`1px solid ${T.border}`,padding:"28px",height:"fit-content"}}>
            <p style={{fontSize:"12px",color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"18px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>Weight scale</p>
            {[300,400,500,600,700].map(w=>(
              <div key={w} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <span className="font-mono" style={{fontSize:"11px",color:T.muted}}>{w}</span>
                <span className="font-display" style={{fontSize:"18px",fontWeight:w,
                  background:`linear-gradient(90deg,${T.primary},${T.secondary})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                  Liquid State
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ICONS ─────────────────────────────────────────────────────────── */}
      <Section alt id="icons">
        <SectionLabel n="05 / ICON SYSTEM" title="Glyph Protocol" sub="Hover to illuminate. Each symbol of the neural architecture glows in its semantic color." />

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:"12px"}}>
          {[
            {icon:Brain,    name:"Cortex",  color:T.primary},
            {icon:Waves,    name:"Pulse",   color:T.secondary},
            {icon:Droplets, name:"Liquid",  color:T.primary},
            {icon:Zap,      name:"Energy",  color:T.secondary},
            {icon:Network,  name:"Synapse", color:T.accent},
            {icon:Cpu,      name:"Process", color:T.primary},
            {icon:Shield,   name:"Secure",  color:T.success},
            {icon:Layers,   name:"Depth",   color:T.accent},
            {icon:Orbit,    name:"Orbit",   color:T.secondary},
            {icon:Activity, name:"Vitals",  color:T.error},
            {icon:Database, name:"Memory",  color:T.primary},
            {icon:Sparkles, name:"Magic",   color:T.secondary},
            {icon:Mail,     name:"Comms",   color:T.accent},
            {icon:Bell,     name:"Alerts",  color:T.secondary},
            {icon:Lock,     name:"Auth",    color:T.primary},
            {icon:Settings, name:"Config",  color:T.muted},
            {icon:Star,     name:"Rank",    color:T.secondary},
            {icon:Heart,    name:"Social",  color:T.error},
          ].map(p=><IconCell key={p.name} {...p}/>)}
        </div>
      </Section>

      {/* ── SSO DEMO ─────────────────────────────────────────────────────── */}
      <Section id="sso">
        <SectionLabel n="06 / IN ACTION" title="SSO — Live Demo" sub="The complete authentication flow, built entirely with Neuromorphic Liquid components. Fully interactive." />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"40px",alignItems:"start"}}>
          {/* Left: description + nav */}
          <div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"32px"}}>
              {([
                {s:"login",   label:"01 Login",    sub:"Email + password"},
                {s:"signup",  label:"02 Sign Up",  sub:"Registration flow"},
                {s:"verify",  label:"03 Verify",   sub:"OTP confirmation"},
                {s:"profile", label:"04 Profile",  sub:"User dashboard"},
              ] as {s:Screen;label:string;sub:string}[]).map(({s,label,sub})=>(
                <motion.button key={s} onClick={()=>setSsoScreen(s)}
                  animate={{
                    borderColor:ssoScreen===s?T.primary+"55":T.border,
                    background:ssoScreen===s?`${T.primary}0a`:"transparent",
                  }}
                  style={{display:"flex",alignItems:"center",gap:"14px",
                    background:"transparent",border:`1px solid ${T.border}`,
                    borderRadius:"12px",padding:"14px 18px",cursor:"pointer",textAlign:"left",width:"100%"}}>
                  <motion.div animate={{background:ssoScreen===s?T.primary:T.muted}}
                    style={{width:"8px",height:"8px",borderRadius:"50%",flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:600,fontFamily:"'Space Grotesk',sans-serif",color:ssoScreen===s?T.text:T.muted}}>{label}</div>
                    <div style={{fontSize:"12px",color:T.muted,marginTop:"1px"}}>{sub}</div>
                  </div>
                  {ssoScreen===s&&<ChevronRight size={14} color={T.primary} style={{marginLeft:"auto"}}/>}
                </motion.button>
              ))}
            </div>

            <div style={{background:T.bg2,borderRadius:"14px",border:`1px solid ${T.border}`,padding:"20px"}}>
              <p style={{fontSize:"12px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
                color:T.muted,marginBottom:"14px",fontFamily:"'Space Grotesk',sans-serif"}}>Components used</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                {["LiquidButton","LiquidInput","LiquidToggle","LiquidCheckbox","OTPInput","StrengthBar","AnimatePresence"].map(c=>(
                  <span key={c} className="font-mono" style={{fontSize:"11px",padding:"4px 10px",borderRadius:"6px",
                    background:`${T.primary}0d`,border:`1px solid ${T.primary}22`,color:T.primary}}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: SSO card */}
          <div style={{background:T.bg2,borderRadius:"20px",border:`1px solid ${T.border}`,
            padding:"32px",boxShadow:`0 0 60px ${T.primary}0a`}}>
            {/* Mini logo */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",marginBottom:"28px"}}>
              <XSynaLogo size={38}/>
              <span className="font-display" style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.2em",color:T.muted,textTransform:"uppercase"}}>xSyna SSO</span>
            </div>
            <AnimatePresence mode="wait">
              {ssoScreen==="login"   && <SSOLogin    key="login"   go={setSsoScreen}/>}
              {ssoScreen==="signup"  && <SSOSignup   key="signup"  go={setSsoScreen}/>}
              {ssoScreen==="verify"  && <SSOVerify   key="verify"  go={setSsoScreen}/>}
              {ssoScreen==="profile" && <SSOProfile  key="profile" go={setSsoScreen}/>}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"48px 24px 60px",
        borderTop:`1px solid ${T.border}`}}>
        <XSynaLogo size={32}/>
        <p className="font-mono" style={{fontSize:"11px",color:T.muted,marginTop:"14px",letterSpacing:"0.12em"}}>
          NEUROMORPHIC LIQUID · DESIGN SYSTEM · xSyna 2026
        </p>
      </div>
    </div>
  );
}
