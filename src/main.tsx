import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, CircleHelp, Menu, Minus, PackageCheck, Plus, Search, ShoppingBag, Truck, X, Star, Heart, ShieldCheck, RotateCcw, CreditCard, Activity, Zap, Shield, TrendingUp, Gauge, Layers } from 'lucide-react';
import hero from './assets/han/hero.webp'; import heroSm from './assets/han/hero-sm.webp'; import logo from './assets/han/logo.webp';
import harden from './assets/han/harden.webp'; import hardenSm from './assets/han/harden-sm.webp'; import socks from './assets/han/socks.webp'; import socksSm from './assets/han/socks-sm.webp'; import sleeve from './assets/han/sleeve.webp'; import sleeveSm from './assets/han/sleeve-sm.webp'; import wristband from './assets/han/wristband.webp'; import wristbandSm from './assets/han/wristband-sm.webp'; import careKit from './assets/han/care-kit.webp'; import careKitSm from './assets/han/care-kit-sm.webp'; import collection from './assets/han/collection.webp'; import collectionSm from './assets/han/collection-sm.webp';
import './styles.css';
import './assets.css';

type Product={id:string;name:string;price:number;category:string;color:string;description:string;image:string;small:string;badge?:string;position?:string};
const products:Product[]=[
 {id:'harden-9',name:'Harden Vol. 9',price:219000,category:'Performance',color:'Core Black / Red',badge:'BEST SELLER',description:'Engineered for explosive first steps, sharp stops and all-fourth-quarter energy.',image:harden,small:hardenSm,position:'center 46%'},
 {id:'elite-socks',name:'Han Elite Socks',price:39000,category:'Accessories',color:'Black / Red',description:'Cushioned where it counts. Locked in where it matters.',image:socks,small:socksSm},
 {id:'compression-sleeve',name:'Compression Sleeve',price:49000,category:'Accessories',color:'White',badge:'NEW',description:'Lightweight compression support with a no-slip, game-ready fit.',image:sleeve,small:sleeveSm},
 {id:'pro-wristband',name:'Pro Wristband',price:29000,category:'Accessories',color:'Crimson',description:'Soft, absorbent, and built for long runs on the court.',image:wristband,small:wristbandSm},
 {id:'court-care',name:'Court Care Kit',price:79000,category:'Care',color:'Black',description:'Keep your footwear pristine with the complete performance care system.',image:careKit,small:careKitSm},
 {id:'starter-pack',name:'Game Day Pack',price:219000,category:'Bundles',color:'Black / Red',badge:'SAVE 15%',description:'A focused set of court essentials, packed for every game.',image:collection,small:collectionSm,position:'center 42%'}
];
const money=(n:number)=>new Intl.NumberFormat('en-US').format(n)+'₮';
type Line={product:Product;qty:number;size:string};
type StoreType={
  cart:Line[];
  add:(p:Product,size?:string,quantity?:number)=>void;
  setQty:(id:string,size:string,qty:number)=>void;
  open:boolean;
  setOpen:(v:boolean)=>void;
  searchOpen:boolean;
  setSearchOpen:(v:boolean)=>void;
  journalOpen:boolean;
  setJournalOpen:(v:boolean)=>void;
  clearCart:()=>void;
};
const Store=createContext<StoreType>({
  cart:[],
  add:()=>{},
  setQty:()=>{},
  open:false,
  setOpen:()=>{},
  searchOpen:false,
  setSearchOpen:()=>{},
  journalOpen:false,
  setJournalOpen:()=>{},
  clearCart:()=>{}
});
const useStore=()=>useContext(Store);
function Provider({children}:{children:React.ReactNode}){
  const[cart,setCart]=useState<Line[]>(()=>{
    try {
      const stored=localStorage.getItem('han_cart');
      return stored?JSON.parse(stored):[];
    } catch {
      return [];
    }
  });
  const[open,setOpen]=useState(false);
  const[searchOpen,setSearchOpen]=useState(false);
  const[journalOpen,setJournalOpen]=useState(false);

  useEffect(()=>{
    localStorage.setItem('han_cart',JSON.stringify(cart));
  },[cart]);

  const add=(product:Product,size='42',quantity=1)=>{
    setCart(c=>{
      const found=c.find(x=>x.product.id===product.id&&x.size===size);
      return found
        ?c.map(x=>x===found?{...x,qty:x.qty+quantity}:x)
        :[...c,{product,qty:quantity,size}]
    });
    setOpen(true);
  };

  const setQty=(id:string,size:string,qty:number)=>setCart(c=>
    qty<1
      ?c.filter(x=>!(x.product.id===id&&x.size===size))
      :c.map(x=>(x.product.id===id&&x.size===size)?{...x,qty}:x)
  );

  const clearCart=()=>setCart([]);

  return (
    <Store.Provider value={{cart,add,setQty,open,setOpen,searchOpen,setSearchOpen,journalOpen,setJournalOpen,clearCart}}>
      {children}
    </Store.Provider>
  );
}
function Logo(){return <img className="brand-logo" src={logo} alt="Han Store"/>}function Visual({p,large=false}:{p:Product;large?:boolean}){return <div className={`visual ${large?'large':''}`}><picture><source media="(max-width: 640px)" srcSet={p.small}/><img src={p.image} alt={p.name} loading={large?'eager':'lazy'} style={{objectPosition:p.position}}/></picture></div>}
function Nav() {
  const { cart, setOpen, setSearchOpen, setJournalOpen } = useStore();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <Link className="brand" to="/" aria-label="Han Store">
          <Logo />
        </Link>
        <nav className={mobile ? 'show' : ''}>
          {['Shop', 'About', 'Contact'].map(x => (
            <NavLink onClick={() => setMobile(false)} to={'/' + x.toLowerCase()} key={x}>
              {x}
            </NavLink>
          ))}
          <a href="#journal" onClick={(e) => { e.preventDefault(); setMobile(false); setJournalOpen(true); }}>Journal</a>
        </nav>
        <div className="nav-actions">
          <button aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={19} />
          </button>
          <button className="bag" onClick={() => setOpen(true)} aria-label="Open cart">
            <ShoppingBag size={19} />
            <em>{cart.reduce((a, x) => a + x.qty, 0)}</em>
          </button>
          <button className="menu" onClick={() => setMobile(!mobile)} aria-label="Menu">
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {mobile && (
        <div className="mobile-nav-backdrop md:hidden" onClick={() => setMobile(false)} />
      )}
    </>
  );
}

