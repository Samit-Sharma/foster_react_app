import React, { useEffect, useState } from 'react';
import {
  MapPin,
  LogOut,
  RefreshCw,
  Search,
  Utensils,
} from 'lucide-react';

import { getRestaurants } from '../services/api.js';

export default function RestaurantList({ session, onLogout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const payload = await getRestaurants(session?.token);

      console.log('Restaurant API response:', payload);

      const data = payload?.data || payload;

      const results = Array.isArray(data?.results)
        ? data.results
        : [];

      console.log('Restaurant results:', results);

      // Inspect the image URLs returned by the API.
      results.forEach((item) => {
        console.log(
          'Restaurant:',
          item.restaurant_name,
          'Image URL:',
          item.logo
        );
      });

      setRestaurants(results);
      setTotalCount(data?.meta?.total_count ?? null);

      if (!results.length) {
        console.warn('The API returned no restaurant results.');
      }
    } catch (err) {
      console.error('Restaurant API error:', err);

      setError(err.message || 'Unable to load restaurants.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = restaurants.filter((item) => {
    const restaurantName = item.restaurant_name || '';

    const address =
      item.address_complete === 'null'
        ? ''
        : item.address_complete || '';

    const searchText = (
      restaurantName + ' ' + address
    ).toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <a
          className="brand compact-brand"
          href="#"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-mark">
            <Utensils size={20} />
          </span>

          <span>
            fastor<span className="brand-dot">.</span>
          </span>
        </a>

        <div className="header-right">
          <span className="user-pill">
            {session?.dialCode || '+91'} {session?.phone || ''}
          </span>

          <button
            className="icon-button"
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <p className="eyebrow">YOUR NEXT GREAT MEAL</p>

          <h1>
            Discover restaurants
            <span className="brand-dot">.</span>
          </h1>

          <p className="subheading">
            Find a place to enjoy something delicious.
          </p>
        </div>

        <div className="welcome-art">
          <Utensils size={42} />
        </div>
      </section>

      <section className="list-section">
        <div className="list-heading">
          <div>
            <h2>Restaurants</h2>

            <p>
              {totalCount !== null
                ? totalCount + ' places available'
                : 'Places picked for you'}
            </p>
          </div>

          <div className="search-box">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search restaurants"
              placeholder="Search restaurants"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <span className="spinner dark-spinner" />
            Loading restaurants…
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>

            <button
              className="secondary-button retry-button"
              onClick={load}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <p>
              No restaurants found
              {search ? ' for "' + search + '"' : ''}.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="restaurant-grid">
            {filtered.map((item, index) => (
              <article
                className="restaurant-card"
                key={item.restaurant_id || index}
              >
                <RestaurantImage item={item} />

                <div className="restaurant-details">
                  <h3>
                    {item.restaurant_name || 'Restaurant'}
                  </h3>

                  {item.address_complete &&
                  item.address_complete !== 'null' ? (
                    <p className="restaurant-address">
                      <MapPin size={15} />
                      <span>{item.address_complete}</span>
                    </p>
                  ) : (
                    <p className="restaurant-address muted-address">
                      <MapPin size={15} />
                      <span>Address not available</span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        Made for good food days <span>♥</span>
      </footer>
    </main>
  );
}

function RestaurantImage({ item }) {
  const [imageFailed, setImageFailed] = useState(false);

  const logo =
    typeof item.logo === 'string'
      ? item.logo.trim()
      : '';

  // Reset the error state if the API supplies a different URL.
  useEffect(() => {
    setImageFailed(false);
  }, [logo]);

  const validLogo =
    logo.startsWith('https://') ||
    logo.startsWith('http://');

  return (
    <div className="restaurant-image-wrap">
      {validLogo && !imageFailed ? (
        <img
          className="restaurant-image"
          src={logo}
          alt={item.restaurant_name || 'Restaurant'}
          onLoad={() => {
            console.log(
              'Image loaded successfully:',
              item.restaurant_name,
              logo
            );
          }}
          onError={() => {
            console.error(
              'Image failed to load:',
              item.restaurant_name,
              logo
            );

            setImageFailed(true);
          }}
        />
      ) : (
        <div className="restaurant-placeholder">
          <Utensils size={30} />

          <span>
            {logo ? 'Image could not be loaded' : 'No image available'}
          </span>
        </div>
      )}

      <span className="restaurant-id">
        #{item.restaurant_id}
      </span>
    </div>
  );
}