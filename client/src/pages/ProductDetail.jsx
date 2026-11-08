import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, rupee } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const { add } = useCart();
  const nav = useNavigate();

  useEffect(() => { api('/products/' + id).then(setP).catch((e) => setErr(e.message)); }, [id]);
  if (err) return <p className="err">{err}</p>;
  if (!p) return <p>Loading...</p>;

  return (
    <div className="detail">
      <img src={p.image} alt={p.name} />
      <div>
        <h1>{p.name}</h1>
        <p className="muted">{p.category}</p>
        <p>{p.description}</p>
        <h2>{rupee(p.price)}</h2>
        <p>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
        {p.stock > 0 && (
          <div className="row">
            <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(p.stock, +e.target.value || 1)))} style={{ width: 80 }} />
            <button onClick={() => { add(p, qty); nav('/cart'); }}>Add to cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
