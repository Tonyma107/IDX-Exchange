import "./PropertyCard.css";

function getFirstPhotoUrl(rawPhotos) {
  if (!rawPhotos) {
    return null;
  }

  let photos = rawPhotos;

  if (typeof rawPhotos === "string") {
    try {
      photos = JSON.parse(rawPhotos);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(photos) || photos.length === 0) {
    return null;
  }

  for (const photo of photos) {
    if (typeof photo === "string" && photo.trim().startsWith("http")) {
      return photo.trim();
    }

    if (photo && typeof photo === "object") {
      const possibleUrl =
        photo.MediaURL ||
        photo.MediaUrl ||
        photo.mediaUrl ||
        photo.URL ||
        photo.Url ||
        photo.url;

      if (typeof possibleUrl === "string" && possibleUrl.startsWith("http")) {
        return possibleUrl;
      }
    }
  }

  return null;
}

function formatPrice(price) {
  if (price === null || price === undefined) {
    return "Price unavailable";
  }

  return Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function PropertyCard({ property }) {
  const photoUrl = getFirstPhotoUrl(property.L_Photos);

  return (
    <article className="property-card">
      <div className="property-image-wrapper">
        {photoUrl ? (
          <img
            className="property-image"
            src={photoUrl}
            alt={property.L_Address || "Property"}
          />
        ) : (
          <div className="property-image-placeholder">No photo available</div>
        )}
      </div>

      <div className="property-card-body">
        <h2 className="property-price">{formatPrice(property.L_SystemPrice)}</h2>

        <p className="property-address">
          {property.L_Address || "Address unavailable"}
        </p>

        <p className="property-location">
          {[property.L_City, property.L_State].filter(Boolean).join(", ")}
        </p>

        <div className="property-stats">
          <span>{property.L_Keyword2 ?? "—"} beds</span>
          <span>{property.LM_Dec_3 ?? "—"} baths</span>
          <span>{property.LM_Int2_3 ?? "—"} sqft</span>
        </div>
      </div>
    </article>
  );
}
