import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIZES = [
  { label: "Personal (4 Slices)", price: 0 },
  { label: "Medium (8 Slices)", price: 3 },
  { label: "Familiar (10 Slices)", price: 6 },
  { label: "Jumbo (12 Slices)", price: 10 },
];

export default function Item() {
  const nav = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(3);
  const [added, setAdded] = useState(false);
  const base = 14;
  const total = (base + SIZES[size].price) * qty;

  return (
    <div className="item">
      <img className="hero" alt="Pizza" src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" />
      <button className="back floating" onClick={() => nav("/home")} aria-label="Back">←</button>

      <div className="price-row">
        <strong>₹{base.toFixed(2)}</strong>
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
        </div>
      </div>

      <div className="pad">
        <h3>Lorem ipsum dolor sit amet</h3>
        <p className="muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>

        <h3>Personal portion</h3>
        {SIZES.map((s, i) => (
          <label key={s.label} className="size">
            <span>{s.label}</span>
            <span className="muted">${s.price.toFixed(2)}</span>
            <input type="radio" name="size" checked={size === i} onChange={() => setSize(i)} />
          </label>
        ))}
      </div>

      <div className="bottom">
        <button className="btn" onClick={() => setAdded(true)}>
          {added ? `Added · ₹${total.toFixed(2)}` : `Add to cart · ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
