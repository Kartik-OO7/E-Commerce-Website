import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, rupee } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { token } = useAuth();
  const { state } = useLocation();
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { api('/orders/mine', { token }).then(setOrders).catch((e) => setErr(e.message)); }, [token]);

  return (
    <>
      <h1>My orders</h1>
      {state?.placed && <p className="ok">Order placed successfully.</p>}
      {err && <p className="err">{err}</p>}
      {orders && !orders.length && <p>You have not placed any orders yet.</p>}
      {orders?.map((o) => (
        <div className="order" key={o._id}>
          <div className="row">
            <strong>Order #{o._id.slice(-6)}</strong>
            <span className="muted">{new Date(o.createdAt).toLocaleDateString('en-IN')} - {o.status}</span>
          </div>
          {o.items.map((i) => <div key={i.product} className="row"><span>{i.name} x {i.qty}</span><span>{rupee(i.price * i.qty)}</span></div>)}
          <div className="row"><strong>Total ({o.paymentMethod})</strong><strong>{rupee(o.total)}</strong></div>
        </div>
      ))}
    </>
  );
}
