import React, { useEffect, useState } from "react";
import ChartComponent from "./chartcom.jsx"; // Chart.js wrapper
import { db } from "./firebase.jsx";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useAuth } from "../context/authcontext.jsx";
import "./mchart.css";

export default function DashboardHistory() {
  const { user, loading: authLoading } = useAuth();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [dayBoxes, setDayBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLast7Days = async () => {
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6); // include today (7 days total)

        const q = query(
          collection(db, "users", user.uid, "clinical"),
          where("timestamp", ">=", sevenDaysAgo),
          orderBy("timestamp", "asc")
        );

        const querySnapshot = await getDocs(q);
        const allEntries = querySnapshot.docs.map((doc) => doc.data());

        // Group by date (keep last entry of each day)
        const groupedByDate = {};
        allEntries.forEach((e) => {
          const day = new Date(e.timestamp.seconds * 1000).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          );
          groupedByDate[day] = e; // overwrite = keeps last entry of that day
        });

        // Generate last 7 calendar days (always exactly 7)
        const labels = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          labels.push(
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          );
        }

        // ✅ reverse so newest is on the left, oldest on the right
        // labels.reverse();

        // Map data (if missing, put 0)
        const sleepData = labels.map(
          (day) => groupedByDate[day]?.sleepHours || 0
        );
        const stressData = labels.map((day) => groupedByDate[day]?.stress || 0);
        const anxietyData = labels.map(
          (day) => groupedByDate[day]?.anxiety || 0
        );
        const energyData = labels.map(
          (day) => groupedByDate[day]?.energy || 0
        );

        setDayBoxes(labels); // for top boxes
        setChartData({
          labels,
          datasets: [
            {
              label: "Sleep Hours",
              data: sleepData,
              borderColor: "#ff5ca2",
              backgroundColor: "rgba(255,92,162,0.4)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#ff5ca2",
              pointRadius: 5,
            },
            {
              label: "Stress",
              data: stressData,
              borderColor: "#6a00ff",
              backgroundColor: "transparent",
              fill: false,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#6a00ff",
              pointRadius: 5,
            },
            {
              label: "Anxiety",
              data: anxietyData,
              borderColor: "#ffa500",
              backgroundColor: "transparent",
              fill: false,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#ffa500",
              pointRadius: 5,
            },
            {
              label: "Energy",
              data: energyData,
              borderColor: "#00c853",
              backgroundColor: "transparent",
              fill: false,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#00c853",
              pointRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching last 7 days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLast7Days();
  }, [user, authLoading]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#fff", font: { size: 14 } } },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
      y: {
        min: 0,
        max: 12,
        ticks: { color: "#fff", stepSize: 2 },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
    },
  };

  if (authLoading || loading) return <div>Loading Mood Chart...</div>;
  if (!chartData.labels.length) return <div>No data to display</div>;

  return (
    <div className="mood-chart-wrapper">
      <h2 className="chart-title glow-text">Clinical History & Trends</h2>

      {/* Day boxes */}
      <div className="day-boxes-container">
        {dayBoxes.map((day, idx) => (
          <div key={idx} className="day-box glow-box">
            {day}
          </div>
        ))}
      </div>

      <p className="chart-subtitle glow-text">Trends (Last 7 Days)</p>
      <ChartComponent type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
