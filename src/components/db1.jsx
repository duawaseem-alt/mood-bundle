// src/components/dashboardone.jsx
import React from 'react';
import MoodBox from './moodbox.jsx'; // <-- make sure this path matches your file

export default function DashboardOne() {
  return (
    <div style={{ padding: 20 }}>
      <MoodBox />
    </div>
  );
}
