import React, { useState, useEffect } from "react";
import "../components/moodclinical.css";
import { db } from "./firebase.jsx";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../context/authcontext.jsx";

const SleepEmoji = ({ hours }) => {
  if (hours >= 9) return "😴";
  if (hours >= 7) return "😌";
  if (hours >= 5) return "😐";
  return "😫";
};

export default function MoodClinical() {
  const { user, loading: authLoading } = useAuth();

  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState("average");
  const [stress, setStress] = useState(4);
  const [anxiety, setAnxiety] = useState(3);
  const [energy, setEnergy] = useState(6);

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showSavedMessage, setShowSavedMessage] = useState(false); // NEW: show confirmation message

  const moodScore = Math.round(
    ((10 - stress) + (10 - anxiety) + energy + (sleepHours / 12) * 10) / 4
  );

  const getSliderColor = (val, max) => {
    const ratio = val / max;
    const pink = [255, 92, 162];
    const purple = [106, 0, 255];
    const r = Math.round(pink[0] + (purple[0] - pink[0]) * ratio);
    const g = Math.round(pink[1] + (purple[1] - pink[1]) * ratio);
    const b = Math.round(pink[2] + (purple[2] - pink[2]) * ratio);
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLatestEntry = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "clinical"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0].data();
          setSleepHours(doc.sleepHours || 7);
          setSleepQuality(doc.sleepQuality || "average");
          setStress(doc.stress || 4);
          setAnxiety(doc.anxiety || 3);
          setEnergy(doc.energy || 6);
          setSavedAt(doc.timestamp?.toDate().toLocaleString() || null);
        }
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
      setLoading(false);
    };

    fetchLatestEntry();
  }, [user, authLoading]);

  const handleSave = async () => {
    if (!user) {
      // Remove alert, instead show a message or handle login elsewhere
      console.log("Please login to save your data.");
      return;
    }

    setSaving(true);

    const clinicalData = {
      sleepHours,
      sleepQuality,
      stress,
      anxiety,
      energy,
      moodScore,
      timestamp: serverTimestamp(),
    };

    try {
      // Save to clinical collection
      await addDoc(collection(db, "users", user.uid, "clinical"), clinicalData);

      // Save to summary collection (combined DB)
      await addDoc(collection(db, "users", user.uid, "summary"), {
        type: "clinical",
        sleepHours,
        stress,
        anxiety,
        energy,
        moodScore,
        timestamp: serverTimestamp(),
      });

      setSavedAt(new Date().toLocaleString());

      // Show confirmation message for 3 seconds
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error) {
      console.error("Error saving clinical data:", error);
      // You can set error state here to show an error message instead of alert
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div>Loading clinical data...</div>;

  return (
    <div className="clinical-wrap">

      <div className="grid">

        <div className="card inputs glow-box">
          {/* Sleep Hours */}
                        <h2 className="title glow-text">Daily Clinical Trackers</h2>

          <section className="field">
            <label className="label">
              Sleep hours{" "}
              <span className="sub">
                ({sleepHours}h) {<SleepEmoji hours={sleepHours} />}
              </span>
            </label>
            <div className={`slider-wrapper`}>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="slider sleep-slider"
                style={{
                  accentColor: getSliderColor(sleepHours, 12),
                }}
              />
            </div>
            <div className="slider-legend">
              <span>0</span>
              <span>6</span>
              <span>9</span>
              <span>12</span>
            </div>
          </section>

          {/* Sleep Quality */}
          <section className="field">
            <label className="label glow-text">Sleep quality</label>
            <div className="quality-buttons">
              {["poor", "average", "great"].map((q) => (
                <button
                  key={q}
                  className={`quality-btn ${sleepQuality === q ? "active" : ""}`}
                  onClick={() => setSleepQuality(q)}
                  aria-pressed={sleepQuality === q}
                >
                  {q === "poor" ? "😫" : q === "average" ? "😐" : "😌"}{" "}
                  <span>{q.charAt(0).toUpperCase() + q.slice(1)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Stress Slider */}
          <section className="field">
            <label className="label">
              Stress <span className="sub">({stress})</span>
            </label>
            <div className={`slider-wrapper`}>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={stress}
                onChange={(e) => setStress(+e.target.value)}
                className="slider stress-slider"
                style={{ accentColor: getSliderColor(stress, 10) }}
              />
            </div>
          </section>

          {/* Anxiety Slider */}
          <section className="field">
            <label className="label">
              Anxiety <span className="sub">({anxiety})</span>
            </label>
            <div className={`slider-wrapper`}>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={anxiety}
                onChange={(e) => setAnxiety(+e.target.value)}
                className="slider anxiety-slider"
                style={{ accentColor: getSliderColor(anxiety, 10) }}
              />
            </div>
          </section>

          {/* Energy Slider */}
          <section className="field">
            <label className="label">
              Energy <span className="sub">({energy})</span>
            </label>
            <div className={`slider-wrapper`}>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={energy}
                onChange={(e) => setEnergy(+e.target.value)}
                className="slider energy-slider"
                style={{ accentColor: getSliderColor(energy, 10) }}
              />
            </div>
          </section>

          <div className="actions">
            <button
              className="save-btn glow-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save today's entry"}
            </button>

            <button
              className="clear-btn"
              onClick={() => {
                setSleepHours(7);
                setSleepQuality("average");
                setStress(4);
                setAnxiety(3);
                setEnergy(6);
              }}
            >
              Reset
            </button>
          </div>

          {/* Confirmation message instead of alert */}
          {showSavedMessage && (
            <p className="saved-message glow-text">Clinical data saved successfully!</p>
          )}

          {savedAt && <p className="saved-note glow-text">Last saved: {savedAt}</p>}
        </div>

<div className="sum-h">
        <div 
          className={`card preview ${moodScore >= 8 ? "good-day" : ""} glow-box summary`}>
          <h3 className="sum-heading">Today's Summary</h3>
          <div className="summary-row">
            <div className="summary-item">
              <strong>Mood score</strong>
              <div className="mood-badge glow-text">{moodScore}/10</div>
            </div>

            <div className="summary-item">
              <strong>Sleep</strong>
              <div className="mood-badge glow-text">
                {sleepHours}h · {sleepQuality}
              </div>
            </div>

            <div className="summary-item">
              <strong>Stress </strong>
              <div className="mood-badge glow-text">
                {stress}/10
              </div>
            </div>

            <div className="summary-item">
              <strong> Anxiety</strong>
              <div className="mood-badge glow-text">
                 {anxiety}/10
              </div>
            </div>



            <div className="summary-item">
              <strong>Energy</strong>
              <div className="mood-badge glow-text">{energy}/10</div>
            </div>
          </div>

          <div className="insight glow-text">
            <p>
              <strong>Quick tip:</strong>{" "}
              {energy < 4
                ? "Try a 10-minute walk or breathing exercise."
                : "Great energy — consider a light task + short break."}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
