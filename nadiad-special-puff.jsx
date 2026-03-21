import { useState, useEffect, useCallback } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap";
document.head.appendChild(fl);

const ADMINS = [
  { username: "owner",   password: "nadiad@puff1", name: "Owner" },
  { username: "manager", password: "nadiad@puff2", name: "Manager" },
];

const INIT_MENU = [
  { id:1,  name:"Veg Puff",       price:15, cat:"Puffs",  emoji:"🥐", stock:60,  desc:"Crispy flaky pastry with spiced veggies" },
  { id:2,  name:"Paneer Puff",    price:20, cat:"Puffs",  emoji:"🧀", stock:50,  desc:"Stuffed with fresh cottage cheese masala" },
  { id:3,  name:"Cheese Puff",    price:25, cat:"Puffs",  emoji:"🫓", stock:40,  desc:"Melted cheese in golden pastry shell" },
  { id:4,  name:"Aloo Puff",      price:15, cat:"Puffs",  emoji:"🥔", stock:55,  desc:"Classic spiced potato filling" },
  { id:5,  name:"Corn Puff",      price:20, cat:"Puffs",  emoji:"🌽", stock:35,  desc:"Sweet corn with mild spices" },
  { id:6,  name:"Chocolate Puff", price:30, cat:"Sweet",  emoji:"🍫", stock:25,  desc:"Warm chocolate-filled sweet puff" },
  { id:7,  name:"Jam Puff",       price:20, cat:"Sweet",  emoji:"🍓", stock:30,  desc:"Strawberry jam in soft pastry" },
  { id:8,  name:"Plain Tea",      price:10, cat:"Drinks", emoji:"☕", stock:999, desc:"Fresh brewed hot tea" },
  { id:9,  name:"Masala Tea",     price:15, cat:"Drinks", emoji:"🫖", stock:999, desc:"Aromatic spiced masala chai" },
  { id:10, name:"Cold Drink",     price:20, cat:"Drinks", emoji:"🥤", stock:60,  desc:"Chilled cold beverages" },
  { id:11, name:"Water Bottle",   price:15, cat:"Drinks", emoji:"💧", stock:80,  desc:"500ml packaged drinking water" },
];

const CATS = ["All","Puffs","Sweet","Drinks"];
const SC = { Pending:"#E85D04", Preparing:"#F48C06", Ready:"#2D6A4F", Delivered:"#457B9D", Cancelled:"#9E2A2B" };

