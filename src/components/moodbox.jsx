import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./moodbox.css";
import cartoon from "../assets/sec.svg";
import { db } from "./firebase.jsx";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useMood } from './../context/moodcontext.jsx';
import { getAuth } from "firebase/auth";
import bsound from "../assets/bublepop.mp3";
import Navbar from "./navbar.jsx";

const emojis = ["😄", "😭", "😎", "😰", "😍", "😡", "🥳", "😕"];
const happyEmojis = ["😄", "😍", "🥳", "😎"];
const sadEmojis = ["😭", "😡", "😰", "😕"];

const moodNotes = {
  "😄": "You’re feeling cheerful and energetic!",
  "😍": "Love is in the air today!",
  "🥳": "Let’s celebrate your awesome mood!",
  "😎": "Cool and confident – that’s the vibe!",
  "😭": "It’s okay to cry. Be kind to yourself.",
  "😡": "You seem angry. Take a moment to breathe.",
  "😰": "Feeling anxious? You're not alone.",
  "😕": "Mixed emotions today? That’s valid too.",
};

const MoodBox = () => {
  const { setSelectedMood } = useMood();
  const [showRain, setShowRain] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [generatedNote, setGeneratedNote] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [finalSave, setFinalSave] = useState(null);
  const rainRef = useRef(null);

  const playSound = () => {
    const audio = new Audio(bsound);
    audio.play();
  };

  const moodScoreMap = {
    "😄": 9,
    "😍": 9,
    "🥳": 10,
    "😎": 8,
    "😭": 3,
    "😡": 2,
    "😰": 4,
    "😕": 5,
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedMood(emoji);
    setGeneratedNote(moodNotes[emoji] || "");
    setCustomNote("");
    playSound();

    if (happyEmojis.includes(emoji)) {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
      });
    } else if (sadEmojis.includes(emoji)) {
      setShowRain(true);
      setTimeout(() => setShowRain(false), 5000);
    }
  };

  const handleSave = async () => {
    if (!selectedEmoji) return;

    const moodScore = moodScoreMap[selectedEmoji] || 5;

    const moodData = {
      emoji: selectedEmoji,
      moodScore,
      autoNote: generatedNote,
      userNote: customNote,
      timestamp: serverTimestamp(),
    };

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Save to moods collection
        await addDoc(collection(db, "users", user.uid, "moods"), moodData);

        // Save to summary collection (combined DB)
        await addDoc(collection(db, "users", user.uid, "summary"), {
          type: "mood",
          ...moodData,
        });

        setFinalSave(moodData);

        // CLEAR ONLY the input textarea after saving
        setCustomNote("");
      } else {
        console.log("User not logged in. Cannot save mood.");
      }
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  useEffect(() => {
    if (showRain) {
      createRain();
    }
  }, [showRain]);

  const createRain = () => {
    const rainContainer = rainRef.current;
    if (!rainContainer) return;

    rainContainer.innerHTML = "";

    for (let i = 0; i < 100; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${1 + Math.random() * 1.5}s`;
      rainContainer.appendChild(drop);
    }
  };

  return (
  
    <div className="mood-box">
      
      <h2 className="mood-heading">How are you feeling today?</h2>

      <div className="emoji-container">
        {emojis.map((emoji, index) => (
          <span
            className={`emoji ${selectedEmoji === emoji ? "selected" : ""}`}
            key={index}
            onClick={() => handleEmojiClick(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>

      {selectedEmoji && (
        <div className="note-box">
          <p className="auto-text"> {generatedNote}</p>

          <textarea
            className="custom-input"
            placeholder="Write your own note (optional)..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          ></textarea>

          <button className="save-button" onClick={handleSave}>
            Save Mood
          </button>
        </div>
      )}

      {finalSave && (
        <div className="save-confirmation">
          ✅ Mood saved: {finalSave.emoji} — {finalSave.autoNote}
          {finalSave.userNote && <p>Your note: {finalSave.userNote}</p>}
        </div>
      )}

      <div className="cartoon-wrapper">
        <img src={cartoon} alt="Happy Cartoon" className="cartoon-img" />
      </div>

      {showRain && <div className="rain-overlay" ref={rainRef}></div>}

      <div className="sparkle-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="sparkle"></div>
        ))}
      </div>
    </div>
  );
};

export default MoodBox;
