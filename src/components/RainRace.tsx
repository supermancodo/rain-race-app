import React, { useState, useEffect } from "react";
import { User } from "../types";
import UserComponent from "./User";
import LocationInput from "./LocationInput";
import { ipToLocation, getWeather } from "../api";
import { useVisibilityStatus } from "../hooks/useVisibilityStatus";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWebSocket } from "../hooks/useWebSocket";

const STORAGE_KEY = "rain-race-users";

const RainRace: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [nameInput, setNameInput] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useLocalStorage(STORAGE_KEY, users, setUsers);
  useVisibilityStatus(users, nameInput, setUsers);
  useWebSocket(users, setUsers);

  useEffect(() => {
    if (!isInitialized) return;

    const updateWeather = async () => {
      try {
        const updatedUsers = await Promise.all(
          users.map(async (user) => {
            if (!user.isOnline) return user;
            const weather = await getWeather(user.latitude, user.longitude);
            return {
              ...user,
              rainfall: user.rainfall + (weather.rainfall || 0),
              weather,
            };
          })
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error updating weather:", error);
      }
    };

    updateWeather();
    const interval = setInterval(updateWeather, 5000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameInput.trim()) return;

    try {
      const locationData = await ipToLocation();
      const { latitude, longitude, city, country } = locationData;
      const weather = await getWeather(latitude, longitude);

      const newUser: User = {
        name: nameInput,
        location: `${city}, ${country}`,
        latitude,
        longitude,
        rainfall: 0,
        weather,
        isOnline: true,
        sessionId: crypto.randomUUID(),
      };

      setUsers((prev) => {
        const filtered = prev.filter(
          (user) => user.name !== nameInput || user.isOnline
        );
        return [...filtered, newUser];
      });
      setCurrentLocation(`${city}, ${country}`);
      setIsInitialized(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleLocationChange = async (latitude: number, longitude: number) => {
    const weather = await getWeather(latitude, longitude);
    setCurrentLocation(`Custom Location (${latitude}, ${longitude})`);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.name === nameInput
          ? {
              ...user,
              latitude,
              longitude,
              location: `Custom Location (${latitude}, ${longitude})`,
              rainfall: 0,
              weather,
            }
          : user
      )
    );
  };

  return (
    <div className="rain-race">
      {!isInitialized ? (
        <div className="login-screen">
          <h1>Welcome to Rain Race!</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <button type="submit">Join Race</button>
          </form>
        </div>
      ) : (
        <div className="game-screen">
          <div className="top-bar">
            <h1>Rain Race!</h1>
            <div className="user-info">
              <span className="username">{nameInput}</span>
              <span className="location-label">📍 {currentLocation}</span>
            </div>
          </div>
          <LocationInput
            onSubmit={handleLocationChange}
            currentLocation={currentLocation}
          />
          <div className="users-list">
            <button
              className="sort-button"
              onClick={() => {
                const sortedUsers = [...users].sort(
                  (a, b) => b.rainfall - a.rainfall
                );
                setUsers(sortedUsers);
              }}
            >
              Sort by Rainfall
            </button>
            {users.map((user) => (
              <UserComponent key={user.name} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RainRace;
