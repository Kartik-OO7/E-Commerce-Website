import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, rupee } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { token } = useAuth();
  const { items, total, clear } = useCart();
  const [f, setF] = useState({ fullName: '', address: '', city: '', postalCode: '', phone: '' });
  const [payment, setPayment] = useState('COD');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (!items.length) return <p>Nothing to check out. <Link to="/">Browse products</Link></p>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await api('/orders', { method: 'POST', token, body: {
        items: items.map((i) => ({ product: i._id, qty: i.qty })), shipping: f, paymentMethod: payment,
      } });
      clear();
      nav('/orders', { state: { placed: true } });
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };

  return (
    <div className="two">
      <form onSubmit={submit} className="form">
        <h1>Shipping details</h1>
        <input required placeholder="Full name" value={f.fullName} onChange={set('fullName')} />
        <input required placeholder="Address" value={f.address} onChange={set('address')} />
        <input required placeholder="City" value={f.city} onChange={set('city')} />
        <input required placeholder="Postal code" pattern="[0-9]{6}" title="6 digit PIN code" value={f.postalCode} onChange={set('postalCode')} />
        <input required placeholder="Phone" pattern="[0-9]{10}" title="10 digit number" value={f.phone} onChange={set('phone')} />
        <label><input type="radio" checked={payment === 'COD'} onChange={() => setPayment('COD')} /> Cash on delivery</label>
        <label><input type="radio" checked={payment === 'ONLINE'} onChange={() => setPayment('ONLINE')} /> Online (demo, no real payment)</label>
        {err && <p className="err">{err}</p>}
        <button disabled={busy}>{busy ? 'Placing order...' : `Place order (${rupee(total)})`}</button>
      </form>
      <aside className="summary">
        <h2>Order summary</h2>
        {items.map((i) => <div key={i._id} className="row"><span>{i.name} x {i.qty}</span><span>{rupee(i.price * i.qty)}</span></div>)}
        <hr /><div className="row"><strong>Total</strong><strong>{rupee(total)}</strong></div>
      </aside>
    </div>
  );
}
