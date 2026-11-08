import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, rupee } from '../api';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [data, setData] = useState({ products: [], pages: 1, categories: [] });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState('loading');
  const { add } = useCart();

  useEffect(() => {
    setState('loading');
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ search, category, page }).toString();
      api('/products?' + qs).then((d) => { setData(d); setState('ok'); }).catch(() => setState('error'));
    }, 300); // debounce typing
    return () => clearTimeout(t);
  }, [search, category, page]);

  return (
    <>
      <div className="toolbar">
        <input placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {data.categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {state === 'error' && <p className="err">Could not load products. Is the backend running?</p>}
      {state === 'ok' && !data.products.length && <p>No products match your search.</p>}

      <div className="grid">
        {data.products.map((p) => (
          <article className="card" key={p._id}>
            <Link to={`/product/${p._id}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
            <div className="card-body">
              <Link to={`/product/${p._id}`} className="title">{p.name}</Link>
              <span className="muted">{p.category}</span>
              <div className="row">
                <strong>{rupee(p.price)}</strong>
                <button disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? 'Sold out' : 'Add to cart'}</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {data.pages > 1 && (
        <div className="pager">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
