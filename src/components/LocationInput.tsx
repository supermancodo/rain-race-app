import React, { useState } from "react";

interface LocationInputProps {
  onSubmit: (latitude: number, longitude: number) => void;
  currentLocation: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onSubmit,
  currentLocation,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(coordinates.latitude);
    const lng = parseFloat(coordinates.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSubmit(lat, lng);
      setCoordinates({ latitude: "", longitude: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="location-input">
      <div className="current-location">
        📍 {currentLocation}{" "}
        <button className="change-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Change Location"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="any"
            value={coordinates.latitude}
            onChange={(e) =>
              setCoordinates((prev) => ({ ...prev, latitude: e.target.value }))
            }
            placeholder="Latitude (-90 to 90)"
            min="-90"
            max="90"
            required
          />
          <input
            type="number"
            step="any"
            value={coordinates.longitude}
            onChange={(e) =>
              setCoordinates((prev) => ({ ...prev, longitude: e.target.value }))
            }
            placeholder="Longitude (-180 to 180)"
            min="-180"
            max="180"
            required
          />
          <button type="submit">Update Location</button>
        </form>
      )}
    </div>
  );
};

export default LocationInput;
