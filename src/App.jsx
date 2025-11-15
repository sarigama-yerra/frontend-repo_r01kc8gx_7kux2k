import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Home, LogIn, Plus, Building2, DollarSign, Settings } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar({ onOpenAdmin }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-orange-600">Nova Estates</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#home" className="hover:text-orange-600 transition flex items-center gap-2"><Home size={16}/> Home</a>
          <a href="#properties" className="hover:text-orange-600 transition flex items-center gap-2"><Building2 size={16}/> Properties</a>
          <a href="#offers" className="hover:text-orange-600 transition flex items-center gap-2"><DollarSign size={16}/> Offers</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenAdmin} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition">
            <Settings size={16}/> Admin
          </button>
        </div>
      </div>
    </div>
  )
}

function Hero({ settings }) {
  return (
    <section id="home" className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/UngO8SNLfLcyPG7O/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            {settings?.hero_headline || 'Find your next home'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">
            {settings?.hero_subtitle || 'Browse curated properties across the city.'}
          </motion.p>
          <div className="mt-8 flex gap-4 pointer-events-auto">
            <a href="#properties" className="px-5 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 active:scale-100 transition-all">Browse Properties</a>
            <a href="#offers" className="px-5 py-3 rounded-xl bg-white/90 backdrop-blur border border-gray-200 hover:border-orange-300 hover:scale-105 active:scale-100 transition-all text-gray-800">Make an Offer</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ p, onOffer }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {p.images?.[0] ? (
        <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})` }} />
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-orange-500">No Image</div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <span className="text-orange-600 font-semibold">${new Intl.NumberFormat().format(p.price)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
        <div className="mt-3 text-xs text-gray-500">{p.city}, {p.state}</div>
        <div className="mt-4 flex gap-3">
          <button onClick={() => onOffer(p)} className="px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 transition-transform inline-flex items-center gap-2">
            <DollarSign size={16}/> Offer
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function AdminPanel({ open, onClose }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [token, setToken] = useState(null)
  const [site, setSite] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    fetch(`${API_BASE}/api/settings`).then(r => r.json()).then(setSite)
  }, [open])

  const doLogin = async () => {
    const res = await fetch(`${API_BASE}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (res.ok) {
      const data = await res.json()
      setToken(data.token)
    } else {
      alert('Login failed')
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    const res = await fetch(`${API_BASE}/api/settings`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(site) })
    setSaving(false)
    if (res.ok) {
      const data = await res.json()
      setSite(data)
    } else {
      alert('Save failed')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold flex items-center gap-2 text-orange-600"><Settings size={18}/> Admin Panel</div>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
        </div>
        {!token ? (
          <div className="p-6 grid gap-3">
            <div className="text-sm text-gray-600">Use seeded credentials.</div>
            <input className="border rounded-md px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
            <input type="password" className="border rounded-md px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
            <button onClick={doLogin} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 transition">Login</button>
          </div>
        ) : (
          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Site Name</label>
              <input className="border rounded-md px-3 py-2" value={site?.site_name||''} onChange={e=>setSite({...site, site_name:e.target.value})}/>
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Hero Headline</label>
              <input className="border rounded-md px-3 py-2" value={site?.hero_headline||''} onChange={e=>setSite({...site, hero_headline:e.target.value})}/>
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Hero Subtitle</label>
              <input className="border rounded-md px-3 py-2" value={site?.hero_subtitle||''} onChange={e=>setSite({...site, hero_subtitle:e.target.value})}/>
            </div>
            <button disabled={saving} onClick={saveSettings} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 transition disabled:opacity-60">{saving? 'Saving...':'Save Settings'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

function OfferModal({ open, onClose, property }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  if (!open) return null

  const submit = async () => {
    const res = await fetch(`${API_BASE}/api/offers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ property_id: property.id, buyer_name: name, buyer_email: email, amount: Number(amount), message }) })
    if (res.ok) { onClose(); alert('Offer submitted!') } else { alert('Failed to submit offer') }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b font-semibold text-orange-600">Make an Offer</div>
        <div className="p-4 grid gap-3">
          <div className="text-sm text-gray-600">Property: {property.title}</div>
          <input className="border rounded-md px-3 py-2" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <textarea className="border rounded-md px-3 py-2" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-md bg-gray-100">Cancel</button>
            <button onClick={submit} className="px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 transition">Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [settings, setSettings] = useState(null)
  const [properties, setProperties] = useState([])
  const [offers, setOffers] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then(r=>r.json()).then(setSettings)
    fetch(`${API_BASE}/api/properties`).then(r=>r.json()).then(setProperties)
    fetch(`${API_BASE}/api/offers`).then(r=>r.json()).then(setOffers)
    // seed admin
    fetch(`${API_BASE}/api/admin/seed`, { method: 'POST' }).catch(()=>{})
  }, [])

  const onOffer = (p) => { setSelected(p); setOfferOpen(true) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar onOpenAdmin={() => setPanelOpen(true)} />
      <Hero settings={settings} />

      <section id="properties" className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900"><Building2/> Featured Properties</h2>
            <a href="#" className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 transition"><Plus size={16}/> Add Property (API)</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <PropertyCard key={p.id} p={p} onOffer={onOffer} />
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900"><DollarSign/> Recent Offers</h2>
          <p className="text-gray-600 mt-2">Submit an offer on any property and track its status.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.length === 0 ? (
              <div className="text-sm text-gray-500">No offers yet.</div>
            ) : (
              offers.slice(0,6).map(o => (
                <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{o.buyer_name}</div>
                    <div className="text-sm font-semibold text-orange-600">${new Intl.NumberFormat().format(o.amount)}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Status: {o.status}</div>
                  <div className="text-xs text-gray-500 mt-1">Property: {o.property_id?.slice(0,6)}...</div>
                  {o.message && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{o.message}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <AdminPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} property={selected||{}} />

      <footer className="relative z-10 py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} Nova Estates</footer>
    </div>
  )
}

export default App
