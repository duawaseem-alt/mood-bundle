// moodcontext.jsx
import { createContext, useContext, useState } from 'react';
import React from 'react';
const MoodContext = createContext(null); // ✅ must be initialized

export const MoodProvider = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState('');

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};


