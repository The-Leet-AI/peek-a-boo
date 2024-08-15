// pages/index.tsx
import React from "react";
import FfdCamera from '../components/FfdCamera';

export default function Home() {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
        }}
      >
        <FfdCamera />
      </div>
    </div>
  );
}
