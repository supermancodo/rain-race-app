import React from "react";
import { User } from "../types";

interface UserProps {
  user: User;
}

const UserComponent: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="user-card">
      <div>
        <strong>{user.name}</strong> • {user.location}
        <div>
          {user.weather.temperature} • {user.weather.condition}
          <span style={{ color: user.isOnline ? "#4CAF50" : "#FF5252" }}>
            {" "}
            • {user.isOnline ? "online" : "offline"}
          </span>
        </div>
        <div style={{ color: "#4CAF50", marginTop: "4px" }}>
          {user.rainfall.toFixed(2)} inches collected
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
