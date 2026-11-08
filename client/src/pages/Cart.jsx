import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { rupee } from '../api';

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const nav = useNavigate();
  if (!items.length) return <p>Your cart is empty. <Link to="/">Browse products</Link></p>;

  return (
    <>
      <h1>Your cart</h1>
      {items.map((i) => (
        <div className="line" key={i._id}>
          <img src={i.image} alt="" />
          <div className="grow"><Link to={`/product/${i._id}`}>{i.name}</Link><div className="muted">{rupee(i.price)} each</div></div>
          <input type="number" min="1" max={i.stock} value={i.qty} onChange={(e) => setQty(i._id, +e.target.value || 1)} style={{ width: 70 }} />
          <strong>{rupee(i.price * i.qty)}</strong>
          <button className="link" onClick={() => remove(i._id)}>Remove</button>
        </div>
      ))}
      <div className="summary">
        <h2>Total: {rupee(total)}</h2>
        <button onClick={() => nav('/checkout')}>Go to checkout</button>
      </div>
    </>
  );
}
