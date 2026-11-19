import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRestaurants, getToken, clearSession, getUser } from "../api";

const BEST_SELLER = [
  { src: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200", price: "$103.0" },
  { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200", price: "$50.0" },
  { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200", price: "$12.99" },
  { src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200", price: "$8.20" },
];

export default function Home() {
  const nav = useNavigate();
  const user = getUser();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  const load = async () => {
    setState("loading");
    try {
      const res = await fetchRestaurants(getToken());
      setList(res.data.results || []);
      setState("ready");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };
  useEffect(() => { load(); }, []);

  const shown = list.filter((r) => r.restaurant_name.toLowerCase().includes(query.toLowerCase()));
  const logout = () => { clearSession(); nav("/", { replace: true }); };

  return (
    <div className="home">
      <header>
        <div>
          <small className="muted">Current Location</small>
          <div className="loc">Model Town, New Delhi</div>
        </div>
        <button className="link" onClick={logout}>Log out</button>
      </header>

      <div className="search-row">
        <input placeholder={`Search ${user.name ? "as " + user.name : "restaurants"}`} value={query}
               onChange={(e) => setQuery(e.target.value)} aria-label="Search restaurants" />
      </div>

      <h2>Best Seller</h2>
      <div className="strip">
        {BEST_SELLER.map((b) => (
          <button key={b.src} className="thumb" onClick={() => nav("/item")}>
            <img src={b.src} alt="Best seller dish" />
            <span>{b.price}</span>
          </button>
        ))}
      </div>

      <div className="promo">
        <div>
          <p>Experience our delicious new dish</p>
          <strong>30% OFF</strong>
        </div>
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300" alt="Pizza" />
      </div>

      <h2>Popular Restaurants</h2>
      {state === "loading" && <p className="muted pad">Loading restaurants…</p>}
      {state === "error" && (
        <div className="pad">
          <p className="error">{error}</p>
          <button className="btn small-btn" onClick={load}>Try again</button>
        </div>
      )}
      {state === "ready" && shown.length === 0 && <p className="muted pad">No restaurants match “{query}”.</p>}
      <ul className="list">
        {shown.map((r) => (
          <li key={r.restaurant_id} onClick={() => nav("/item")}>
            <img src={r.logo} alt="" />
            <div>
              <h3>{r.restaurant_name}</h3>
              <p className="muted">{r.address_complete && r.address_complete !== "null" ? r.address_complete : "Address not available"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