const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes fadeIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop     { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  .fadein  { animation: fadeIn  .35s ease both }
  .slideup { animation: slideUp .4s  ease both }
  .pop     { animation: pop     .4s  ease both }
  * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-thumb{background:#FFD0A8;border-radius:4px}
  input:focus,select:focus{outline:none;border-color:#E85D04!important;box-shadow:0 0 0 3px rgba(232,93,4,.15)}
  button:active{transform:scale(.97)}
`;
document.head.appendChild(styleEl);

function useLS(key, def) {
  const [v, sv] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; }
    catch { return def; }
  });
  const set = useCallback((x) => {
    const n = typeof x === "function" ? x(v) : x;
    sv(n);
    try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
  }, [v, key]);
  return [v, set];
}

// ─── Shared UI ──────────────────────────────────────────────────────────────
const fillBtn = (c="#E85D04", sm=false) => ({
  background:`linear-gradient(135deg,${c},${c}cc)`, color:"#fff", border:"none",
  borderRadius:sm?8:12, padding:sm?"7px 14px":"11px 22px",
  fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:sm?12:14,
  cursor:"pointer", boxShadow:`0 4px 14px ${c}44`, transition:"all .2s",
});
const outBtn = (c="#E85D04") => ({
  background:"transparent", color:c, border:`2px solid ${c}`, borderRadius:12,
  padding:"9px 18px", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
});
const inp = {
  border:"2px solid #FFE0C8", borderRadius:10, padding:"10px 14px",
  fontFamily:"'Poppins',sans-serif", fontSize:14, background:"#FFF8F0", color:"#2C1810", width:"100%",
};
const cardStyle = {
  background:"#fff", borderRadius:18, padding:"18px",
  boxShadow:"0 2px 16px rgba(44,24,16,.08)", marginBottom:16,
};
const bdg = (c) => ({
  background:c+"22", color:c, borderRadius:20, padding:"3px 11px",
  fontSize:11, fontWeight:700, fontFamily:"'Poppins',sans-serif",
});

function Toast({ msg, type="success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  const bg = { success:"#2D6A4F", error:"#9E2A2B", info:"#457B9D" }[type];
  return (
    <div className="slideup" style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:bg, color:"#fff", padding:"12px 24px", borderRadius:30, fontWeight:700,
      fontSize:14, zIndex:9999, boxShadow:`0 6px 24px ${bg}55`, whiteSpace:"nowrap",
      fontFamily:"'Poppins',sans-serif" }}>
      {type==="success"?"✅ ":type==="error"?"❌ ":"ℹ️ "}{msg}
    </div>
  );
}

function ConfirmModal({ msg, onYes, onNo }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9000,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="pop" style={{ background:"#fff", borderRadius:20, padding:"28px 32px",
        maxWidth:320, width:"90%", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, marginBottom:20, color:"#2C1810" }}>{msg}</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={onNo}  style={outBtn("#BBA99A")}>Cancel</button>
          <button onClick={onYes} style={fillBtn("#E63946")}>Yes, Proceed</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMER APP
// ══════════════════════════════════════════════════════════════════
function CustomerApp({ menu, onPlaceOrder }) {
  const [cat,      setCat]      = useState("All");
  const [cart,     setCart]     = useState([]);
  const [step,     setStep]     = useState("menu");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [payMode,  setPayMode]  = useState("UPI");
  const [txnId,    setTxnId]    = useState("");
  const [toast,    setToast]    = useState(null);
  const [orderId,  setOrderId]  = useState(null);

  const filtered = cat === "All" ? menu : menu.filter(i => i.cat === cat);
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count    = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item) => {
    if (item.stock <= 0) { setToast({ msg:"Out of stock!", type:"error" }); return; }
    setCart(c => {
      const ex = c.find(x => x.id === item.id);
      return ex ? c.map(x => x.id===item.id ? {...x,qty:x.qty+1} : x) : [...c, {...item, qty:1}];
    });
  };
  const setQty = (id, d) => setCart(c => c.map(i => i.id===id ? {...i,qty:Math.max(0,i.qty+d)} : i).filter(i=>i.qty>0));

  const placeOrder = () => {
    if (!name.trim()) { setToast({ msg:"Please enter your name", type:"error" }); return; }
    if (payMode === "UPI" && !txnId.trim()) { setToast({ msg:"Enter UPI Transaction ID", type:"error" }); return; }
    const oid = Date.now();
    onPlaceOrder({
      id: oid, items: cart, total, customerName: name, customerPhone: phone,
      payMode, txnId, status: "Pending", orderType: "QR Order",
      time: new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),
      date: new Date().toLocaleDateString("en-IN"),
    });
    setOrderId(oid);
    setCart([]); setName(""); setPhone(""); setTxnId("");
    setStep("confirm");
  };

  if (step === "confirm") return (
    <div style={{ fontFamily:"'Poppins',sans-serif", minHeight:"100vh", background:"#FFF8F0",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div className="pop" style={{ textAlign:"center", maxWidth:360 }}>
        <div style={{ fontSize:80, marginBottom:12 }}>🎉</div>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:28, color:"#2D6A4F", marginBottom:10 }}>
          Order Placed!
        </div>
        <div style={{ fontSize:14, color:"#6B4C3B", marginBottom:20, lineHeight:1.7 }}>
          Your order <strong style={{color:"#E85D04"}}>#{String(orderId).slice(-4)}</strong> is received!
          We are preparing your fresh puffs 🥐 Please wait at the counter.
        </div>
        <div style={{ background:"#FFF0E6", borderRadius:14, padding:"12px 18px", marginBottom:22,
          border:"2px dashed #E85D04", fontSize:13, color:"#6B4C3B" }}>
          🌿 <strong>100% Pure Veg</strong> · Fresh & Hygienic · Nadiad Special
        </div>
        <button onClick={()=>setStep("menu")} style={{ ...fillBtn(), width:"100%" }}>🛒 Order More</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", minHeight:"100vh", background:"#FFF8F0" }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#E85D04 0%,#F48C06 100%)",
        padding:"16px 20px 18px", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 4px 20px rgba(232,93,4,.3)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:22, color:"#fff", lineHeight:1.1 }}>
              🥐 Nadiad Special Puff
            </div>
            <div style={{ display:"flex", gap:8, marginTop:5, alignItems:"center" }}>
              <span style={{ background:"#2D6A4F", color:"#fff", borderRadius:20, padding:"2px 10px",
                fontSize:10, fontWeight:700 }}>🌿 100% Pure Veg</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.8)" }}>Nadiad, Gujarat</span>
            </div>
          </div>
          {count > 0 && (
            <button onClick={()=>setStep("cart")} style={{ background:"#fff", border:"none", borderRadius:12,
              padding:"10px 16px", fontWeight:800, fontSize:14, color:"#E85D04", cursor:"pointer",
              boxShadow:"0 4px 14px rgba(0,0,0,.15)", position:"relative", fontFamily:"'Poppins',sans-serif" }}>
              🛒 ₹{total}
              <span style={{ position:"absolute", top:-8, right:-8, background:"#E63946", color:"#fff",
                borderRadius:"50%", width:22, height:22, fontSize:11, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center" }}>{count}</span>
            </button>
          )}
        </div>
      </div>

      {step === "menu" && (
        <div style={{ padding:"16px", maxWidth:600, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:16 }}>
            {CATS.map(c => (
              <button key={c} onClick={()=>setCat(c)} style={{ flex:"0 0 auto", padding:"8px 18px",
                borderRadius:20, border:"2px solid",
                borderColor:cat===c?"#E85D04":"#FFD7C4", background:cat===c?"#E85D04":"#fff",
                color:cat===c?"#fff":"#6B4C3B", fontWeight:700, fontSize:13,
                cursor:"pointer", transition:"all .15s", fontFamily:"'Poppins',sans-serif" }}>{c}</button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {filtered.map((item, i) => (
              <div key={item.id} className="fadein" style={{ animationDelay:`${i*.04}s`,
                background:"#fff", borderRadius:16, overflow:"hidden",
                boxShadow:"0 2px 12px rgba(44,24,16,.1)",
                border:`2px solid ${item.stock===0?"#FFB3B3":"#FFF0E6"}`,
                opacity:item.stock===0?.55:1 }}>
                <div style={{ background:"linear-gradient(135deg,#FFF0E6,#FFE0C8)",
                  padding:"16px 0", fontSize:40, textAlign:"center" }}>{item.emoji}</div>
                <div style={{ padding:"12px" }}>
                  <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{item.name}</div>
                  <div style={{ fontSize:11, color:"#BBA99A", marginBottom:10, lineHeight:1.4 }}>{item.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:17, color:"#E85D04" }}>₹{item.price}</span>
                    {item.stock === 0 ? (
                      <span style={bdg("#E63946")}>Out of Stock</span>
                    ) : cart.find(c=>c.id===item.id) ? (
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <button onClick={()=>setQty(item.id,-1)} style={{ width:28,height:28,borderRadius:7,border:"2px solid #FFE0C8",background:"#fff",color:"#E85D04",fontWeight:800,fontSize:15,cursor:"pointer" }}>−</button>
                        <span style={{ fontWeight:800, minWidth:20, textAlign:"center", fontSize:14 }}>{cart.find(c=>c.id===item.id).qty}</span>
                        <button onClick={()=>addToCart(item)} style={{ width:28,height:28,borderRadius:7,border:"none",background:"#E85D04",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer" }}>+</button>
                      </div>
                    ) : (
                      <button onClick={()=>addToCart(item)} style={{ ...fillBtn("#E85D04",true), padding:"6px 14px" }}>+ Add</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {count > 0 && (
            <div style={{ position:"sticky", bottom:16, marginTop:16 }}>
              <button onClick={()=>setStep("cart")} style={{ ...fillBtn(), width:"100%", padding:"14px", fontSize:15 }}>
                🛒 View Cart ({count} items) · ₹{total}
              </button>
            </div>
          )}
        </div>
      )}

      {step === "cart" && (
        <div style={{ padding:"16px", maxWidth:500, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <button onClick={()=>setStep("menu")} style={{ background:"#FFE0C8",border:"none",borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",color:"#E85D04",fontFamily:"'Poppins',sans-serif" }}>← Menu</button>
            <h2 style={{ margin:0, fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:20 }}>Your Cart</h2>
          </div>
          <div style={cardStyle}>
            {cart.map(item => (
              <div key={item.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px dashed #FFE0C8" }}>
                <span style={{ fontSize:22 }}>{item.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{item.name}</div>
                  <div style={{ color:"#E85D04", fontWeight:700, fontSize:13 }}>₹{item.price} × {item.qty} = ₹{item.price*item.qty}</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <button onClick={()=>setQty(item.id,-1)} style={{ width:30,height:30,borderRadius:8,border:"2px solid #FFE0C8",background:"#fff",color:"#E85D04",fontWeight:800,cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:800, minWidth:22, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={()=>addToCart(item)} style={{ width:30,height:30,borderRadius:8,border:"none",background:"#E85D04",color:"#fff",fontWeight:800,cursor:"pointer" }}>+</button>
                </div>
              </div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",paddingTop:14,fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:22 }}>
              <span>Total</span><span style={{ color:"#E85D04" }}>₹{total}</span>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontWeight:700, marginBottom:10 }}>Your Details</div>
            <input style={{ ...inp, marginBottom:10 }} placeholder="Your Name *" value={name} onChange={e=>setName(e.target.value)} />
            <input style={inp} placeholder="WhatsApp Number (for order updates)" value={phone} onChange={e=>setPhone(e.target.value)} type="tel" />
          </div>
          <button onClick={()=>setStep("payment")} style={{ ...fillBtn(), width:"100%", padding:14, fontSize:15 }}>
            Proceed to Payment →
          </button>
        </div>
      )}

      {step === "payment" && (
        <div style={{ padding:"16px", maxWidth:500, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <button onClick={()=>setStep("cart")} style={{ background:"#FFE0C8",border:"none",borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",color:"#E85D04",fontFamily:"'Poppins',sans-serif" }}>← Cart</button>
            <h2 style={{ margin:0, fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:20 }}>Payment</h2>
          </div>
          <div style={{ ...cardStyle, textAlign:"center" }}>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:38, color:"#E85D04" }}>₹{total}</div>
            <div style={{ color:"#BBA99A", fontSize:13 }}>Total Amount to Pay</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontWeight:700, marginBottom:12 }}>Choose Payment Method</div>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              {["UPI","Cash"].map(m => (
                <button key={m} onClick={()=>setPayMode(m)} style={{ flex:1, padding:"13px",
                  borderRadius:12, border:`2px solid ${payMode===m?"#E85D04":"#FFE0C8"}`,
                  background:payMode===m?"#FFF0E6":"#fff", fontWeight:700, fontSize:14,
                  cursor:"pointer", color:payMode===m?"#E85D04":"#6B4C3B",
                  fontFamily:"'Poppins',sans-serif" }}>
                  {m==="UPI"?"📱 UPI":"💵 Cash"}
                </button>
              ))}
            </div>
            {payMode === "UPI" && (
              <div style={{ textAlign:"center" }}>
                <div style={{ background:"linear-gradient(135deg,#FFF0E6,#FFE0C8)", borderRadius:16, padding:"22px 20px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#6B4C3B", marginBottom:12 }}>Scan & Pay via any UPI App</div>
                  <div style={{ width:130, height:130, background:"#fff", borderRadius:14, margin:"0 auto 14px",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    border:"3px solid #E85D04", fontSize:11, color:"#BBA99A", fontWeight:600, lineHeight:1.6 }}>
                    📱<br/>Your UPI QR<br/>Code Goes Here
                  </div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:17, color:"#E85D04" }}>
                    UPI ID: nadiadpuff@upi
                  </div>
                  <div style={{ fontSize:11, color:"#BBA99A", marginTop:4 }}>Replace with your actual UPI ID</div>
                </div>
                <input style={{ ...inp, marginBottom:6 }} placeholder="Enter UPI Transaction ID *"
                  value={txnId} onChange={e=>setTxnId(e.target.value)} />
                <div style={{ fontSize:11, color:"#BBA99A" }}>Enter the 12-digit transaction ID after payment</div>
              </div>
            )}
            {payMode === "Cash" && (
              <div style={{ background:"#F0FFF4", borderRadius:14, padding:"18px", textAlign:"center", border:"2px solid #2D6A4F33" }}>
                <div style={{ fontSize:36, marginBottom:8 }}>💵</div>
                <div style={{ fontWeight:700, color:"#2D6A4F", fontSize:16 }}>Pay ₹{total} at Counter</div>
                <div style={{ fontSize:12, color:"#6B8A74", marginTop:6, lineHeight:1.5 }}>
                  Your order will be confirmed when you pay at the counter. Please show this screen.
                </div>
              </div>
            )}
          </div>
          <button onClick={placeOrder} style={{ ...fillBtn("#2D6A4F"), width:"100%", padding:14, fontSize:15 }}>
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
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const login = () => {
    const found = ADMINS.find(a => a.username === u && a.password === p);
    if (found) onLogin(found);
    else setErr("Invalid credentials. Access restricted to authorized staff only.");
  };

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", minHeight:"100vh",
      background:"linear-gradient(135deg,#1A0F09 0%,#2C1810 50%,#1A0F09 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div className="pop" style={{ width:"100%", maxWidth:380 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"rgba(255,248,240,.5)",
          cursor:"pointer",fontSize:13,marginBottom:20,fontFamily:"'Poppins',sans-serif" }}>← Back to Menu</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>🔐</div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:30, color:"#F48C06" }}>Admin Panel</div>
          <div style={{ color:"rgba(255,248,240,.55)", fontSize:13, marginTop:4 }}>Nadiad Special Puff · Staff Access Only</div>
        </div>
        <div style={{ background:"rgba(255,255,255,.07)", backdropFilter:"blur(10px)", borderRadius:22,
          padding:"28px", border:"1px solid rgba(255,255,255,.1)" }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,248,240,.7)", display:"block", marginBottom:6 }}>Username</label>
            <input style={{ ...inp, background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", color:"#fff" }}
              placeholder="Enter username" value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,248,240,.7)", display:"block", marginBottom:6 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input style={{ ...inp, background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", paddingRight:46 }}
                placeholder="Enter password" type={show?"text":"password"} value={p}
                onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} />
              <button onClick={()=>setShow(!s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16 }}>{show?"🙈":"👁️"}</button>
            </div>
          </div>
          {err && (
            <div style={{ background:"rgba(230,57,70,.15)", border:"1px solid rgba(230,57,70,.3)", borderRadius:10,
              padding:"10px 14px", color:"#FF6B7A", fontSize:12, marginBottom:16 }}>⚠️ {err}</div>
          )}
          <button onClick={login} style={{ ...fillBtn("#E85D04"), width:"100%", padding:13, fontSize:15 }}>
            Login to Dashboard
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:18, fontSize:11, color:"rgba(255,248,240,.3)" }}>
          🔒 Only 2 authorized admins. No new registrations allowed.
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

  const TABS = [
    { id:"orders",    icon:"📋", label:"Orders",    badge: orders.filter(o=>["Pending","Preparing"].includes(o.status)).length },
    { id:"inventory", icon:"📦", label:"Inventory", badge: menu.filter(i=>i.stock<=10&&i.stock!==999).length },
    { id:"menu",      icon:"🍽️", label:"Menu" },
    { id:"reports",   icon:"📊", label:"Reports" },
  ];

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", minHeight:"100vh", background:"#F5F0EB" }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}

      <div style={{ background:"linear-gradient(135deg,#2C1810,#3D2314)", padding:"12px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>
        <div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:22, color:"#F48C06" }}>
            🥐 NSP Admin Dashboard
          </div>
          <div style={{ fontSize:11, color:"rgba(255,248,240,.55)" }}>
            Logged in as <strong style={{color:"#F48C06"}}>{admin.name}</strong> · {new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}
          </div>
        </div>
        <button onClick={onLogout} style={{ background:"rgba(230,57,70,.2)", border:"1px solid rgba(230,57,70,.4)",
          color:"#FF6B7A", borderRadius:10, padding:"8px 16px", fontSize:12, fontWeight:700,
          cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Logout</button>
      </div>

      <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid #EDE0D4", overflowX:"auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:"0 0 auto", padding:"13px 20px", border:"none", background:"none",
            fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer",
            color:tab===t.id?"#E85D04":"#6B4C3B",
            borderBottom:tab===t.id?"3px solid #E85D04":"3px solid transparent",
            transition:"all .2s", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
            {t.icon} {t.label}
            {t.badge > 0 && <span style={{ background:"#E63946",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:800 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:900, margin:"0 auto" }}>
        {tab==="orders"    && <AdminOrders    orders={orders} setOrders={setOrders} setToast={setToast} />}
        {tab==="inventory" && <AdminInventory menu={menu}   setMenu={setMenu}     setToast={setToast} />}
        {tab==="menu"      && <AdminMenu      menu={menu}   setMenu={setMenu}     setToast={setToast} />}
        {tab==="reports"   && <AdminReports   orders={orders} />}
      </div>
    </div>
  );
}

function AdminOrders({ orders, setOrders, setToast }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Pending","Preparing","Ready","Delivered","Cancelled"];
  const filtered = filter==="All" ? [...orders].reverse() : [...orders].filter(o=>o.status===filter).reverse();

  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id===id ? {...o,status} : o));
    setToast({ msg:`Marked as ${status}`, type:"success" });
  };

  const waMsg = (o) => {
    const msg = encodeURIComponent(`🥐 *Nadiad Special Puff*\n\nHi ${o.customerName}! Your order *#${String(o.id).slice(-4)}* is *${o.status}* 🎉\n\n`
      + o.items.map(i=>`• ${i.emoji} ${i.name} × ${i.qty}`).join("\n")
      + `\n\n💰 Total: ₹${o.total}\n${o.status==="Ready"?"✅ Please collect your order at the counter!":"Thank you for ordering! 🙏"}`);
    return `https://wa.me/91${o.customerPhone}?text=${msg}`;
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {["Pending","Preparing","Ready","Delivered"].map((s,i)=>(
          <div key={s} style={{ background:["#E85D04","#F48C06","#2D6A4F","#457B9D"][i], borderRadius:14, padding:"12px 14px", color:"#fff" }}>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:26 }}>{orders.filter(o=>o.status===s).length}</div>
            <div style={{ fontSize:11, fontWeight:600, opacity:.85 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:"7px 16px", borderRadius:20,
            border:"2px solid", borderColor:filter===s?"#E85D04":"#E8DDD5",
            background:filter===s?"#E85D04":"#fff", color:filter===s?"#fff":"#6B4C3B",
            fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>{s}</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div style={{ ...cardStyle, textAlign:"center", color:"#BBA99A", padding:40 }}>No orders here!</div>
      ) : filtered.map(o=>(
        <div key={o.id} style={{ ...cardStyle, borderLeft:`5px solid ${SC[o.status]||"#E85D04"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:18 }}>#{String(o.id).slice(-4)}</span>
              <span style={bdg(SC[o.status]||"#E85D04")}>{o.status}</span>
              <span style={bdg("#8B4513")}>{o.orderType}</span>
              <span style={bdg("#457B9D")}>{o.payMode}</span>
            </div>
            <div style={{ fontSize:12, color:"#BBA99A" }}>{o.date} · {o.time}</div>
          </div>
          <div style={{ fontSize:13, color:"#6B4C3B", marginBottom:4 }}>
            👤 <strong>{o.customerName}</strong>
            {o.customerPhone && <span style={{ marginLeft:8, color:"#25D366" }}>📱 {o.customerPhone}</span>}
            {o.txnId && <span style={{ marginLeft:8, fontSize:11, color:"#BBA99A" }}>UPI: {o.txnId}</span>}
          </div>
          <div style={{ fontSize:13, marginBottom:10, color:"#2C1810", lineHeight:2 }}>
            {o.items.map(i=>`${i.emoji} ${i.name} ×${i.qty}`).join("   •   ")}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:22, color:"#E85D04" }}>₹{o.total}</span>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {o.status==="Pending"    && <button style={fillBtn("#F48C06",true)} onClick={()=>updateStatus(o.id,"Preparing")}>👨‍🍳 Preparing</button>}
              {o.status==="Preparing" && <button style={fillBtn("#2D6A4F",true)} onClick={()=>updateStatus(o.id,"Ready")}>✅ Ready</button>}
              {o.status==="Ready"     && <button style={fillBtn("#457B9D",true)} onClick={()=>updateStatus(o.id,"Delivered")}>🚀 Delivered</button>}
              {!["Cancelled","Delivered"].includes(o.status) && (
                <button style={fillBtn("#9E2A2B",true)} onClick={()=>updateStatus(o.id,"Cancelled")}>✕ Cancel</button>
              )}
              {o.customerPhone?.length===10 && (
                <a href={waMsg(o)} target="_blank" rel="noreferrer"
                  style={{ ...fillBtn("#25D366",true), textDecoration:"none", display:"inline-block" }}>📲 WhatsApp</a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminInventory({ menu, setMenu, setToast }) {
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const low = menu.filter(i => i.stock<=10 && i.stock!==999);

  const save = (id) => {
    setMenu(m => m.map(i => i.id===id ? {...i,stock:parseInt(editVal)||0} : i));
    setEditId(null);
    setToast({ msg:"Stock updated!", type:"success" });
  };

  return (
    <div>
      {low.length > 0 && (
        <div style={{ background:"#FFF3CD", border:"2px solid #F48C06", borderRadius:14, padding:"14px 18px", marginBottom:16 }}>
          <strong style={{ color:"#F48C06" }}>⚠️ Low Stock Alert!</strong>
          <div style={{ fontSize:13, marginTop:6, lineHeight:1.8 }}>
            {low.map(i=>`${i.emoji} ${i.name} (${i.stock} left)`).join("   •   ")}
          </div>
        </div>
      )}
      <div style={cardStyle}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:18, marginBottom:14 }}>📦 Stock Management</div>
        {menu.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 0", borderBottom:"1px solid #EDE0D4", flexWrap:"wrap" }}>
            <span style={{ fontSize:24 }}>{item.emoji}</span>
            <div style={{ flex:1, minWidth:130 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{item.name}</div>
              <div style={{ display:"flex", gap:8, marginTop:3 }}>
                <span style={bdg("#8B4513")}>{item.cat}</span>
                <span style={{ fontWeight:700, color:"#E85D04", fontSize:13 }}>₹{item.price}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {editId===item.id ? (
                <>
                  <input style={{ ...inp, width:80 }} type="number" value={editVal}
                    onChange={e=>setEditVal(e.target.value)} autoFocus
                    onKeyDown={e=>e.key==="Enter"&&save(item.id)} />
                  <button style={fillBtn("#2D6A4F",true)} onClick={()=>save(item.id)}>Save</button>
                  <button style={fillBtn("#BBA99A",true)} onClick={()=>setEditId(null)}>✕</button>
                </>
              ) : (
                <>
                  <span style={bdg(item.stock===999?"#457B9D":item.stock===0?"#9E2A2B":item.stock<=10?"#F48C06":"#2D6A4F")}>
                    {item.stock===999?"Unlimited":`${item.stock} left`}
                  </span>
                  {item.stock !== 999 && (
                    <button style={fillBtn("#F48C06",true)} onClick={()=>{setEditId(item.id);setEditVal(item.stock);}}>✏️ Edit</button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminMenu({ menu, setMenu, setToast }) {
  const [form, setForm] = useState({ name:"",price:"",stock:"",cat:"Puffs",emoji:"🥐",desc:"" });
  const [confirm, setConfirm] = useState(null);

  const add = () => {
    if (!form.name||!form.price) { setToast({ msg:"Name & price required!", type:"error" }); return; }
    setMenu(m=>[...m,{ ...form, id:Date.now(), price:parseInt(form.price), stock:parseInt(form.stock)||0 }]);
    setForm({ name:"",price:"",stock:"",cat:"Puffs",emoji:"🥐",desc:"" });
    setToast({ msg:"Item added!", type:"success" });
  };

  const remove = (id) => { setMenu(m=>m.filter(i=>i.id!==id)); setConfirm(null); setToast({ msg:"Item removed", type:"info" }); };

  return (
    <div>
      {confirm && <ConfirmModal msg={`Remove "${confirm.name}" from menu?`} onYes={()=>remove(confirm.id)} onNo={()=>setConfirm(null)} />}
      <div style={cardStyle}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:18, marginBottom:14 }}>➕ Add New Menu Item</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <input style={inp} placeholder="Item Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input style={inp} placeholder="Price ₹ *" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
          <input style={inp} placeholder="Initial Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
          <input style={inp} placeholder="Emoji icon" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} />
          <select style={inp} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
            {["Puffs","Sweet","Drinks"].map(c=><option key={c}>{c}</option>)}
          </select>
          <input style={inp} placeholder="Short description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} />
        </div>
        <button style={fillBtn()} onClick={add}>Add to Menu</button>
      </div>
      <div style={cardStyle}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:18, marginBottom:14 }}>🌿 Current Menu (Pure Veg)</div>
        {menu.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:"1px solid #EDE0D4", flexWrap:"wrap" }}>
            <span style={{ fontSize:22 }}>{item.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{item.name}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:3 }}>
                <span style={bdg("#8B4513")}>{item.cat}</span>
                <span style={{ color:"#E85D04", fontWeight:700, fontSize:13 }}>₹{item.price}</span>
                {item.desc && <span style={{ fontSize:11, color:"#BBA99A" }}>{item.desc}</span>}
              </div>
            </div>
            <button style={fillBtn("#9E2A2B",true)} onClick={()=>setConfirm(item)}>🗑️ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReports({ orders }) {
  const today = new Date().toLocaleDateString("en-IN");
  const valid  = orders.filter(o=>o.status!=="Cancelled");
  const todayO = valid.filter(o=>o.date===today);
  const todayS = todayO.reduce((s,o)=>s+o.total,0);
  const allS   = valid.reduce((s,o)=>s+o.total,0);
  const avgVal = todayO.length ? Math.round(todayS/todayO.length) : 0;
  const cashPending = orders.filter(o=>o.payMode==="Cash"&&!["Delivered","Cancelled"].includes(o.status)).reduce((s,o)=>s+o.total,0);

  const itemMap = {};
  todayO.forEach(o=>o.items.forEach(i=>{
    if (!itemMap[i.name]) itemMap[i.name]={qty:0,rev:0,emoji:i.emoji};
    itemMap[i.name].qty+=i.qty; itemMap[i.name].rev+=i.price*i.qty;
  }));
  const topItems = Object.entries(itemMap).sort((a,b)=>b[1].rev-a[1].rev);

  const dayMap = {};
  valid.forEach(o=>{ dayMap[o.date]=(dayMap[o.date]||0)+o.total; });
  const days  = Object.entries(dayMap).slice(-7);
  const maxD  = Math.max(...days.map(d=>d[1]),1);

  const Stat = ({bg,val,label}) => (
    <div style={{ background:bg, borderRadius:14, padding:"14px 16px", color:"#fff" }}>
      <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:26 }}>{val}</div>
      <div style={{ fontSize:12, opacity:.85, fontWeight:600, marginTop:2 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Stat bg="linear-gradient(135deg,#E85D04,#F48C06)" val={`₹${todayS}`}  label="Today's Sales" />
        <Stat bg="linear-gradient(135deg,#2D6A4F,#40916C)" val={todayO.length}  label="Today's Orders" />
        <Stat bg="linear-gradient(135deg,#457B9D,#1D3557)" val={`₹${avgVal}`}  label="Avg Order Value" />
        <Stat bg="linear-gradient(135deg,#8B4513,#A0522D)" val={`₹${cashPending}`} label="Cash Pending" />
      </div>
      <div style={{ ...cardStyle, background:"linear-gradient(135deg,#2C1810,#3D2314)", marginBottom:16 }}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:900, fontSize:32, color:"#F48C06" }}>₹{allS}</div>
        <div style={{ fontSize:13, color:"rgba(255,248,240,.7)", fontWeight:600, marginTop:2 }}>
          Total Revenue All-Time · {valid.length} orders
        </div>
      </div>

      {days.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:17, marginBottom:14 }}>📊 Sales Chart (Last {days.length} Days)</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:110 }}>
            {days.map(([date,amt])=>(
              <div key={date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#E85D04" }}>₹{amt}</div>
                <div style={{ width:"100%", background:"linear-gradient(180deg,#E85D04,#F48C06)", borderRadius:"6px 6px 0 0",
                  height:`${(amt/maxD)*70}px`, minHeight:4 }} />
                <div style={{ fontSize:9, color:"#BBA99A" }}>{date.split("/").slice(0,2).join("/")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topItems.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:17, marginBottom:14 }}>🏆 Today's Top Sellers</div>
          {topItems.map(([name,data],i)=>(
            <div key={name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:18,
                color:["#E85D04","#F48C06","#8B4513"][i]||"#BBA99A", width:24 }}>{i+1}</div>
              <span style={{ fontSize:20 }}>{data.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{name}</div>
                <div style={{ fontSize:12, color:"#BBA99A" }}>{data.qty} sold</div>
              </div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, color:"#E85D04", fontSize:17 }}>₹{data.rev}</div>
            </div>
          ))}
        </div>
      )}

      {orders.length===0 && (
        <div style={{ ...cardStyle, textAlign:"center", color:"#BBA99A", padding:40 }}>No data yet. Orders will appear here!</div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [menu,   setMenu]   = useLS("nsp_menu_v3",   INIT_MENU);
  const [orders, setOrders] = useLS("nsp_orders_v3", []);
  const [mode,   setMode]   = useState("customer");
  const [admin,  setAdmin]  = useState(null);
  const [showAdminBtn, setShowAdminBtn] = useState(false);

  useEffect(() => { if (!menu?.length) setMenu(INIT_MENU); }, []);

  const onPlaceOrder = (order) => {
    setOrders(os => [...os, order]);
    setMenu(m => m.map(item => {
      const ci = order.items.find(c => c.id===item.id);
      return ci && item.stock!==999 ? {...item, stock:Math.max(0,item.stock-ci.qty)} : item;
    }));
  };

  if (mode === "adminLogin") return <AdminLogin onLogin={a=>{setAdmin(a);setMode("admin");}} onBack={()=>setMode("customer")} />;
  if (mode === "admin" && admin) return (
    <AdminDashboard admin={admin} orders={orders} setOrders={setOrders}
      menu={menu} setMenu={setMenu} onLogout={()=>{setAdmin(null);setMode("customer");}} />
  );

  return (
    <div>
      <CustomerApp menu={menu} onPlaceOrder={onPlaceOrder} />
      {/* Floating Admin Access */}
      <div style={{ position:"fixed", bottom:16, right:16, zIndex:500 }}>
        {showAdminBtn ? (
          <div className="pop" style={{ display:"flex", gap:8, alignItems:"center",
            background:"rgba(28,18,10,.95)", borderRadius:14, padding:"10px 14px",
            boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
            <span style={{ fontSize:12, color:"rgba(255,248,240,.6)", fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>Staff access</span>
            <button onClick={()=>setMode("adminLogin")} style={{ ...fillBtn("#F48C06",true), fontSize:12, padding:"6px 14px" }}>
              Admin Login
            </button>
            <button onClick={()=>setShowAdminBtn(false)} style={{ background:"none",border:"none",color:"rgba(255,248,240,.4)",cursor:"pointer",fontSize:18,lineHeight:1 }}>×</button>
          </div>
        ) : (
          <button onClick={()=>setShowAdminBtn(true)} title="Staff Login"
            style={{ width:46, height:46, borderRadius:23, background:"rgba(28,18,10,.75)",
              border:"none", fontSize:20, cursor:"pointer", backdropFilter:"blur(8px)",
              boxShadow:"0 4px 16px rgba(0,0,0,.35)", transition:"all .2s" }}>🔐</button>
        )}
      </div>
    </div>
  );
}
