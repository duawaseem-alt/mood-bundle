// src/components/homepage.jsx
import React from "react";
import MoodBox from "./moodbox.jsx";
import SpotifySongsBox from "./moodsongs.jsx";
import MoodClinical from "./moodclinical.jsx";
import DashboardSummary from "./usermoodchart.jsx";
import EmergencyDashboard from "./emerdb.jsx";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="homepage-wrapper">
      <div className="home-grid">
        
        {/* Row 1 */}
        <div className="grid-item">
          <MoodBox />
        </div>
        <div className="grid-item">
          <SpotifySongsBox />
        </div>

        {/* Row 2 */}
        <div className="grid-item">
          <MoodClinical />
        </div>
        <div className="grid-item">
          <DashboardSummary />
        </div>

        {/* Row 3 (full width) */}
        <div className="emergency-item">
          <EmergencyDashboard />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
