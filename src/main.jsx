import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MoodProvider } from "./context/moodcontext.jsx"; // adjust path
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authcontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>
<AuthProvider>
<BrowserRouter>    
    <MoodProvider>
    
        <App />
    
    </MoodProvider>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
