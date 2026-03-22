import { useState, useEffect, useCallback, useRef } from "react";

// Nadiad Puff Wala - Premium Light v2 with Real Photos
// ── Fonts ──────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800;900&display=swap";
document.head.appendChild(fl);

const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop      { 0%{transform:scale(.82);opacity:0} 65%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes wiggle   { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
  @keyframes toastIn  { from{opacity:0;transform:translate(-50%,30px)} to{opacity:1;transform:translate(-50%,0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes goldGlow { 0%,100%{box-shadow:0 0 10px rgba(245,160,10,.3)} 50%{box-shadow:0 0 22px rgba(245,160,10,.55)} }
  @keyframes slideCarousel { 0%{opacity:0;transform:scale(1.04)} 6%{opacity:1;transform:scale(1)} 94%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(.97)} }
  .fadeup  { animation: fadeUp  .38s cubic-bezier(.22,1,.36,1) both }
  .pop     { animation: pop     .44s cubic-bezier(.34,1.56,.64,1) both }
  .slidein { animation: slideIn .3s ease both }
  * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; margin:0; padding:0; }
  html,body { background:#1A0703; }
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:#C8621A;border-radius:4px}
  ::-webkit-scrollbar-track{background:transparent}
  input:focus,select:focus,textarea:focus { outline:none!important; }
  button { font-family:'Nunito',sans-serif; }
  button:active { transform:scale(.96)!important; }
  .no-scroll { scrollbar-width:none; -ms-overflow-style:none; }
  .no-scroll::-webkit-scrollbar { display:none; }
  .card-lift { transition: transform .22s ease, box-shadow .22s ease; }
  .card-lift:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(200,90,20,.28)!important; }
  .hit-badge { animation: pulse 2.2s ease-in-out infinite; }
  .gold-glow { animation: goldGlow 2.5s ease-in-out infinite; }
  ::placeholder { color: rgba(255,220,160,.3); }
`;
document.head.appendChild(styleEl);

// ── Palette ────────────────────────────────────────────────────────
const P = {
  // Backgrounds — warm espresso brown (medium: not pitch black, not cream)
  bg:       "#1A0703",   // deep warm espresso
  bgAlt:    "#221009",   // slightly lighter for sections
  bgCard:   "rgba(255,190,100,.055)",  // warm glass card
  bgCardHov:"rgba(255,190,100,.09)",
  surface:  "rgba(255,200,120,.07)",  // glass surface
  // Borders
  border:   "rgba(255,150,60,.18)",
  borderAct:"rgba(232,98,14,.55)",
  borderGold:"rgba(245,160,10,.35)",
  // Brand
  orange:   "#E8620E",
  orangeL:  "#F07828",
  amber:    "#F59C0A",
  amberL:   "rgba(245,160,10,.15)",
  // Status
  green:    "#2E8A52",
  greenL:   "rgba(46,138,82,.15)",
  red:      "#C42020",
  redL:     "rgba(196,32,32,.15)",
  blue:     "#1D6090",
  blueL:    "rgba(29,96,144,.15)",
  // Text — warm cream
  text:     "#FFF4E8",
  textMid:  "rgba(255,244,232,.72)",
  textSoft: "rgba(255,244,232,.48)",
  textFaint:"rgba(255,244,232,.28)",
};

const CAT_CFG = {
  All:        { icon:"🍽️", color:"#E8620E", bg:"rgba(232,98,14,.18)" },
  Regular:    { icon:"🥐", color:"#C8580A", bg:"rgba(200,88,10,.16)" },
  "Sev Sing": { icon:"🥜", color:"#C87010", bg:"rgba(200,112,16,.16)" },
  Paneer:     { icon:"🟡", color:"#D09800", bg:"rgba(208,152,0,.16)" },
  Makhani:    { icon:"🧈", color:"#C07A00", bg:"rgba(192,122,0,.15)" },
  Mexican:    { icon:"🌮", color:"#5A9C1C", bg:"rgba(90,156,28,.16)" },
  Tandoori:   { icon:"🔴", color:"#C83010", bg:"rgba(200,48,16,.16)" },
  "Peri Peri":{ icon:"🔥", color:"#CC1818", bg:"rgba(204,24,24,.16)" },
  Cheesy:     { icon:"🧀", color:"#C07A00", bg:"rgba(192,122,0,.15)" },
  Exotics:    { icon:"⭐", color:"#9050C0", bg:"rgba(144,80,192,.16)" },
  Punjabi:    { icon:"🟠", color:"#C84C18", bg:"rgba(200,76,24,.16)" },
  Special:    { icon:"👑", color:"#D4960A", bg:"rgba(212,150,10,.18)" },
};
const CATS = Object.keys(CAT_CFG);

const STATUS_C = {
  Pending:   { fg:"#E88030", bg:"rgba(232,128,48,.15)" },
  Preparing: { fg:"#D4960A", bg:"rgba(212,150,10,.15)" },
  Ready:     { fg:"#2E8A52", bg:"rgba(46,138,82,.15)" },
  Delivered: { fg:"#1D6090", bg:"rgba(29,96,144,.15)" },
  Cancelled: { fg:"#C42020", bg:"rgba(196,32,32,.15)" },
};

const ADMINS = [
  { username:"owner",   password:"nadiad@puff1", name:"Owner" },
  { username:"manager", password:"nadiad@puff2", name:"Manager" },
];

// ── FULL MENU ──────────────────────────────────────────────────────
const INIT_MENU = [
  // REGULAR
  { id:101, name:"Regular Puff",          price:25, cat:"Regular",    emoji:"🥐", stock:60, popular:false, desc:"Classic crispy flaky puff, timeless favourite" },
  { id:102, name:"Schezwan Puff",         price:30, cat:"Regular",    emoji:"🌶️", stock:55, popular:true,  desc:"Spicy Schezwan sauce in flaky pastry" },
  { id:103, name:"Garlic Puff",           price:30, cat:"Regular",    emoji:"🧄", stock:50, popular:false, desc:"Aromatic garlic-infused golden puff" },
  { id:104, name:"Chatni Puff",           price:30, cat:"Regular",    emoji:"🌿", stock:45, popular:false, desc:"Tangy green chutney-filled pastry" },
  { id:105, name:"Butter Puff",           price:30, cat:"Regular",    emoji:"🧈", stock:50, popular:true,  desc:"Rich buttery pastry, melt-in-mouth" },
  // SEV SING
  { id:201, name:"Sev Puff",              price:30, cat:"Sev Sing",   emoji:"🥐", stock:60, popular:false, desc:"Crunchy sev loaded puff" },
  { id:202, name:"Sing Puff",             price:30, cat:"Sev Sing",   emoji:"🥜", stock:55, popular:false, desc:"Roasted groundnut puff" },
  { id:203, name:"Chatni Sev Puff",       price:40, cat:"Sev Sing",   emoji:"🌿", stock:45, popular:false, desc:"Chatni with crunchy sev" },
  { id:204, name:"Schezwan Sev Puff",     price:40, cat:"Sev Sing",   emoji:"🌶️", stock:40, popular:false, desc:"Fiery Schezwan with sev crunch" },
  { id:205, name:"Garlic Sev Puff",       price:40, cat:"Sev Sing",   emoji:"🧄", stock:45, popular:false, desc:"Garlic flavoured with sev" },
  { id:206, name:"Sev Sing Puff",         price:40, cat:"Sev Sing",   emoji:"🥜", stock:50, popular:true,  desc:"Best of both – sev & sing combo" },
  { id:207, name:"Sev Butter Puff",       price:40, cat:"Sev Sing",   emoji:"🧈", stock:40, popular:false, desc:"Buttery sev delight" },
  { id:208, name:"Sev Mayonnaise Puff",   price:50, cat:"Sev Sing",   emoji:"🤍", stock:40, popular:false, desc:"Creamy mayo with crunchy sev" },
  { id:209, name:"Sev Malai Puff",        price:50, cat:"Sev Sing",   emoji:"🫙", stock:35, popular:false, desc:"Malai richness with sev texture" },
  { id:210, name:"Sev Sing Malai Puff",   price:60, cat:"Sev Sing",   emoji:"⭐", stock:35, popular:true,  desc:"Triple combo – rich & indulgent" },
  { id:211, name:"Sev Sing Cheese Puff",  price:60, cat:"Sev Sing",   emoji:"🧀", stock:30, popular:true,  desc:"Ultimate cheese sev sing combo" },
  // PANEER
  { id:301, name:"Paneer Puff",           price:40, cat:"Paneer",     emoji:"🟡", stock:50, popular:false, desc:"Fresh cottage cheese masala filling" },
  { id:302, name:"Sev Paneer Puff",       price:50, cat:"Paneer",     emoji:"🥐", stock:45, popular:true,  desc:"Sev crunch with soft paneer" },
  { id:303, name:"Schezwan Paneer Puff",  price:50, cat:"Paneer",     emoji:"🌶️", stock:40, popular:false, desc:"Spicy Schezwan paneer fusion" },
  { id:304, name:"Garlic Paneer Puff",    price:50, cat:"Paneer",     emoji:"🧄", stock:40, popular:false, desc:"Aromatic garlic with creamy paneer" },
  { id:305, name:"Tandoori Paneer Puff",  price:50, cat:"Paneer",     emoji:"🔴", stock:35, popular:true,  desc:"Smoky tandoori spiced paneer" },
  { id:306, name:"Makhani Paneer Puff",   price:50, cat:"Paneer",     emoji:"🧈", stock:35, popular:false, desc:"Buttery makhani gravy with paneer" },
  { id:307, name:"Chatni Paneer Puff",    price:60, cat:"Paneer",     emoji:"🌿", stock:30, popular:false, desc:"Tangy chatni with cottage cheese" },
  { id:308, name:"Sev Sing Paneer Puff",  price:60, cat:"Paneer",     emoji:"⭐", stock:25, popular:true,  desc:"Ultimate paneer with sev & sing" },
  // MAKHANI
  { id:401, name:"Makhani Puff",          price:30, cat:"Makhani",    emoji:"🧈", stock:55, popular:false, desc:"Rich creamy makhani-inspired filling" },
  { id:402, name:"Makhani Sev Puff",      price:40, cat:"Makhani",    emoji:"🥐", stock:45, popular:false, desc:"Makhani sauce with sev crunch" },
  { id:403, name:"Makhani Paneer Puff",   price:50, cat:"Makhani",    emoji:"🟡", stock:40, popular:true,  desc:"Paneer in creamy makhani" },
  { id:404, name:"Makhani Cheese Puff",   price:50, cat:"Makhani",    emoji:"🧀", stock:35, popular:false, desc:"Melted cheese with makhani base" },
  // MEXICAN
  { id:501, name:"Mexican Puff",          price:40, cat:"Mexican",    emoji:"🌮", stock:50, popular:false, desc:"Zesty Mexican spice blend" },
  { id:502, name:"Mexican Sev Puff",      price:50, cat:"Mexican",    emoji:"🌶️", stock:40, popular:false, desc:"Mexican spice with sev crunch" },
  { id:503, name:"Mexican Sing Puff",     price:50, cat:"Mexican",    emoji:"🥜", stock:40, popular:false, desc:"Mexican & groundnut fusion" },
  { id:504, name:"Mexican Paneer Puff",   price:50, cat:"Mexican",    emoji:"🟡", stock:35, popular:true,  desc:"Paneer with Mexican seasoning" },
  { id:505, name:"Mexican Cheese Puff",   price:60, cat:"Mexican",    emoji:"🧀", stock:30, popular:false, desc:"Cheese with bold Mexican spices" },
  // TANDOORI
  { id:601, name:"Tandoori Puff",         price:30, cat:"Tandoori",   emoji:"🔴", stock:55, popular:false, desc:"Smoky tandoori spiced classic" },
  { id:602, name:"Tandoori Sev Puff",     price:40, cat:"Tandoori",   emoji:"🥐", stock:45, popular:false, desc:"Tandoori flavour with sev" },
  { id:603, name:"Tandoori Paneer Puff",  price:50, cat:"Tandoori",   emoji:"🟡", stock:40, popular:true,  desc:"Tandoori marinated paneer puff" },
  { id:604, name:"Tandoori Cheese Puff",  price:60, cat:"Tandoori",   emoji:"🧀", stock:30, popular:false, desc:"Cheese with smoky tandoori flavour" },
  // PERI PERI
  { id:701, name:"Peri Peri Puff",        price:40, cat:"Peri Peri",  emoji:"🔥", stock:55, popular:true,  desc:"Hot & spicy African-style peri peri" },
  { id:702, name:"Peri Peri Sev Puff",    price:50, cat:"Peri Peri",  emoji:"🌶️", stock:45, popular:false, desc:"Peri peri heat with sev crunch" },
  { id:703, name:"Peri Peri Sing Puff",   price:50, cat:"Peri Peri",  emoji:"🥜", stock:40, popular:false, desc:"Peri peri with groundnut bite" },
  { id:704, name:"Peri Peri Paneer Puff", price:50, cat:"Peri Peri",  emoji:"🟡", stock:35, popular:true,  desc:"Paneer marinated in peri peri" },
  { id:705, name:"Peri Peri Cheese Puff", price:60, cat:"Peri Peri",  emoji:"🧀", stock:30, popular:false, desc:"Cheese with fiery peri peri sauce" },
  // CHEESY
  { id:801, name:"Cheese Spread Puff",    price:40, cat:"Cheesy",     emoji:"🧀", stock:55, popular:false, desc:"Smooth cheese spread in golden puff" },
  { id:802, name:"Cheese Slice Puff",     price:40, cat:"Cheesy",     emoji:"🫓", stock:50, popular:false, desc:"Melted cheese slice in flaky pastry" },
  { id:803, name:"Malai Puff",            price:40, cat:"Cheesy",     emoji:"🫙", stock:45, popular:false, desc:"Creamy malai richness" },
  { id:804, name:"Mayonnaise Puff",       price:40, cat:"Cheesy",     emoji:"🤍", stock:45, popular:false, desc:"Creamy mayonnaise filling" },
  { id:805, name:"Schezwan Malai Puff",   price:50, cat:"Cheesy",     emoji:"🌶️", stock:40, popular:false, desc:"Spicy Schezwan with malai cream" },
  { id:806, name:"Garlic Malai Puff",     price:50, cat:"Cheesy",     emoji:"🧄", stock:40, popular:true,  desc:"Garlic-infused malai cream puff" },
  { id:807, name:"Jalapeno Cheese Puff",  price:50, cat:"Cheesy",     emoji:"🌶️", stock:35, popular:true,  desc:"Spicy jalapenos with melted cheese" },
  { id:808, name:"Schezwan Cheese Puff",  price:50, cat:"Cheesy",     emoji:"🔥", stock:35, popular:false, desc:"Schezwan fire with cheese cooldown" },
  { id:809, name:"Garlic Cheese Puff",    price:50, cat:"Cheesy",     emoji:"🧄", stock:40, popular:false, desc:"Aromatic garlic meets melted cheese" },
  { id:810, name:"Special Cheese Puff",   price:60, cat:"Cheesy",     emoji:"⭐", stock:25, popular:true,  desc:"Chef's special cheese blend puff" },
  // EXOTICS
  { id:901, name:"Butter Cheese Puff",    price:50, cat:"Exotics",    emoji:"🧈", stock:45, popular:false, desc:"Buttery richness with melted cheese" },
  { id:902, name:"Garlic Butter Sev Puff",price:50, cat:"Exotics",    emoji:"🧄", stock:40, popular:false, desc:"Garlic butter & crunchy sev trio" },
  { id:903, name:"Double Cheese Puff",    price:60, cat:"Exotics",    emoji:"🧀", stock:35, popular:true,  desc:"Double the cheese, double the joy!" },
  { id:904, name:"Schezwan Double Cheese",price:70, cat:"Exotics",    emoji:"🔥", stock:25, popular:true,  desc:"Fiery Schezwan with double cheese" },
  { id:905, name:"Garlic Double Cheese",  price:70, cat:"Exotics",    emoji:"🧄", stock:25, popular:false, desc:"Garlic aroma with double cheese" },
  { id:906, name:"Butter Double Cheese",  price:70, cat:"Exotics",    emoji:"🧈", stock:20, popular:false, desc:"Buttery melt with double cheese layers" },
  { id:907, name:"Sev Sing Double Cheese",price:70, cat:"Exotics",    emoji:"⭐", stock:20, popular:true,  desc:"Ultimate sev sing + double cheese" },
  // PUNJABI
  { id:1001,name:"Punjabi Puff",          price:30, cat:"Punjabi",    emoji:"🟠", stock:55, popular:false, desc:"Bold Punjabi masala in golden puff" },
  { id:1002,name:"Punjabi Sev Puff",      price:40, cat:"Punjabi",    emoji:"🥐", stock:45, popular:false, desc:"Punjabi spice with sev crunch" },
  { id:1003,name:"Punjabi Paneer Puff",   price:50, cat:"Punjabi",    emoji:"🟡", stock:40, popular:true,  desc:"Paneer in robust Punjabi masala" },
  { id:1004,name:"Punjabi Cheese Puff",   price:60, cat:"Punjabi",    emoji:"🧀", stock:30, popular:false, desc:"Cheese with Punjabi punch" },
  // SPECIAL
  { id:1101,name:"Nadiad Special Puff",   price:80, cat:"Special",    emoji:"👑", stock:20, popular:true,  desc:"Our legendary signature puff – loaded with special stuffing, cheese & secret sauce" },
];

// ── Persistence ────────────────────────────────────────────────────
function useLS(key, def) {
  const [v, sv] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = useCallback((x) => {
    const n = typeof x === "function" ? x(v) : x;
    sv(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
  }, [v, key]);
  return [v, set];
}

// ── Shared UI Primitives ───────────────────────────────────────────
const solidBtn = (bg = P.orange, sm = false) => ({
  background: `linear-gradient(135deg,${bg}EE,${bg})`,
  color:"#fff", border:"none",
  borderRadius: sm ? 10 : 14,
  padding: sm ? "7px 15px" : "12px 24px",
  fontFamily:"'Nunito',sans-serif", fontWeight:800,
  fontSize: sm ? 12 : 14, cursor:"pointer",
  boxShadow:`0 4px 18px ${bg}55`,
  transition:"all .2s", letterSpacing:".15px",
});
const outlineBtn = (c = P.orange) => ({
  background:"rgba(255,255,255,.07)", color:c,
  border:`1.5px solid ${c}50`, borderRadius:12,
  padding:"9px 18px", fontFamily:"'Nunito',sans-serif",
  fontWeight:800, fontSize:13, cursor:"pointer", transition:"all .2s",
});
const glassInp = {
  border:`1.5px solid ${P.border}`, borderRadius:12,
  padding:"11px 16px", fontFamily:"'Nunito',sans-serif",
  fontSize:14, background:"rgba(255,190,100,.07)", color:P.text,
  width:"100%", transition:"border-color .2s",
};
const glassCard = {
  background:P.bgCard,
  backdropFilter:"blur(12px)",
  WebkitBackdropFilter:"blur(12px)",
  borderRadius:20,
  border:`1px solid ${P.border}`,
  padding:"18px",
  marginBottom:14,
  boxShadow:"0 4px 24px rgba(0,0,0,.35)",
};

// ── Toast ──────────────────────────────────────────────────────────
function Toast({ msg, type="success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2600); return () => clearTimeout(t); }, []);
  const cfg = {
    success:{ bg:"#1E4D3A", icon:"✅" },
    error:  { bg:"#7A1020", icon:"❌" },
    info:   { bg:"#1A3A5C", icon:"ℹ️" },
  }[type] || { bg:"#1E4D3A", icon:"✅" };
  return (
    <div style={{
      position:"fixed", bottom:26, left:"50%",
      animation:"toastIn .4s cubic-bezier(.34,1.56,.64,1) both",
      background:cfg.bg, color:"#fff",
      padding:"13px 26px", borderRadius:40,
      fontWeight:800, fontSize:14, zIndex:9999,
      boxShadow:`0 8px 28px rgba(0,0,0,.5)`,
      whiteSpace:"nowrap", fontFamily:"'Nunito',sans-serif",
      transform:"translateX(-50%)",
      border:"1px solid rgba(255,255,255,.15)",
    }}>
      {cfg.icon} {msg}
    </div>
  );
}

// ── Confirm Modal ──────────────────────────────────────────────────
function ConfirmModal({ msg, onYes, onNo }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,.65)", zIndex:9000,
      display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(6px)",
    }}>
      <div className="pop" style={{
        background:"linear-gradient(135deg,#2A1006,#3A1A0A)",
        borderRadius:24, border:`1px solid ${P.border}`,
        padding:"30px 28px", maxWidth:320, width:"90%", textAlign:"center",
        boxShadow:"0 24px 60px rgba(0,0,0,.6)",
      }}>
        <div style={{ fontSize:44, marginBottom:12 }}>⚠️</div>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15,
          color:P.text, marginBottom:22, lineHeight:1.6 }}>{msg}</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={onNo}  style={outlineBtn("rgba(255,244,232,.4)")}>Cancel</button>
          <button onClick={onYes} style={solidBtn(P.red)}>Yes, Proceed</button>
        </div>
      </div>
    </div>
  );
}

// ── Photo Carousel ─────────────────────────────────────────────────
const CAROUSEL_PHOTOS = [
  {
    url: "https://franchiseopportunities.co.in/wp-content/uploads/2025/10/nadiad-puff-wala-franchise-feature-image.webp",
    label: "Fresh Puffs Daily",
    sub: "Baked live right in front of you",
  },
  {
    url: "https://b.zmtcdn.com/data/pictures/chains/1/20818831/e8c22d99e90e9e3e66ca2ab4c1eba8a2.jpg",
    label: "51+ Varieties",
    sub: "From classic to exotic, we have it all",
  },
  {
    url: "https://b.zmtcdn.com/data/pictures/chains/1/20818831/7e58a2fdf26568d3edb9b18de8d17c60.jpg",
    label: "100% Pure Veg",
    sub: "Only fresh Amul products used",
  },
];

function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i + 1) % CAROUSEL_PHOTOS.length); setFading(false); }, 500);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const photo = CAROUSEL_PHOTOS[idx];
  return (
    <div style={{
      position:"relative", height:186, overflow:"hidden",
      background:"linear-gradient(135deg,#3A1500,#1A0703)",
    }}>
      <img
        key={idx}
        src={photo.url}
        alt={photo.label}
        onError={e => { e.target.style.display = "none"; }}
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center",
          opacity: fading ? 0 : 0.72,
          transition:"opacity .5s ease",
          filter:"brightness(.85) saturate(1.2)",
        }}
      />
      {/* Gradient overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(26,7,3,.95) 0%, rgba(26,7,3,.4) 50%, rgba(26,7,3,.2) 100%)",
      }} />
      {/* Text */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        padding:"18px 20px",
        opacity: fading ? 0 : 1, transition:"opacity .5s ease",
      }}>
        <div style={{
          fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:22,
          color:"#fff", lineHeight:1.1, marginBottom:4,
          textShadow:"0 2px 12px rgba(0,0,0,.8)",
        }}>{photo.label}</div>
        <div style={{ fontSize:12, color:"rgba(255,244,232,.7)", fontWeight:600 }}>{photo.sub}</div>
      </div>
      {/* Dot indicators */}
      <div style={{
        position:"absolute", bottom:14, right:18,
        display:"flex", gap:5,
      }}>
        {CAROUSEL_PHOTOS.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 20 : 6, height:6,
            borderRadius:3, cursor:"pointer",
            background: i === idx ? P.orange : "rgba(255,255,255,.35)",
            transition:"all .3s ease",
          }} />
        ))}
      </div>
      {/* Trust badges */}
      <div style={{
        position:"absolute", top:12, left:16,
        display:"flex", gap:6,
      }}>
        {["🌿 PURE VEG", "🧀 AMUL"].map(badge => (
          <span key={badge} style={{
            background:"rgba(0,0,0,.55)", backdropFilter:"blur(8px)",
            color:"rgba(255,255,255,.9)", borderRadius:20,
            padding:"3px 10px", fontSize:9, fontWeight:800,
            border:"1px solid rgba(255,255,255,.15)",
            letterSpacing:".4px",
          }}>{badge}</span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMER APP
// ══════════════════════════════════════════════════════════════════
function CustomerApp({ menu, onPlaceOrder }) {
  const [cat,     setCat]     = useState("All");
  const [cart,    setCart]    = useState([]);
  const [step,    setStep]    = useState("menu");
  const [search,  setSearch]  = useState("");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [payMode, setPayMode] = useState("UPI");
  const [txnId,   setTxnId]   = useState("");
  const [toast,   setToast]   = useState(null);
  const [orderId, setOrderId] = useState(null);

  const filtered = menu.filter(i =>
    (cat === "All" || i.cat === cat) &&
    (search === "" || i.name.toLowerCase().includes(search.toLowerCase()))
  );
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);

  const addToCart = (item) => {
    if (item.stock <= 0) { setToast({ msg:"Out of stock!", type:"error" }); return; }
    setCart(c => {
      const ex = c.find(x => x.id === item.id);
      return ex ? c.map(x => x.id === item.id ? {...x, qty:x.qty+1} : x) : [...c, {...item, qty:1}];
    });
  };
  const setQty = (id, d) => setCart(c =>
    c.map(i => i.id === id ? {...i, qty:Math.max(0, i.qty+d)} : i).filter(i => i.qty > 0)
  );

  const placeOrder = () => {
    if (!name.trim()) { setToast({ msg:"Enter your name!", type:"error" }); return; }
    if (payMode === "UPI" && !txnId.trim()) { setToast({ msg:"Enter UPI Transaction ID", type:"error" }); return; }
    const oid = Date.now();
    onPlaceOrder({
      id:oid, items:cart, total, customerName:name, customerPhone:phone,
      payMode, txnId, status:"Pending", orderType:"QR Order",
      time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),
      date:new Date().toLocaleDateString("en-IN"),
    });
    setOrderId(oid); setCart([]); setName(""); setPhone(""); setTxnId("");
    setStep("confirm");
  };

  // ── Order Confirmed ────────────────────────────────────────────
  if (step === "confirm") return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at top, #3A1500 0%, #1A0703 60%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:28, fontFamily:"'Nunito',sans-serif",
    }}>
      <div className="pop" style={{ textAlign:"center", maxWidth:360, width:"100%" }}>
        <div style={{ fontSize:90, marginBottom:6, animation:"float 3s ease-in-out infinite" }}>🎉</div>
        <div style={{
          fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:30,
          background:`linear-gradient(135deg,${P.orange},${P.amber})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          marginBottom:8,
        }}>Order Confirmed!</div>
        <div style={{ fontSize:15, color:P.textMid, lineHeight:1.7, marginBottom:22 }}>
          Order <strong style={{ color:P.amber }}>#{String(orderId).slice(-4)}</strong> received!<br/>
          Your fresh puffs are being prepared 🥐
        </div>
        <div style={{
          background:"rgba(46,138,82,.15)", borderRadius:16, padding:"14px 20px",
          marginBottom:28, border:`1px solid rgba(46,138,82,.3)`,
          fontSize:13, color:"#5EC87E", fontWeight:700,
        }}>
          🌿 100% Pure Veg · Fresh Amul Products · Nadiad Special
        </div>
        <button onClick={() => setStep("menu")}
          style={{ ...solidBtn(), width:"100%", padding:14, fontSize:16, borderRadius:18 }}>
          🛒 Order More Puffs
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:"100vh", background:P.bg }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── STICKY HEADER ─────────────────────────────────────── */}
      <div style={{
        background:"linear-gradient(135deg,#7A2000 0%,#C85C24 45%,#E07828 100%)",
        padding:"16px 20px 18px",
        position:"sticky", top:0, zIndex:100,
        boxShadow:"0 6px 32px rgba(120,32,0,.55)",
      }}>
        <div style={{ maxWidth:640, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{
              fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:20, color:"#fff",
              letterSpacing:"-.3px", display:"flex", alignItems:"center", gap:8,
            }}>
              <span style={{ fontSize:24, display:"inline-block", animation:"wiggle 3.5s ease-in-out infinite" }}>🥐</span>
              Nadiad Special Puff
            </div>
            <div style={{ display:"flex", gap:7, marginTop:6, flexWrap:"wrap" }}>
              {["🌿 PURE VEG","📍 Nadiad, Gujarat","🧀 Only Amul"].map(b => (
                <span key={b} style={{
                  background:"rgba(0,0,0,.28)", color:"rgba(255,255,255,.9)",
                  borderRadius:20, padding:"2px 10px", fontSize:9, fontWeight:800,
                  letterSpacing:".3px", border:"1px solid rgba(255,255,255,.15)",
                }}>{b}</span>
              ))}
            </div>
          </div>
          {count > 0 && (
            <button onClick={() => setStep("cart")} style={{
              background:"rgba(255,255,255,.95)", border:"none", borderRadius:14,
              padding:"10px 16px", fontWeight:900, fontSize:14,
              color:P.orange, cursor:"pointer", position:"relative",
              boxShadow:"0 6px 20px rgba(0,0,0,.35)",
              fontFamily:"'Sora',sans-serif",
              animation:"pulse 2.2s ease-in-out infinite",
            }}>
              🛒 ₹{total}
              <span style={{
                position:"absolute", top:-9, right:-9,
                background:P.red, color:"#fff", borderRadius:"50%",
                width:24, height:24, fontSize:11, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 3px 10px rgba(196,32,32,.6)`,
              }}>{count}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MENU ─────────────────────────────────────────────────── */}
      {step === "menu" && (
        <div>
          {/* Photo Carousel */}
          <PhotoCarousel />

          <div style={{ maxWidth:640, margin:"0 auto", padding:"16px" }}>

            {/* Search Bar */}
            <div style={{ position:"relative", marginBottom:14 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
              <input
                style={{ ...glassInp, paddingLeft:44, borderRadius:30 }}
                placeholder="Search puffs… cheese, paneer, garlic…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:P.textFaint, cursor:"pointer", fontSize:20, lineHeight:1,
                }}>×</button>
              )}
            </div>

            {/* Category Pills */}
            {!search && (
              <div className="no-scroll" style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:16 }}>
                {CATS.map(c => {
                  const cfg = CAT_CFG[c];
                  const active = cat === c;
                  return (
                    <button key={c} onClick={() => setCat(c)} style={{
                      flex:"0 0 auto", padding:"8px 16px", borderRadius:24,
                      border:`1.5px solid ${active ? cfg.color : P.border}`,
                      background: active ? cfg.bg : "rgba(255,190,100,.04)",
                      color: active ? cfg.color : P.textSoft,
                      fontWeight:800, fontSize:12, cursor:"pointer",
                      transition:"all .2s", fontFamily:"'Nunito',sans-serif",
                      boxShadow: active ? `0 4px 16px ${cfg.color}35` : "none",
                      whiteSpace:"nowrap",
                    }}>
                      {cfg.icon} {c}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Section title */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:17, color:P.text }}>
                {search ? `Results for "${search}"` : cat === "All" ? "All Puffs 🥐" : `${CAT_CFG[cat].icon} ${cat}`}
              </div>
              <div style={{ fontSize:12, color:P.textFaint, fontWeight:700 }}>{filtered.length} items</div>
            </div>

            {/* Menu Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {filtered.map((item, i) => {
                const cfg = CAT_CFG[item.cat] || CAT_CFG.Regular;
                const inCart = cart.find(c => c.id === item.id);
                const isSpecial = item.cat === "Special";
                return (
                  <div key={item.id}
                    className={`fadeup card-lift${isSpecial ? " gold-glow" : ""}`}
                    style={{
                      animationDelay:`${i*.032}s`,
                      background:P.bgCard,
                      backdropFilter:"blur(10px)",
                      WebkitBackdropFilter:"blur(10px)",
                      borderRadius:18, overflow:"hidden",
                      border:`1.5px solid ${
                        item.stock === 0 ? "rgba(196,32,32,.25)" :
                        isSpecial ? P.borderGold :
                        item.popular ? cfg.color + "45" : P.border
                      }`,
                      opacity: item.stock === 0 ? .45 : 1,
                      boxShadow: item.popular
                        ? `0 6px 24px ${cfg.color}25`
                        : "0 3px 16px rgba(0,0,0,.35)",
                      position:"relative",
                    }}>

                    {/* Popular Badge */}
                    {item.popular && item.stock > 0 && (
                      <div className="hit-badge" style={{
                        position:"absolute", top:8, right:8, zIndex:3,
                        background:`linear-gradient(135deg,#E8620E,#F59C0A)`,
                        color:"#fff", fontSize:9, fontWeight:900,
                        padding:"3px 9px", borderRadius:10,
                        boxShadow:`0 3px 10px rgba(232,98,14,.5)`,
                        letterSpacing:".5px",
                      }}>⭐ HIT</div>
                    )}
                    {isSpecial && (
                      <div style={{
                        position:"absolute", top:8, left:8, zIndex:3,
                        background:"linear-gradient(135deg,#9A6800,#D4A010)",
                        color:"#fff", fontSize:9, fontWeight:900,
                        padding:"3px 9px", borderRadius:10,
                        boxShadow:"0 3px 10px rgba(212,160,16,.5)",
                      }}>★ SIGNATURE</div>
                    )}

                    {/* Emoji zone with warm glow */}
                    <div style={{
                      background:`linear-gradient(160deg,${cfg.bg},rgba(255,190,100,.04))`,
                      padding:"20px 0 15px", textAlign:"center",
                      borderBottom:`1px solid ${cfg.color}20`,
                      position:"relative",
                    }}>
                      <div style={{
                        fontSize:40,
                        filter:`drop-shadow(0 3px 10px ${cfg.color}50)`,
                      }}>{item.emoji}</div>
                    </div>

                    {/* Info */}
                    <div style={{ padding:"12px 12px 14px" }}>
                      <div style={{
                        fontFamily:"'Sora',sans-serif", fontWeight:800,
                        fontSize:12.5, color:P.text, marginBottom:4, lineHeight:1.3,
                      }}>{item.name}</div>
                      <div style={{
                        fontSize:10.5, color:P.textSoft, marginBottom:10,
                        lineHeight:1.45, minHeight:28,
                      }}>{item.desc}</div>

                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{
                          fontFamily:"'Sora',sans-serif", fontWeight:900,
                          fontSize:20, color:cfg.color, letterSpacing:"-.3px",
                        }}>₹{item.price}</div>

                        {item.stock === 0 ? (
                          <span style={{
                            background:P.redL, color:"#FF7070",
                            borderRadius:8, padding:"4px 8px", fontSize:10, fontWeight:800,
                          }}>SOLD OUT</span>
                        ) : inCart ? (
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <button onClick={() => setQty(item.id,-1)} style={{
                              width:28, height:28, borderRadius:8,
                              border:`1.5px solid ${cfg.color}44`,
                              background:"rgba(255,190,100,.08)", color:cfg.color,
                              fontWeight:900, fontSize:16, cursor:"pointer", lineHeight:1,
                            }}>−</button>
                            <span style={{ fontWeight:900, minWidth:20, textAlign:"center", fontSize:14, color:P.text }}>{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} style={{
                              width:28, height:28, borderRadius:8, border:"none",
                              background:cfg.color, color:"#fff",
                              fontWeight:900, fontSize:16, cursor:"pointer", lineHeight:1,
                              boxShadow:`0 3px 10px ${cfg.color}55`,
                            }}>+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)} style={{
                            ...solidBtn(cfg.color, true), padding:"6px 14px",
                            fontSize:11, borderRadius:10,
                          }}>+ Add</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 20px", color:P.textFaint }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:16, color:P.textSoft }}>No puffs found</div>
                <div style={{ fontSize:13, marginTop:6 }}>Try a different search or category</div>
              </div>
            )}

            {count > 0 && (
              <div style={{ position:"sticky", bottom:16, marginTop:20 }}>
                <button onClick={() => setStep("cart")} style={{
                  ...solidBtn(), width:"100%", padding:"15px 20px", fontSize:15,
                  borderRadius:18, letterSpacing:".2px",
                  background:"linear-gradient(135deg,#7A2000,#C85C24,#E07828)",
                  boxShadow:`0 8px 28px rgba(200,92,36,.55)`,
                }}>
                  🛒 View Cart ({count} items) — ₹{total}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CART ─────────────────────────────────────────────────── */}
      {step === "cart" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setStep("menu")} style={{
              ...outlineBtn(P.textSoft), padding:"7px 14px", fontSize:12,
            }}>← Menu</button>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:22, color:P.text }}>Your Cart 🛒</div>
          </div>

          <div style={glassCard}>
            {cart.map(item => {
              const cfg = CAT_CFG[item.cat] || CAT_CFG.Regular;
              return (
                <div key={item.id} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"12px 0", borderBottom:`1px solid ${P.border}`,
                }}>
                  <div style={{
                    width:44, height:44, background:cfg.bg,
                    borderRadius:12, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:22, border:`1px solid ${cfg.color}25`,
                    flexShrink:0,
                  }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:13, color:P.text }}>{item.name}</div>
                    <div style={{ color:cfg.color, fontWeight:800, fontSize:12, marginTop:2 }}>
                      ₹{item.price} × {item.qty} = <span style={{ color:P.amber }}>₹{item.price * item.qty}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={() => setQty(item.id,-1)} style={{
                      width:30, height:30, borderRadius:8,
                      border:`1.5px solid ${P.border}`,
                      background:"rgba(255,190,100,.08)", color:P.orange,
                      fontWeight:900, cursor:"pointer", fontSize:16, lineHeight:1,
                    }}>−</button>
                    <span style={{ fontWeight:900, minWidth:22, textAlign:"center", color:P.text, fontSize:14 }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{
                      width:30, height:30, borderRadius:8, border:"none",
                      background:P.orange, color:"#fff", fontWeight:900, cursor:"pointer", fontSize:16, lineHeight:1,
                    }}>+</button>
                  </div>
                </div>
              );
            })}
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:14 }}>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:20, color:P.textMid }}>Total</span>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:22, color:P.amber }}>₹{total}</span>
            </div>
          </div>

          <div style={glassCard}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:P.text, marginBottom:14 }}>Your Details</div>
            <input style={{ ...glassInp, marginBottom:10 }} placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} />
            <input style={glassInp} placeholder="Phone Number (optional)" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
          </div>

          <button onClick={() => setStep("payment")} style={{ ...solidBtn(), width:"100%", padding:14, fontSize:15, borderRadius:18 }}>
            Proceed to Payment →
          </button>
        </div>
      )}

      {/* ── PAYMENT ──────────────────────────────────────────────── */}
      {step === "payment" && (
        <div style={{ maxWidth:520, margin:"0 auto", padding:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setStep("cart")} style={{ ...outlineBtn(P.textSoft), padding:"7px 14px", fontSize:12 }}>← Cart</button>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:22, color:P.text }}>Payment 💳</div>
          </div>

          <div style={{ ...glassCard, textAlign:"center" }}>
            <div style={{
              fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:46,
              background:`linear-gradient(135deg,${P.orange},${P.amber})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>₹{total}</div>
            <div style={{ fontSize:12, color:P.textSoft, marginTop:3, fontWeight:700 }}>Total Amount to Pay</div>
          </div>

          <div style={glassCard}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:P.text, marginBottom:14 }}>Payment Method</div>
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              {["UPI","Cash"].map(m => (
                <button key={m} onClick={() => setPayMode(m)} style={{
                  flex:1, padding:"14px", borderRadius:14,
                  border:`2px solid ${payMode === m ? P.orange : P.border}`,
                  background: payMode === m ? "rgba(232,98,14,.18)" : "rgba(255,190,100,.04)",
                  fontWeight:800, fontSize:14, cursor:"pointer",
                  color: payMode === m ? P.orange : P.textSoft,
                  fontFamily:"'Nunito',sans-serif", transition:"all .2s",
                }}>
                  {m === "UPI" ? "📱 UPI" : "💵 Cash"}
                </button>
              ))}
            </div>

            {payMode === "UPI" && (
              <div style={{ textAlign:"center" }}>
                <div style={{
                  background:"rgba(255,190,100,.06)", borderRadius:18, padding:"22px",
                  marginBottom:14, border:`1px solid ${P.border}`,
                }}>
                  <div style={{ fontSize:12, fontWeight:700, color:P.textSoft, marginBottom:14 }}>
                    Scan & Pay via any UPI App
                  </div>
                  <div style={{
                    width:140, height:140,
                    background:"rgba(255,255,255,.08)",
                    borderRadius:16, margin:"0 auto 16px",
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    border:`3px solid ${P.orange}44`,
                    fontSize:11, color:P.textSoft, fontWeight:700, lineHeight:1.8,
                  }}>
                    📱<br/>UPI QR Code<br/>Goes Here
                  </div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:16, color:P.amber }}>
                    nadiadpuff@upi
                  </div>
                  <div style={{ fontSize:10, color:P.textFaint, marginTop:4 }}>Replace with your actual UPI ID</div>
                </div>
                <input style={{ ...glassInp, marginBottom:6 }} placeholder="Enter UPI Transaction ID *"
                  value={txnId} onChange={e => setTxnId(e.target.value)} />
                <div style={{ fontSize:11, color:P.textFaint, textAlign:"left", marginLeft:4 }}>
                  Enter the 12-digit transaction ID after payment
                </div>
              </div>
            )}

            {payMode === "Cash" && (
              <div style={{
                background:P.greenL, borderRadius:14, padding:"20px",
                textAlign:"center", border:`1px solid rgba(46,138,82,.35)`,
              }}>
                <div style={{ fontSize:40, marginBottom:10 }}>💵</div>
                <div style={{ fontWeight:800, color:"#5EC87E", fontSize:16 }}>Pay ₹{total} at Counter</div>
                <div style={{ fontSize:12, color:"rgba(94,200,126,.7)", marginTop:8, lineHeight:1.6 }}>
                  Show this screen at the counter to confirm your order
                </div>
              </div>
            )}
          </div>

          <button onClick={placeOrder} style={{
            ...solidBtn(P.green), width:"100%", padding:14, fontSize:15, borderRadius:18,
            background:"linear-gradient(135deg,#1E5C3A,#2E8A52)",
          }}>
            ✅ Confirm & Place Order
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ══════════════════════════════════════════════════════════════════
function AdminLogin({ onLogin, onBack }) {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [err, setErr] = useState(""); const [show, setShow] = useState(false);
  const login = () => {
    const found = ADMINS.find(a => a.username === u && a.password === p);
    if (found) onLogin(found);
    else setErr("Invalid credentials. Staff access only.");
  };
  return (
    <div style={{
      fontFamily:"'Nunito',sans-serif", minHeight:"100vh",
      background:"linear-gradient(160deg,#5A1A00,#8A2E00,#5A1A00)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div className="pop" style={{ width:"100%", maxWidth:380 }}>
        <button onClick={onBack} style={{
          background:"none", border:"none", color:"rgba(255,255,255,.45)",
          cursor:"pointer", fontSize:13, marginBottom:24,
          fontFamily:"'Nunito',sans-serif", fontWeight:700,
        }}>← Back to Menu</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>🔐</div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:30, color:"#FFE8C0" }}>Admin Panel</div>
          <div style={{ color:"rgba(255,220,160,.45)", fontSize:13, marginTop:4 }}>Authorized Staff Only</div>
        </div>
        <div style={{
          background:"rgba(255,255,255,.09)", backdropFilter:"blur(16px)",
          borderRadius:24, padding:"28px", border:"1px solid rgba(255,255,255,.12)",
          boxShadow:"0 20px 60px rgba(0,0,0,.5)",
        }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,220,160,.6)", display:"block", marginBottom:7, letterSpacing:"1px", textTransform:"uppercase" }}>Username</label>
            <input style={glassInp} placeholder="Enter username" value={u}
              onChange={e => setU(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,220,160,.6)", display:"block", marginBottom:7, letterSpacing:"1px", textTransform:"uppercase" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input style={{ ...glassInp, paddingRight:46 }} placeholder="Enter password"
                type={show ? "text" : "password"} value={p}
                onChange={e => setP(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
              <button onClick={() => setShow(s => !s)} style={{
                position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:16,
              }}>{show ? "🙈" : "👁️"}</button>
            </div>
          </div>
          {err && (
            <div style={{
              background:"rgba(200,30,30,.2)", borderRadius:10,
              padding:"10px 14px", color:"#FFAAAA", fontSize:12, marginBottom:16, fontWeight:700,
            }}>⚠️ {err}</div>
          )}
          <button onClick={login} style={{ ...solidBtn(), width:"100%", padding:13, fontSize:15, borderRadius:14 }}>
            Login to Dashboard
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:"rgba(255,220,160,.22)" }}>
          🔒 Only authorized admins can login
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════
function AdminDashboard({ admin, orders, setOrders, menu, setMenu, onLogout }) {
  const [tab, setTab] = useState("orders");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const tabs = [
    { id:"orders",  label:"Orders",  icon:"📋" },
    { id:"menu",    label:"Menu",    icon:"🥐" },
    { id:"reports", label:"Reports", icon:"📊" },
    { id:"suggest", label:"Ideas",   icon:"💡" },
  ];
  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? {...o, status} : o));
    setToast({ msg:`Updated to ${status}`, type:"info" });
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:"100vh", background:P.bg }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && <ConfirmModal msg={confirm.msg} onYes={confirm.yes} onNo={() => setConfirm(null)} />}

      {/* Admin Header */}
      <div style={{
        background:"linear-gradient(135deg,#7A2000,#C85C24)",
        padding:"14px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        position:"sticky", top:0, zIndex:100,
        boxShadow:"0 4px 24px rgba(120,32,0,.5)",
      }}>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:16, color:"#fff" }}>
            🔐 Admin Dashboard
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", marginTop:1, fontWeight:700 }}>
            Logged in as {admin.name}
          </div>
        </div>
        <button onClick={onLogout} style={{
          background:"rgba(255,255,255,.18)", border:"1.5px solid rgba(255,255,255,.25)",
          borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:800,
          color:"#fff", cursor:"pointer",
        }}>Logout</button>
      </div>

      {/* Tab Bar */}
      <div style={{
        display:"flex", background:P.bgAlt,
        borderBottom:`1px solid ${P.border}`,
      }} className="no-scroll">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:"1 0 auto", padding:"13px 8px", border:"none",
            background:"transparent",
            borderBottom:`3px solid ${tab === t.id ? P.orange : "transparent"}`,
            color: tab === t.id ? P.orange : P.textSoft,
            fontWeight:800, fontSize:12, cursor:"pointer",
            fontFamily:"'Nunito',sans-serif", transition:"all .2s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"16px" }}>
        {tab === "orders"  && <AdminOrders orders={orders} onUpdate={updateStatus} />}
        {tab === "menu"    && <AdminMenu menu={menu} setMenu={setMenu} toast={setToast} confirm={setConfirm} />}
        {tab === "reports" && <AdminReports orders={orders} />}
        {tab === "suggest" && <SuggestionTab />}
      </div>
    </div>
  );
}

// ── Admin Orders ───────────────────────────────────────────────────
function AdminOrders({ orders, onUpdate }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Pending","Preparing","Ready","Delivered","Cancelled"];
  const shown = filter === "All" ? [...orders].reverse() : [...orders].filter(o => o.status === filter).reverse();

  return (
    <div>
      <div className="no-scroll" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
        {statuses.map(s => {
          const sc = STATUS_C[s] || { fg:P.orange, bg:"rgba(232,98,14,.15)" };
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              flex:"0 0 auto", padding:"7px 14px", borderRadius:20,
              border:`1.5px solid ${active ? sc.fg : P.border}`,
              background: active ? sc.bg : "rgba(255,190,100,.04)",
              color: active ? sc.fg : P.textSoft,
              fontWeight:800, fontSize:11, cursor:"pointer",
              whiteSpace:"nowrap", fontFamily:"'Nunito',sans-serif", transition:"all .2s",
            }}>{s}</button>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div style={{ textAlign:"center", padding:"50px 20px", color:P.textFaint }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, color:P.textSoft }}>No orders yet</div>
        </div>
      )}

      {shown.map(order => {
        const sc = STATUS_C[order.status] || { fg:P.orange, bg:"rgba(232,98,14,.15)" };
        return (
          <div key={order.id} style={glassCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:15, color:P.text }}>
                  #{String(order.id).slice(-4)} — {order.customerName}
                </div>
                <div style={{ fontSize:11, color:P.textSoft, marginTop:2 }}>
                  {order.date} {order.time} · {order.payMode}
                  {order.payMode === "UPI" && order.txnId && ` · TXN: ${order.txnId}`}
                </div>
              </div>
              <div style={{
                background:sc.bg, color:sc.fg,
                borderRadius:10, padding:"4px 11px", fontSize:11, fontWeight:800, whiteSpace:"nowrap",
                border:`1px solid ${sc.fg}30`,
              }}>{order.status}</div>
            </div>
            <div style={{ marginBottom:10 }}>
              {order.items.map(i => (
                <div key={i.id} style={{ fontSize:12, color:P.textMid, marginBottom:3, fontWeight:600 }}>
                  {i.emoji} {i.name} × {i.qty} — ₹{i.price * i.qty}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:P.amber, fontSize:18 }}>₹{order.total}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["Pending","Preparing","Ready","Delivered","Cancelled"]
                  .filter(s => s !== order.status)
                  .map(s => {
                    const sc2 = STATUS_C[s] || { fg:P.orange, bg:"rgba(232,98,14,.15)" };
                    return (
                      <button key={s} onClick={() => onUpdate(order.id, s)} style={{
                        background:sc2.bg, color:sc2.fg,
                        border:`1px solid ${sc2.fg}35`, borderRadius:8,
                        padding:"5px 11px", fontSize:11, fontWeight:800, cursor:"pointer",
                        fontFamily:"'Nunito',sans-serif",
                      }}>{s}</button>
                    );
                  })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin Menu ─────────────────────────────────────────────────────
function AdminMenu({ menu, setMenu, toast, confirm }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", price:"", cat:"Regular", emoji:"🥐", stock:"50", desc:"" });

  const addItem = () => {
    if (!form.name.trim() || !form.price) { toast({ msg:"Name & price required", type:"error" }); return; }
    setMenu(m => [...m, {
      id:Date.now(), name:form.name.trim(), price:Number(form.price),
      cat:form.cat, emoji:form.emoji, stock:Number(form.stock) || 50,
      desc:form.desc, popular:false,
    }]);
    toast({ msg:`${form.name} added!`, type:"success" });
    setForm({ name:"", price:"", cat:"Regular", emoji:"🥐", stock:"50", desc:"" });
    setShowAdd(false);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:18, color:P.text }}>
          🥐 Menu Items ({menu.length})
        </div>
        <button onClick={() => setShowAdd(s => !s)} style={solidBtn(showAdd ? P.red : P.green, true)}>
          {showAdd ? "✕ Cancel" : "+ Add Item"}
        </button>
      </div>

      {showAdd && (
        <div className="slidein" style={{ ...glassCard, border:`1.5px solid rgba(46,138,82,.4)`, marginBottom:16 }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, marginBottom:14, color:"#5EC87E" }}>Add New Item</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <input style={glassInp} placeholder="Item Name *" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} />
            <input style={glassInp} placeholder="Price ₹ *" type="number" value={form.price} onChange={e => setForm(f => ({...f, price:e.target.value}))} />
            <input style={glassInp} placeholder="Emoji 🥐" value={form.emoji} onChange={e => setForm(f => ({...f, emoji:e.target.value}))} />
            <input style={glassInp} placeholder="Stock qty" type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock:e.target.value}))} />
          </div>
          <select style={{ ...glassInp, marginBottom:10 }} value={form.cat} onChange={e => setForm(f => ({...f, cat:e.target.value}))}>
            {CATS.filter(c => c !== "All").map(c => <option key={c} value={c} style={{ background:"#2A1008" }}>{c}</option>)}
          </select>
          <textarea style={{ ...glassInp, minHeight:60, resize:"vertical", marginBottom:12 }}
            placeholder="Description" value={form.desc} onChange={e => setForm(f => ({...f, desc:e.target.value}))} />
          <button onClick={addItem} style={{ ...solidBtn(P.green), width:"100%" }}>Add to Menu</button>
        </div>
      )}

      {menu.map(item => {
        const cfg = CAT_CFG[item.cat] || CAT_CFG.Regular;
        return (
          <div key={item.id} style={{ ...glassCard, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              fontSize:22, width:40, height:40, textAlign:"center", lineHeight:"40px",
              background:cfg.bg, borderRadius:10, border:`1px solid ${cfg.color}30`,
              flexShrink:0,
            }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:13, color:P.text }}>{item.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
                <span style={{
                  background:cfg.bg, color:cfg.color,
                  borderRadius:8, padding:"2px 9px", fontSize:10, fontWeight:800,
                }}>{item.cat}</span>
                <span style={{ color:P.amber, fontWeight:900, fontSize:13 }}>₹{item.price}</span>
                <span style={{ color:P.textFaint, fontSize:11 }}>Stock: {item.stock}</span>
              </div>
            </div>
            <button style={{ ...solidBtn(P.red, true), padding:"6px 12px", fontSize:11 }}
              onClick={() => confirm({
                msg:`Remove "${item.name}" from menu?`,
                yes:() => { setMenu(m => m.filter(i => i.id !== item.id)); confirm(null); toast({ msg:"Item removed", type:"success" }); },
              })}>🗑️</button>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin Reports ──────────────────────────────────────────────────
function AdminReports({ orders }) {
  const today = new Date().toLocaleDateString("en-IN");
  const valid   = orders.filter(o => o.status !== "Cancelled");
  const todayO  = valid.filter(o => o.date === today);
  const todayS  = todayO.reduce((s,o) => s + o.total, 0);
  const allS    = valid.reduce((s,o) => s + o.total, 0);
  const avgVal  = todayO.length ? Math.round(todayS / todayO.length) : 0;
  const cashPend= orders.filter(o => o.payMode === "Cash" && !["Delivered","Cancelled"].includes(o.status)).reduce((s,o) => s + o.total, 0);

  const itemMap = {};
  todayO.forEach(o => o.items.forEach(i => {
    if (!itemMap[i.name]) itemMap[i.name] = { qty:0, rev:0, emoji:i.emoji };
    itemMap[i.name].qty += i.qty; itemMap[i.name].rev += i.price * i.qty;
  }));
  const topItems = Object.entries(itemMap).sort((a,b) => b[1].rev - a[1].rev).slice(0,8);

  const dayMap = {};
  valid.forEach(o => { dayMap[o.date] = (dayMap[o.date] || 0) + o.total; });
  const days = Object.entries(dayMap).slice(-7);
  const maxD = Math.max(...days.map(d => d[1]), 1);

  const Stat = ({ grad, val, label, icon }) => (
    <div style={{ background:grad, borderRadius:18, padding:"18px", color:"#fff", boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
      <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
      <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:24 }}>{val}</div>
      <div style={{ fontSize:11, opacity:.8, fontWeight:700, marginTop:3 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Stat grad={`linear-gradient(135deg,#7A2000,${P.orange})`}    val={`₹${todayS}`}   label="Today's Sales"   icon="💰" />
        <Stat grad={`linear-gradient(135deg,#1E5C3A,${P.green})`}     val={todayO.length}   label="Today's Orders"  icon="📦" />
        <Stat grad={`linear-gradient(135deg,#1A3A5C,${P.blue})`}      val={`₹${avgVal}`}   label="Avg Order Value" icon="📈" />
        <Stat grad={`linear-gradient(135deg,#7A5000,${P.amber})`}     val={`₹${cashPend}`} label="Cash Pending"    icon="💵" />
      </div>

      <div style={{
        ...glassCard, textAlign:"center",
        border:`1px solid ${P.borderGold}`,
      }}>
        <div style={{ fontSize:28, marginBottom:6 }}>🏆</div>
        <div style={{
          fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:38,
          background:`linear-gradient(135deg,${P.orange},${P.amber})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>₹{allS}</div>
        <div style={{ fontSize:12, color:P.textSoft, fontWeight:700, marginTop:2 }}>
          Total All-Time Revenue · {valid.length} orders
        </div>
      </div>

      {days.length > 0 && (
        <div style={glassCard}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, marginBottom:16, color:P.text }}>
            📊 Sales (Last {days.length} Days)
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
            {days.map(([date, amt]) => (
              <div key={date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:9, fontWeight:800, color:P.orange }}>₹{amt}</div>
                <div style={{
                  width:"100%", background:`linear-gradient(180deg,${P.orange},${P.amber})`,
                  borderRadius:"5px 5px 0 0",
                  height:`${(amt / maxD) * 68}px`, minHeight:4,
                  boxShadow:`0 -4px 16px ${P.orange}40`,
                }} />
                <div style={{ fontSize:8, color:P.textFaint }}>{date.split("/").slice(0,2).join("/")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topItems.length > 0 && (
        <div style={glassCard}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, marginBottom:16, color:P.text }}>
            🏆 Today's Top Sellers
          </div>
          {topItems.map(([name, data], i) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{
                fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:18, width:24,
                color:[P.orange, P.amber, "rgba(255,244,232,.4)"][i] || P.textFaint,
              }}>{i+1}</div>
              <span style={{ fontSize:20 }}>{data.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:13, color:P.text }}>{name}</div>
                <div style={{ fontSize:11, color:P.textSoft }}>{data.qty} sold</div>
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:P.amber, fontSize:17 }}>₹{data.rev}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Growth Ideas ───────────────────────────────────────────────────
function SuggestionTab() {
  const ideas = [
    { icon:"🌟", title:"Loyalty Points System",       desc:"₹10 = 1 point. 50 points = ₹5 off. Drives repeat customers!", color:P.amber,  tag:"Revenue" },
    { icon:"📲", title:"WhatsApp Order Status",        desc:"Auto-notify customers when order is Ready. Reduces counter rush.", color:P.green,  tag:"Experience" },
    { icon:"⏰", title:"Pre-Order / Schedule Order",   desc:"Book puffs for a fixed time — great for office/school rush.", color:P.blue,   tag:"Operations" },
    { icon:"🎂", title:"Combo Meal Deals",             desc:"2 puffs + 1 drink at ₹80. Increases average order value.", color:P.orange, tag:"Revenue" },
    { icon:"📦", title:"Bulk / Party Orders",          desc:"Special form for 10+ puffs with advance payment. Great for events!", color:"#9050C0", tag:"New Revenue" },
    { icon:"⭐", title:"Customer Reviews & Ratings",   desc:"Let customers rate after delivery. Builds trust & social proof.", color:P.amber,  tag:"Trust" },
    { icon:"🎟️", title:"Daily Specials Banner",        desc:"'Puff of the Day' with special price. Creates urgency & excitement.", color:P.green,  tag:"Engagement" },
    { icon:"📊", title:"Low Stock Alerts",             desc:"Admin alert when any item stock drops below 10. Prevent overselling.", color:P.red,    tag:"Operations" },
    { icon:"🛵", title:"Delivery Zone Checker",        desc:"Simple map to show if your area can get delivery. Plan expansion!", color:P.blue,   tag:"Growth" },
    { icon:"🔔", title:"Push Notifications for Deals", desc:"Notify repeat customers about new puffs or discount days.", color:"#9E2A2B", tag:"Marketing" },
  ];
  return (
    <div>
      <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:20, color:P.text, marginBottom:6 }}>
        💡 Growth Ideas for Your Business
      </div>
      <div style={{ fontSize:13, color:P.textSoft, marginBottom:20, lineHeight:1.6 }}>
        10 high-impact features to take Nadiad Puffwala to the next level!
      </div>
      {ideas.map((idea, i) => (
        <div key={i} className="fadeup" style={{
          animationDelay:`${i*.05}s`, ...glassCard,
          border:`1.5px solid ${idea.color}28`, marginBottom:12,
        }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ fontSize:30, flexShrink:0, lineHeight:1, marginTop:2 }}>{idea.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6, marginBottom:6 }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:P.text }}>{idea.title}</div>
                <span style={{ background:idea.color+"1A", color:idea.color, borderRadius:8, padding:"3px 10px", fontSize:10, fontWeight:800, whiteSpace:"nowrap", border:`1px solid ${idea.color}30` }}>{idea.tag}</span>
              </div>
              <div style={{ fontSize:13, color:P.textMid, lineHeight:1.6 }}>{idea.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [menu,   setMenu]   = useLS("nsp_menu_v6",   INIT_MENU);
  const [orders, setOrders] = useLS("nsp_orders_v6", []);
  const [mode,   setMode]   = useState("customer");
  const [admin,  setAdmin]  = useState(null);
  const [showAdminBtn, setShowAdminBtn] = useState(false);

  useEffect(() => { if (!menu?.length) setMenu(INIT_MENU); }, []);

  const onPlaceOrder = (order) => {
    setOrders(os => [...os, order]);
    setMenu(m => m.map(item => {
      const ci = order.items.find(c => c.id === item.id);
      return ci && item.stock !== 999 ? {...item, stock:Math.max(0, item.stock - ci.qty)} : item;
    }));
  };

  if (mode === "adminLogin") return <AdminLogin onLogin={a => { setAdmin(a); setMode("admin"); }} onBack={() => setMode("customer")} />;
  if (mode === "admin" && admin) return (
    <AdminDashboard admin={admin} orders={orders} setOrders={setOrders}
      menu={menu} setMenu={setMenu} onLogout={() => { setAdmin(null); setMode("customer"); }} />
  );

  return (
    <div>
      <CustomerApp menu={menu} onPlaceOrder={onPlaceOrder} />
      {/* Floating Admin Button */}
      <div style={{ position:"fixed", bottom:16, right:16, zIndex:500 }}>
        {showAdminBtn ? (
          <div className="pop" style={{
            display:"flex", gap:8, alignItems:"center",
            background:"linear-gradient(135deg,#2A1006,#3A1A0A)",
            borderRadius:16, padding:"10px 14px",
            boxShadow:"0 8px 32px rgba(0,0,0,.5)",
            border:`1px solid ${P.border}`,
            backdropFilter:"blur(12px)",
          }}>
            <span style={{ fontSize:11, color:P.textSoft, fontFamily:"'Nunito',sans-serif", whiteSpace:"nowrap" }}>Staff</span>
            <button onClick={() => setMode("adminLogin")} style={{ ...solidBtn(P.orange, true), fontSize:12, padding:"6px 14px" }}>
              Admin Login
            </button>
            <button onClick={() => setShowAdminBtn(false)} style={{ background:"none", border:"none", color:P.textFaint, cursor:"pointer", fontSize:20, lineHeight:1 }}>×</button>
          </div>
        ) : (
          <button onClick={() => setShowAdminBtn(true)} style={{
            width:46, height:46, borderRadius:23,
            background:"rgba(255,190,100,.1)", border:`1px solid ${P.border}`,
            fontSize:20, cursor:"pointer",
            boxShadow:"0 4px 18px rgba(0,0,0,.4)", transition:"all .2s",
            backdropFilter:"blur(8px)",
          }}>🔐</button>
        )}
      </div>
    </div>
  );
}