function Card({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <motion.article 
      className="product-card" 
      initial={{ opacity: 0, y: 18 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      whileHover={{ y: -6 }}
    >
      {p.badge && <span className="product-card-badge">{p.badge}</span>}
      <Link to={'/product/' + p.id}>
        <Visual p={p} />
      </Link>
      <div className="card-meta">
        <div>
          <span>{p.category}</span>
          <h3>{p.name}</h3>
        </div>
        <b>{money(p.price)}</b>
      </div>
      <div className="card-hover">
        <button className="quick" onClick={() => add(p)}>
          Quick add <Plus size={16} />
        </button>
      </div>
    </motion.article>
  );
}

function Cart() {
  const { cart, setQty, open, setOpen } = useStore();
  const total = cart.reduce((a, x) => a + x.product.price * x.qty, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }}>
            <div className="cart-top">
              <h2>Your Bag <small>({cart.reduce((a, x) => a + x.qty, 0)})</small></h2>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>
            {cart.length ? (
              <div className="cart-lines">
                {cart.map(x => (
                  <div className="cart-line" key={`${x.product.id}-${x.size}`}>
                    <Visual p={x.product} />
                    <div>
                      <h4>{x.product.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '11px', color: '#a4a4a4', fontWeight: 600 }}>Size {x.size}</p>
                      <strong>{money(x.product.price)}</strong>
                      <div className="stepper" style={{ marginTop: '12px' }}>
                        <button onClick={() => setQty(x.product.id, x.size, x.qty - 1)}><Minus size={14} /></button>
                        <span>{x.qty}</span>
                        <button onClick={() => setQty(x.product.id, x.size, x.qty + 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                    <button className="remove" onClick={() => setQty(x.product.id, x.size, 0)}>Remove</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <ShoppingBag />
                <h3>Your bag is waiting.</h3>
                <p>Add something made for the game.</p>
                <Link className="btn light" to="/shop" onClick={() => setOpen(false)}>Shop collection</Link>
              </div>
            )}
            <div className="cart-foot">
              <div>
                <span>Subtotal</span>
                <b>{money(total)}</b>
              </div>
              <small>Shipping and taxes calculated at checkout.</small>
              <Link className="btn red" to="/checkout" onClick={() => setOpen(false)}>Checkout <ArrowRight size={16} /></Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Home() {
  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <section className="hero-cinematic">
        <div className="hero-cinematic-bg">
          <picture>
            <source media="(max-width: 640px)" srcSet={heroSm} />
            <img src={hero} alt="James Harden Vol. 9 campaign" fetchPriority="high" />
          </picture>
        </div>
        <div className="hero-cinematic-overlay" />
        <div className="hero-cinematic-content">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span /> LIMITED LAUNCH / NOW IN MONGOLIA
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Elevate<br /><i>Your Game.</i>
          </motion.h1>
          <motion.p 
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Engineered for explosive first steps, razor-sharp stops, and high-intensity energy. Secure the ultimate court armor for Ulaanbaatar hoopers.
          </motion.p>
          <motion.div 
            className="hero-ctas-new"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link className="btn-premium solid-red" to="/shop">
              Shop Harden Vol. 9 <ArrowRight size={16} />
            </Link>
            <a className="btn-premium outline-white" href="#featured-gear">
              Explore Essentials
            </a>
          </motion.div>
        </div>
        <div className="hero-scroll">
          SCROLL TO EXPLORE <span />
        </div>
      </section>

      {/* 2. Marquee / Strip */}
      <section className="strip">
        <span>AUTHENTIC COURT GEAR ASSURED</span>
        <span>•</span>
        <span>FREE EXPRESS UB DELIVERY OVER 300,000₮</span>
        <span>•</span>
        <span>TESTED BY LOCAL BALLERS</span>
      </section>

      {/* 3. Featured Products Section */}
      <section className="section" id="featured-gear">
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">THE STARTING FIVE</p>
            <h2>Featured <i>gear.</i></h2>
          </div>
          <Link className="text-link-premium" to="/shop">
            View all collections <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid four">
          {products.slice(0, 4).map(p => (
            <Card p={p} key={p.id} />
          ))}
        </div>
      </section>

      {/* 4. Collections Bento Grid Section */}
      <section className="bento-section">
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">CURATED PACKS</p>
            <h2>The collections <i>blueprint.</i></h2>
          </div>
        </div>
        
        <div className="bento-grid">
          {/* Card 1: Harden Vol 9 flagship */}
          <motion.div 
            className="bento-item large"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="bento-item-bg">
              <img src={harden} alt="Harden flagship sneaker" />
            </div>
            <div className="bento-item-overlay" />
            <div className="bento-item-content">
              <span className="bento-tag">FLAGSHIP SHOE</span>
              <h3 className="bento-title">Harden Vol. 9</h3>
              <p className="bento-desc">
                Uncompromising ankle support, responsive cushioning, and dynamic lateral control for elite playmakers.
              </p>
              <Link className="btn-premium outline-white" to="/product/harden-9">
                View Flagship <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Compression Sleeve Accessories */}
          <motion.div 
            className="bento-item medium"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bento-item-bg">
              <img src={sleeve} alt="Compression sleeve" />
            </div>
            <div className="bento-item-overlay" />
            <div className="bento-item-content">
              <span className="bento-tag">PRO ARMOR</span>
              <h3 className="bento-title">Pro <i>Sleeve</i></h3>
              <p className="bento-desc">
                High-tensile compression support to maintain muscle warmth and joint safety.
              </p>
              <Link className="btn-premium outline-white" to="/product/compression-sleeve">
                Discover <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Care kit */}
          <motion.div 
            className="bento-item medium"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="bento-item-bg">
              <img src={careKit} alt="Court Care Kit" />
            </div>
            <div className="bento-item-overlay" />
            <div className="bento-item-content">
              <span className="bento-tag">RETENTION CARE</span>
              <h3 className="bento-title">Court Care</h3>
              <p className="bento-desc">
                Premium sneaker restoration system to keep shoe traction and court grip at 100%.
              </p>
              <Link className="btn-premium outline-white" to="/product/court-care">
                Get Care Kit <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Card 4: Game day pack collection bundle */}
          <motion.div 
            className="bento-item large"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bento-item-bg">
              <img src={collection} alt="Game Day Pack" />
            </div>
            <div className="bento-item-overlay" />
            <div className="bento-item-content">
              <span className="bento-tag">SAVE 15% ON BUNDLE</span>
              <h3 className="bento-title">The Game Day <i>Pack</i></h3>
              <p className="bento-desc">
                Your full court essentials sorted: Harden Vol. 9, Elite Cushion socks, compression sleeve, and wristband in one package.
              </p>
              <Link className="btn-premium solid-red" to="/product/starter-pack">
                Claim Bundle <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Editorial Banner Section */}
      <section className="banner">
        <picture className="banner-image">
          <source media="(max-width: 640px)" srcSet={collectionSm} />
          <img src={collection} alt="Han Store Harden collection" loading="lazy" />
        </picture>
        <div className="banner-shade" />
        <div className="banner-content">
          <p className="eyebrow-premium">BUILT DIFFERENT</p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 700, margin: 0, lineHeight: 0.9 }}>
            Made for the<br /><i>ones who stay.</i>
          </h2>
          <p className="muted">
            Not for the sidelines. Han Store carries authentic, high-caliber court essentials designed to work as hard as your game does.
          </p>
          <Link to="/about" className="btn-premium outline-white">
            Our Story <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="testimonials-section">
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">THE HOOP COMMUNITY</p>
            <h2>Voices from the <i>court.</i></h2>
          </div>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                “The fit of the Harden Vol. 9 is completely locked-in. When I split the pick-and-roll, the traction on the court felt unreal.”
              </p>
            </div>
            <p className="testimonial-author">— TEMUULEN B., NATIONAL LEAGUE</p>
          </div>
          <div className="testimonial-card">
            <div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                “UB cold courts need gear that keeps muscles warm. The compression sleeve and elite socks are absolute essentials for my games.”
              </p>
            </div>
            <p className="testimonial-author">— SARUUL T., AMATEUR LEAGUE</p>
          </div>
          <div className="testimonial-card">
            <div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                “Amazing local service. Got my pair delivered in Ulaanbaatar in under 3 hours, and they helped me get the perfect size.”
              </p>
            </div>
            <p className="testimonial-author">— ANKHBAYAR G., STREETBALLER</p>
          </div>
        </div>
      </section>

      {/* 7. Trust Badges Section */}
      <section className="trust-section">
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">OUR GUARANTEE</p>
            <h2>Elite service <i>assured.</i></h2>
          </div>
        </div>
        <div className="trust-grid">
          <div className="trust-card">
            <span className="trust-card-num">01 / SPEED</span>
            <Truck size={32} />
            <h3>Express Local Courier</h3>
            <p>
              Hand-delivered to your door within 24 hours anywhere in Ulaanbaatar. Your game waits for no one.
            </p>
          </div>
          <div className="trust-card">
            <span className="trust-card-num">02 / SECURE</span>
            <PackageCheck size={32} />
            <h3>100% Authentic Gear</h3>
            <p>
              Sourced directly from verified brand lines. No fakes, no replicas. Genuine court performance only.
            </p>
          </div>
          <div className="trust-card">
            <span className="trust-card-num">03 / TEAM</span>
            <CircleHelp size={32} />
            <h3>Hooper-to-Hooper Support</h3>
            <p>
              Get actual sizing guides and ankle support advice from our local Ulaanbaatar team before you order.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <Newsletter />
    </>
  );
}

