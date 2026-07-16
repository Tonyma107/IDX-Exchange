import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

export default function ListingsPage() {
  const [data, setData] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    results: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");

      const propertiesData = await fetchProperties({
        limit: 20,
        offset: 0,
      });

      setData(propertiesData);
    } catch (err) {
      setError(err.message || "Unable to load properties");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <main className="listings-page">
      <header className="listings-header">
        <div>
          <h1>IDX Exchange Properties</h1>
          <p>Browse real property listings from the local MySQL database.</p>
        </div>
      </header>

      {loading && <p className="status-message">Loading properties...</p>}

      {!loading && error && (
        <div className="error-box">
          <p>{error}</p>
          <button onClick={loadProperties}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="property-count">
            Showing {data.results.length} of {data.total} properties
          </p>

          <section className="property-grid">
            {data.results.map((property) => (
              <PropertyCard
                key={property.L_ListingID}
                property={property}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