function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <section className="newsletter">
        <div className="newsletter-content" style={{ maxWidth: '600px' }}>
          <p className="eyebrow-premium" style={{ color: '#10bb72' }}>✓ YOU'RE ON THE ROSTER</p>
          <h2>Welcome to the <i>team.</i></h2>
          <p style={{ color: '#a4a4a4', fontSize: '14px', marginTop: '16px', lineHeight: 1.6 }}>
            Subscribed successfully! We've added <b>{email}</b> to our launch roster. We'll send you exclusive drop alerts and early access codes.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <p className="eyebrow-premium">STAY IN THE GAME</p>
        <h2>Join the roster.<br /><i>First to move.</i></h2>
        <p style={{ color: '#8e8e93', fontSize: '14px', marginTop: '12px', lineHeight: 1.5 }}>
          Subscribe to secure early access to limited sneaker releases, specialized gear drops, and local tournament schedules.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">YOUR SNEAKER ROSTER EMAIL</label>
        <div>
          <input 
            id="email" 
            placeholder="enter your email address..." 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <button aria-label="Subscribe" type="submit">
            <ArrowRight />
          </button>
        </div>
        <small>By subscribing, you join the Han roster and agree to local drop alerts.</small>
      </form>
    </section>
  );
}
function Shop(){const[filter,setFilter]=useState('All');const cats=['All','Performance','Accessories','Bundles','Care'];const visible=filter==='All'?products:products.filter(p=>p.category===filter);return <main className="page shop"><div className="page-title"><p className="eyebrow">HAN COLLECTION / 2026</p><h1>Made to <i>move.</i></h1><p>Performance essentials for the people who make the court their own.</p></div><div className="filters">{cats.map(x=><button className={filter===x?'selected':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="grid three">{visible.map(p=><Card p={p} key={p.id}/>)}</div></main>}
const productMeta: Record<string, {
  oldPrice: number;
  rating: number;
  reviews: number;
  tagline: string;
  specs: { title: string; value: string; desc: string; iconName: string }[];
  editorial: {
    headline: string;
    subheadline: string;
    body: string;
  };
  thumbnails: { scale: number; origin: string; label: string }[];
}> = {
  'harden-9': {
    oldPrice: 269000,
    rating: 4.9,
    reviews: 148,
    tagline: 'LOCKED IN. UNLEASHED.',
    specs: [
      { title: 'Traction', value: '9.8 / 10', desc: 'Gen-9 multidirectional herringbone blade pattern.', iconName: 'Activity' },
      { title: 'Cushion', value: 'Lightstrike 3D', desc: 'Maximum impact protection & energy return.', iconName: 'Zap' },
      { title: 'Support', value: 'TPU Lockdown Cage', desc: 'Internal lateral band wraps midfoot securely.', iconName: 'Shield' },
      { title: 'Court Feel', value: 'Ultra-Low Profile', desc: 'Direct court connection for lightning quick response.', iconName: 'TrendingUp' },
      { title: 'Weight', value: '385g (Size 42)', desc: 'Stripped back materials to reduce bulk.', iconName: 'Gauge' },
      { title: 'Materials', value: 'Knit & Tech TPU', desc: 'Seamless breathable textile wrap.', iconName: 'Layers' }
    ],
    editorial: {
      headline: 'FUTURE OF THE COURT',
      subheadline: 'Crafted for the elite shift.',
      body: 'Every single line, panel, and stitch of the Harden Vol. 9 is engineered for explosive performance. Tested on Ulaanbaatar courts to withstand relentless cuts and sudden drives. Designed in tandem with James Harden\'s exact specifications.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.5, origin: 'center 46%', label: 'Heel Structure' },
      { scale: 1.8, origin: 'center 20%', label: 'Forefoot Control' },
      { scale: 1.4, origin: 'center 80%', label: 'Outsole Herringbone' }
    ]
  },
  'elite-socks': {
    oldPrice: 49000,
    rating: 4.8,
    reviews: 82,
    tagline: 'CUSHIONED WHERE IT MATTERS.',
    specs: [
      { title: 'Arch Band', value: 'Dynamic Ribbed', desc: 'Snug fit holds the sock in place around your midfoot.', iconName: 'Shield' },
      { title: 'Impact Cushion', value: 'Zone-Padded', desc: 'Extra loops at heel and toe buffer heavy stops.', iconName: 'Zap' },
      { title: 'Breathability', value: 'Dry-Mesh Zones', desc: 'Top-foot ventilation keeps sweat and heat away.', iconName: 'Activity' },
      { title: 'Durability', value: 'Double-Reinforced', desc: 'Double-knit yarn at high friction spots prevents wear.', iconName: 'Layers' },
      { title: 'Grip', value: 'Traction Yarn', desc: 'Specially engineered threads prevent inside-shoe sliding.', iconName: 'TrendingUp' },
      { title: 'Material', value: 'Nylon Blend', desc: '82% Premium Nylon, 15% Polyester, 3% Spandex.', iconName: 'Gauge' }
    ],
    editorial: {
      headline: 'THE ANCHOR OF COMFORT',
      subheadline: 'Zero slip. Maximum grip.',
      body: 'Your shoes are only as good as the socks inside them. Built with thick zoned loop construction, Han Elite Socks provide critical slip-prevention to ensure every ounce of power from your stride is directed onto the wood floor.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.6, origin: 'center 35%', label: 'Cushioned Toe' },
      { scale: 1.5, origin: 'center 75%', label: 'Ankle Ribbing' }
    ]
  },
  'compression-sleeve': {
    oldPrice: 59000,
    rating: 4.7,
    reviews: 56,
    tagline: 'OPTIMIZED CIRCULATION.',
    specs: [
      { title: 'Compression', value: 'Medical-Grade', desc: 'Graduated compression improves blood oxygenation.', iconName: 'Activity' },
      { title: 'Traction Strip', value: 'Silicon Grip', desc: 'Elastic silicone band keeps sleeve secure during motion.', iconName: 'Shield' },
      { title: 'Flexibility', value: '4-Way Stretch', desc: 'Unrestricted range of motion for flawless shooting.', iconName: 'TrendingUp' },
      { title: 'Moisture-Wick', value: 'AeroDry Fabric', desc: 'Fast evaporating fabric keeps skin warm and dry.', iconName: 'Zap' },
      { title: 'Protection', value: 'Abrasion Safe', desc: 'Reinforced flatlock stitching prevents floor-burns.', iconName: 'Layers' },
      { title: 'Composition', value: 'Spandex Infused', desc: 'Polyamide-Spandex weave retains elastic shape.', iconName: 'Gauge' }
    ],
    editorial: {
      headline: 'SHOOTER\'S FAVORITE ARMOR',
      subheadline: 'Maintain core heat.',
      body: 'Cold Ulaanbaatar court temperatures can cause muscle stiffness. This premium arm sleeve keeps your shooting arm warm, maintains blood flow, and provides the psychological compression locked-in feel required to sink corner threes with confidence.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.5, origin: 'center 40%', label: 'Stretch Fabric' },
      { scale: 1.4, origin: 'center 70%', label: 'Silicon Band' }
    ]
  },
  'pro-wristband': {
    oldPrice: 35000,
    rating: 4.9,
    reviews: 34,
    tagline: 'PREVENT SLIP, DOMINATE CONTROL.',
    specs: [
      { title: 'Absorption', value: 'Max-Plush Cotton', desc: 'Extra deep loop fibers capture maximum sweat.', iconName: 'Zap' },
      { title: 'Width', value: 'Wide Format', desc: 'Increased coverage area protects hands from sweat run.', iconName: 'Layers' },
      { title: 'Elasticity', value: 'High-Retention', desc: 'Holds custom fit session after session, wash after wash.', iconName: 'Shield' },
      { title: 'Breathability', value: 'Weft Venting', desc: 'Special vertical air flow lines prevent skin itching.', iconName: 'Activity' },
      { title: 'In-Hand Feel', value: 'Soft Cotton', desc: 'Irritation-free feel, tested on long practice runs.', iconName: 'TrendingUp' },
      { title: 'Fibers', value: 'Organic Blend', desc: 'Combed organic cotton with premium nylon threads.', iconName: 'Gauge' }
    ],
    editorial: {
      headline: 'SWEAT CONTROL FOR INTENSE DRIBBLES',
      subheadline: 'Keep your hands dry.',
      body: 'A single bead of sweat on your palm can cost a crucial turnover. The Pro Wristband absorbs sweat before it reaches your hands, ensuring perfect leather grip on your drives and crossovers.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.5, origin: 'center 45%', label: 'Knit Texture' },
      { scale: 1.4, origin: 'center 60%', label: 'Flex Edge' }
    ]
  },
  'court-care': {
    oldPrice: 99000,
    rating: 4.6,
    reviews: 29,
    tagline: 'RESTORE ORIGINAL GRIP.',
    specs: [
      { title: 'Cleanser', value: 'Bio-Sourced', desc: 'Organic extracts remove dirt without degrading rubber.', iconName: 'Zap' },
      { title: 'Brush', value: 'Medium Bristle', desc: 'Stiff enough for herringbone grooves, soft on leather.', iconName: 'Layers' },
      { title: 'Traction Polish', value: 'Anti-Slip Grip', desc: 'Microscopic polymer coating restores floor grip.', iconName: 'TrendingUp' },
      { title: 'Towel', value: 'Microfiber Tech', desc: 'High absorption loops trap lifted dust instantly.', iconName: 'Shield' },
      { title: 'Safety', value: '100% Non-Toxic', desc: 'Eco-conscious chemical-free formula.', iconName: 'Activity' },
      { title: 'Capacity', value: '150ml Cleanser', desc: 'Over 50 full deep washes per kit.', iconName: 'Gauge' }
    ],
    editorial: {
      headline: 'MAXIMIZE SNEAKER TRACTION',
      subheadline: 'Protect your footwear investment.',
      body: 'Ulaanbaatar dust is the biggest enemy of shoe grip. Our complete Court Care kit lifts dirt from herringbone treads and applies a subtle, non-sticky polymer coating that multiplies traction on dusty court surfaces.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.5, origin: 'center 30%', label: 'Cleanser Gel' },
      { scale: 1.4, origin: 'center 75%', label: 'Premium Brush' }
    ]
  },
  'starter-pack': {
    oldPrice: 259000,
    rating: 4.9,
    reviews: 210,
    tagline: 'ALL IN ONE. GAME READY.',
    specs: [
      { title: 'Bundle Savings', value: 'Save 40,000₮', desc: 'Comprehensive package value compared to single items.', iconName: 'Zap' },
      { title: 'Shoe Armor', value: 'Harden Vol. 9', desc: 'The flagship low-top performance sneaker.', iconName: 'Shield' },
      { title: 'Sleeve', value: 'Comp. Arm Sleeve', desc: 'AeroDry compression to maintain warm blood-flow.', iconName: 'Activity' },
      { title: 'Socks', value: 'Han Elite Socks', desc: 'Thick zoned cushioning around heel and toe.', iconName: 'TrendingUp' },
      { title: 'Wristband', value: 'Pro Crimson band', desc: 'High-absorption wide cotton sweatband.', iconName: 'Layers' },
      { title: 'Convenience', value: 'Single Box Drop', desc: 'Perfect matching colorway gear delivered together.', iconName: 'Gauge' }
    ],
    editorial: {
      headline: 'THE ULTIMATE HOOP BLUEPRINT',
      subheadline: 'Unpack elite status.',
      body: 'Stop gathering performance pieces piece-by-piece. The Game Day Pack combines our flagship Harden Vol. 9 footwear with essential pro sleeves, absorbing wristbands and deep-padded socks to deliver the ultimate aesthetic and technical court outfit.'
    },
    thumbnails: [
      { scale: 1, origin: 'center', label: 'Full View' },
      { scale: 1.5, origin: 'center 42%', label: 'Harden Vol. 9 Focus' },
      { scale: 1.4, origin: 'center 70%', label: 'Accessory Pack' }
    ]
  }
};

function Detail() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const p = products.find(x => pathname.endsWith(x.id)) || products[0];
  const { add } = useStore();
  
  // State variables for customization
  const [size, setSize] = useState('42');
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState('black');
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showSticky, setShowSticky] = useState(false);

  // Load product custom meta config
  const meta = productMeta[p.id] || productMeta['harden-9'];
  const oldPrice = meta.oldPrice;
  const discountPercent = Math.round(((oldPrice - p.price) / oldPrice) * 100);

  // Sync scroll for sticky mobile bar & reset thumbnails
  useEffect(() => {
    setSelectedThumb(0);
    setZoomStyle({});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      setShowSticky(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [p.id]);

  // Wishlist persistence
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('han_wishlist') || '[]');
    setWishlisted(list.includes(p.id));
  }, [p.id]);

  const toggleWishlist = () => {
    const list = JSON.parse(localStorage.getItem('han_wishlist') || '[]');
    let newList;
    if (list.includes(p.id)) {
      newList = list.filter((id: string) => id !== p.id);
      setWishlisted(false);
    } else {
      newList = [...list, p.id];
      setWishlisted(true);
    }
    localStorage.setItem('han_wishlist', JSON.stringify(newList));
  };

  // Recently Viewed persistence
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('han_recent') || '[]');
    const updated = [p.id, ...viewed.filter((id: string) => id !== p.id)].slice(0, 5);
    localStorage.setItem('han_recent', JSON.stringify(updated));

    const recentProducts = updated
      .filter(id => id !== p.id)
      .map(id => products.find(x => x.id === id))
      .filter((x): x is Product => !!x)
      .slice(0, 4);
    setRecentlyViewed(recentProducts);
  }, [p.id]);

  // Handle Zoom Interactivity on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  // Immediate checkout flow
  const handleBuyNow = () => {
    add(p, size, qty);
    navigate('/checkout');
  };

  // Helper for rendering dynamic specs icons
  const renderSpecIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'Gauge': return <Gauge size={20} />;
      case 'Layers': return <Layers size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const activeThumb = meta.thumbnails[selectedThumb] || { scale: 1, origin: 'center' };

  return (
    <main className="page detail">
      {/* Breadcrumb Navigation */}
      <div className="crumb">
        <Link to="/shop">Shop</Link> / <span style={{ color: '#fff' }}>{p.name}</span>
      </div>

      <div className="detail-grid">
        {/* SECTION 1: Large Premium Gallery */}
        <div className="gallery">
          <div 
            className="gallery-interactive-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {p.badge && <span className="gallery-badge">{p.badge}</span>}
            <motion.img 
              key={`${p.id}-${selectedThumb}`}
              src={p.image} 
              alt={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: zoomStyle.transform ? zoomStyle.transform : (activeThumb.scale > 1 ? `scale(${activeThumb.scale})` : undefined),
                transformOrigin: zoomStyle.transformOrigin ? zoomStyle.transformOrigin : activeThumb.origin,
                objectPosition: p.position,
                transition: zoomStyle.transform ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.4s ease',
              }}
            />
          </div>

          {/* Multiple Thumbnails utilizing dynamic crops */}
          <div className="thumbs-list">
            {meta.thumbnails.map((thumb, index) => (
              <button 
                key={index}
                onClick={() => setSelectedThumb(index)}
                className={`thumb-btn ${selectedThumb === index ? 'active' : ''}`}
                aria-label={thumb.label}
              >
                <img 
                  src={p.small} 
                  alt={thumb.label} 
                  style={{
                    transform: thumb.scale > 1 ? `scale(${thumb.scale})` : undefined,
                    transformOrigin: thumb.origin,
                    objectPosition: p.position
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: Purchase Panel & Meta */}
        <div className="product-info">
          <p className="tag">{p.badge || 'PRO PERFORMANCE'}</p>
          <p className="eyebrow" style={{ marginTop: '4px', letterSpacing: '0.1em' }}>{p.category}</p>
          
          <h1 style={{ marginTop: '8px', fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.0 }}>
            {p.name}
          </h1>

          {/* Premium Ratings Area */}
          <div className="premium-rating-container">
            <div className="stars-row">
              <Star size={14} fill="#e5c100" />
              <Star size={14} fill="#e5c100" />
              <Star size={14} fill="#e5c100" />
              <Star size={14} fill="#e5c100" />
              <Star size={14} fill={meta.rating >= 4.9 ? '#e5c100' : 'none'} />
            </div>
            <span className="reviews-count">
              <b>{meta.rating}</b> ({meta.reviews} reviews)
            </span>
          </div>

          {/* Premium Pricing & Discount Banner */}
          <div className="price-row">
            <span className="price-current">{money(p.price)}</span>
            <span className="price-old">{money(oldPrice)}</span>
            <span className="discount-tag">-{discountPercent}% OFF</span>
          </div>

          {/* Glowing stock indicator */}
          <div>
            <div className="premium-stock-indicator">
              <span className="stock-pulse-dot" />
              IN STOCK — READY TO SHIP IN 24HRS
            </div>
          </div>

          <p className="desc">{p.description}</p>
          <div className="divider" style={{ margin: '24px 0' }} />

          {/* SECTION 3: Selectors */}
          {/* Size Selector */}
          <div className="option">
            <label>
              SELECT SIZE 
              <a href="#size-chart" onClick={(e) => { e.preventDefault(); alert("SIZING GUIDE: Fits true to size. If you have wide feet, we recommend ordering half a size up for elite court lock-down."); }}>
                Size Guide
              </a>
            </label>
            <div className="sizes" role="radiogroup" aria-label="Available shoe sizes">
              {['39', '40', '41', '42', '43', '44', '45'].map(x => (
                <button 
                  className={size === x ? 'selected' : ''} 
                  onClick={() => setSize(x)} 
                  key={x}
                  role="radio"
                  aria-checked={size === x}
                  aria-label={`Size ${x}`}
                  style={{ borderRadius: '0px' }}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="option">
            <label>COLOR — <span style={{ color: '#fff', fontWeight: 600 }}>{p.color}</span></label>
            <div className="premium-color-selector">
              <button 
                className={`color-dot-btn black ${color === 'black' ? 'selected' : ''}`}
                onClick={() => setColor('black')}
                aria-label="Select Core Black"
              />
              <button 
                className={`color-dot-btn red ${color === 'red' ? 'selected' : ''}`}
                onClick={() => setColor('red')}
                aria-label="Select Crimson Red"
              />
              <button 
                className={`color-dot-btn white ${color === 'white' ? 'selected' : ''}`}
                onClick={() => setColor('white')}
                aria-label="Select Tech White"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="option" style={{ marginBottom: '32px' }}>
            <label>QUANTITY</label>
            <div className="stepper" style={{ marginTop: '12px', width: 'max-content' }}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease Quantity"
              >
                <Minus size={15} />
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                aria-label="Increase Quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* SECTION 4: Actions CTA Row */}
          <div className="detail-actions">
            <div className="detail-actions-row">
              <button 
                className="btn red" 
                style={{ flex: 1, height: '52px' }}
                onClick={() => add(p, size, qty)}
              >
                ADD TO BAG — {money(p.price * qty)}
              </button>
              
              <motion.button 
                className={`btn-wishlist ${wishlisted ? 'active' : ''}`}
                onClick={toggleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Heart size={20} fill={wishlisted ? "#d60000" : "none"} style={{ color: wishlisted ? "#d60000" : "inherit" }} />
              </motion.button>
            </div>

            <button 
              className="btn btn-buy-now" 
              style={{ width: '100%', height: '52px' }}
              onClick={handleBuyNow}
            >
              BUY IT NOW
            </button>
          </div>

          {/* SECTION 5: Trust Benefits displaying cards */}
          <div className="detail-benefits-grid">
            <div className="benefit-card-premium">
              <ShieldCheck size={20} />
              <h4>100% Authentic</h4>
              <p>Direct from official verified brand lines. Performance assured.</p>
            </div>
            <div className="benefit-card-premium">
              <Truck size={20} />
              <h4>24 Hour Delivery</h4>
              <p>Express courier hand-delivery anywhere in Ulaanbaatar.</p>
            </div>
            <div className="benefit-card-premium">
              <RotateCcw size={20} />
              <h4>Easy Returns</h4>
              <p>No questions asked size exchanges within 14 days.</p>
            </div>
            <div className="benefit-card-premium">
              <CreditCard size={20} />
              <h4>Secure Payment</h4>
              <p>Protected bank transfers & QPay. Pay with absolute safety.</p>
            </div>
          </div>

          {/* Native details foldouts */}
          <details open style={{ marginTop: '24px' }}>
            <summary>Materials & Construction <ChevronDown size={17} /></summary>
            <p>Designed with input from elite division ballers. Utilizes reinforced double-stitching, targeted ventilation panels, and sweat-wicking materials to assure you remain fast, dry, and secure on court.</p>
          </details>
          <details>
            <summary>Ulaanbaatar Shipping Policy <ChevronDown size={17} /></summary>
            <p>We deliver using local express bike messengers. Orders placed before 16:00 are delivered on the same day. Standard delivery rate is flat-rate 5,000₮, free of charge for orders above 300,000₮.</p>
          </details>
        </div>
      </div>

      {/* SECTION 6: Performance Features Specification Cards */}
      <section className="specs-section">
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">LAB-TESTED SPECS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800 }}>
              Performance <i>blueprint.</i>
            </h2>
          </div>
        </div>

        <div className="specs-grid">
          {meta.specs.map((spec, idx) => (
            <div className="spec-card-premium" key={idx}>
              <div className="spec-card-top">
                <span>{spec.title}</span>
                {renderSpecIcon(spec.iconName)}
              </div>
              <div>
                <h3>{spec.value}</h3>
                <p>{spec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Lifestyle Section */}
      <section className="lifestyle-banner-premium">
        <div className="lifestyle-banner-bg">
          <img src={collection} alt="Elite court lifestyle" />
        </div>
        <div className="lifestyle-banner-overlay" />
        <div className="lifestyle-banner-content">
          <p className="lifestyle-tag">{meta.tagline}</p>
          <h2>{meta.editorial.headline}</h2>
          <p className="lifestyle-sub" style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
            {meta.editorial.subheadline}
          </p>
          <p>{meta.editorial.body}</p>
          <Link to="/about" className="btn-premium outline-white" style={{ display: 'inline-flex', padding: '12px 24px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 700 }}>
            Read Our Story
          </Link>
        </div>
      </section>

      {/* SECTION 8: Related Products */}
      <section className="related" style={{ borderTop: '1px solid #1c1c1e', paddingTop: '60px' }}>
        <div className="section-head-premium">
          <div>
            <p className="eyebrow-premium">COMPLETE THE LOOK</p>
            <h2>On the <i>same team.</i></h2>
          </div>
        </div>
        <div className="grid three">
          {products.filter(x => x.id !== p.id).slice(0, 3).map(x => (
            <Card p={x} key={x.id} />
          ))}
        </div>
      </section>

      {/* SECTION 9: Recently Viewed Shelf */}
      {recentlyViewed.length > 0 && (
        <section className="recent-shelf-section">
          <div className="section-head-premium" style={{ marginBottom: '28px' }}>
            <div>
              <p className="eyebrow-premium">PREVIOUS SESSION</p>
              <h2>Recently <i>viewed.</i></h2>
            </div>
          </div>
          <div className="grid four">
            {recentlyViewed.map(item => (
              <Card p={item} key={item.id} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 10: Sticky Mobile Add to Cart Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            className="mobile-sticky-bar md:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <div className="sticky-bar-content">
              <div className="sticky-bar-info">
                <img src={p.small} alt={p.name} />
                <div>
                  <h4>{p.name}</h4>
                  <p>{money(p.price)}</p>
                </div>
              </div>
              <button 
                className="btn red compact" 
                onClick={() => add(p, size, qty)}
              >
                ADD TO BAG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) setQuery('');
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    if (searchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const filtered = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.color.toLowerCase().includes(query.toLowerCase())
      );

  const popular = ['Harden', 'Socks', 'Sleeve', 'Care'];

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div 
            className="backdrop" 
            style={{ zIndex: 110 }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSearchOpen(false)} 
          />
          <motion.div 
            className="search-panel" 
            initial={{ y: '-100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            <div className="search-container">
              <div className="search-header">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products, gear, accessories..." 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoFocus
                />
                <button className="search-close" onClick={() => setSearchOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="search-body">
                {query.trim() === '' ? (
                  <div className="search-popular">
                    <h4>POPULAR SUGGESTIONS</h4>
                    <div className="popular-tags">
                      {popular.map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => setQuery(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="search-results">
                    <h4>SEARCH RESULTS ({filtered.length})</h4>
                    {filtered.length > 0 ? (
                      <div className="results-grid">
                        {filtered.map(p => (
                          <div 
                            key={p.id} 
                            className="search-result-item"
                            onClick={() => {
                              setSearchOpen(false);
                              navigate('/product/' + p.id);
                            }}
                          >
                            <img src={p.small} alt={p.name} />
                            <div>
                              <h3>{p.name}</h3>
                              <p>{p.category} — {p.color}</p>
                              <span>{money(p.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="search-empty">
                        <p>No products found matching "<b>{query}</b>".</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function JournalDrawer() {
  const { journalOpen, setJournalOpen } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setJournalOpen(false);
    };
    if (journalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [journalOpen]);

  const articles = [
    {
      tag: 'CULTURE',
      title: "Ulaanbaatar's Cold Court Chronicles",
      desc: "How streetball thrives in the coldest capital city on earth. Inside the winter division matches, custom-built asphalt, and the communities that refuse to stay off the court.",
      readTime: '5 min read',
      date: 'JULY 2026'
    },
    {
      tag: 'PERFORMANCE',
      title: "Harden Vol. 9: A Deep Sizing & Traction Analysis",
      desc: "Our local division players put James Harden’s ninth signature model to the test on dusty court surfaces. Read our sizing suggestions and rubber compound performance breakdown.",
      readTime: '4 min read',
      date: 'JUNE 2026'
    },
    {
      tag: 'COMMUNITY',
      title: "Behind the Blueprint: Curating Han Collection '26",
      desc: "A conversation with Han Store founder on bringing authentic division gear directly to Mongolia, custom curation, and raising the standard of local performance gear.",
      readTime: '7 min read',
      date: 'MAY 2026'
    }
  ];

  return (
    <AnimatePresence>
      {journalOpen && (
        <>
          <motion.div 
            className="backdrop" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setJournalOpen(false)} 
          />
          <motion.aside 
            className="cart" 
            style={{ maxWidth: '440px' }}
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="cart-top">
              <div>
                <p className="eyebrow-premium" style={{ margin: 0, fontSize: '9px' }}>HAN JOURNAL</p>
                <h2 style={{ marginTop: '2px' }}>Hoop Read<i>.</i></h2>
              </div>
              <button onClick={() => setJournalOpen(false)}><X /></button>
            </div>
            
            <div className="cart-lines" style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
              {articles.map((art, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #1c1c1e', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'monospace', color: '#d60000', marginBottom: '8px', fontWeight: 600 }}>
                    <span>{art.tag}</span>
                    <span style={{ color: '#8e8e93' }}>{art.date}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>{art.title}</h3>
                  <p style={{ fontSize: '13px', color: '#a4a4a4', margin: '0 0 16px', lineHeight: 1.5 }}>{art.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#8e8e93', fontWeight: 500 }}>{art.readTime}</span>
                    <button 
                      style={{ fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => alert(`"${art.title}" is currently a print-exclusive feature for our launch roster members. Keep an eye on your email for digital drops!`)}
                    >
                      Read <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-foot" style={{ background: '#09090b', borderTop: '1px solid #1c1c1e', padding: '24px', position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
              <p style={{ fontSize: '10px', fontFamily: 'monospace', margin: '0 0 4px', fontWeight: 700, color: '#fff' }}>THE HAN SNEAKER ROSTER</p>
              <small style={{ fontSize: '11px', color: '#a4a4a4', lineHeight: 1.4 }}>Exclusive print editions distributed at local Ulaanbaatar tournaments.</small>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Checkout(){
  const { cart, clearCart } = useStore();
  const total = cart.reduce((a, x) => a + x.product.price * x.qty, 0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <main className="confirmation">
        <Check />
        <p className="eyebrow">ORDER RECEIVED</p>
        <h1>You’re in the <i>game.</i></h1>
        <p>Thank you. We’ll text your order confirmation shortly.</p>
        <Link className="btn red" to="/shop" onClick={clearCart}>Keep shopping</Link>
      </main>
    );
  }

  return (
    <main className="checkout">
      <Link className="brand" to="/" aria-label="Han Store">
        <Logo />
      </Link>
      <div className="checkout-grid">
        <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
          <p className="eyebrow">CHECKOUT</p>
          <h1>Almost <i>there.</i></h1>
          <h3>Contact information</h3>
          <div className="fields">
            <input placeholder="Full name" required />
            <input placeholder="Phone number" required />
            <input className="wide" placeholder="Email address (optional)" />
          </div>
          <h3>Delivery address</h3>
          <div className="fields">
            <input placeholder="District" required />
            <input placeholder="Khoroo / Apartment" required />
            <input className="wide" placeholder="Full address" required />
            <textarea className="wide" placeholder="Delivery notes (optional)" />
          </div>
          <h3>Payment</h3>
          <label className="payment">
            <input type="radio" name="pay" defaultChecked /> Bank transfer <span>Secure</span>
          </label>
          <label className="payment">
            <input type="radio" name="pay" /> QPay <span>Coming soon</span>
          </label>
          <button className="btn red submit">Place order <ArrowRight size={16} /></button>
        </form>
        <aside className="order">
          <h3>Order summary</h3>
          {cart.length ? (
            cart.map(x => (
              <div className="order-line" key={`${x.product.id}-${x.size}`}>
                <Visual p={x.product} />
                <span>{x.product.name} (Size {x.size}) × {x.qty}</span>
                <b>{money(x.product.price * x.qty)}</b>
              </div>
            ))
          ) : (
            <p>Your bag is empty.</p>
          )}
          <div className="total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Info({contact=false}:{contact?:boolean}){return <main className="page info"><p className="eyebrow">HAN STORE / ULAANBAATAR</p><h1>{contact?'Let’s talk ':'More than '}<i>{contact?'game.':'a store.'}</i></h1><div className="info-copy">{contact?<><p>Questions about a product, your order or the right fit? Our team is ready.</p><a href="mailto:hello@hanstore.mn">hello@hanstore.mn</a><a href="tel:+97686971130">+976 8697 1130</a></>:<><p>Han Store is a home for Mongolian hoopers. We believe the best gear does more than look good — it gives you the confidence to take the next shot.</p><p>We curate real performance products and court essentials for a community that keeps showing up.</p><Link className="btn red" to="/shop">Shop the collection</Link></>}</div></main>}

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Link className="brand" to="/"><Logo /></Link>
          <p>Built for the court.<br />Made for Mongolia.</p>
        </div>
        <div>
          <p className="eyebrow">EXPLORE</p>
          <Link to="/shop">Shop</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <p className="eyebrow">FOLLOW</p>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">◎ Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">◉ Facebook</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 HAN STORE. ALL RIGHTS RESERVED.</span>
        <span>ULAANBAATAR, MONGOLIA</span>
      </div>
    </footer>
  );
}

function NotFound(){return <main className="notfound"><p className="eyebrow">404 / OUT OF BOUNDS</p><h1>This play<br/>isn’t <i>here.</i></h1><Link className="btn red" to="/">Back to home <ArrowRight size={16}/></Link></main>}

function App() {
  return (
    <Provider>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<Info />} />
        <Route path="/contact" element={<Info contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Cart />
      <SearchModal />
      <JournalDrawer />
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<BrowserRouter><App/></BrowserRouter>);
