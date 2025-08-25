import React from "react";
import  "../components/emerdb.css";
export default function EmergencyDashboard() {
  const resources = [
    {
      title: "Crisis Hotline USA",
      description:
        "The National Suicide Prevention Lifeline is a network of local crisis centers that provide free and confidential emotional support 24/7.",
      link: "https://988lifeline.org/",
    },
    {
      title: "Find a Support Group",
      description:
        "Find in-person or online support groups through the Depression and Bipolar Support Alliance (DBSA) and connect with people who understand.",
      link: "https://www.dbsalliance.org/support/chapters-support-groups/",
    },
    {
      title: "E-Mood Blogs & News",
      description:
        "Read blogs, news, and writings from eMood operators and guest posters with useful information about mental health.",
      link: "https://emoodtracker.com/blog/",
    },
  ];

  const otherResources = [
    { label: "International Crisis Hotlines", link: "https://findahelpline.com/" },
    { label: "Bipolar Disorder Information", link: "https://www.nimh.nih.gov/health/topics/bipolar-disorder" },
    { label: "Online Therapy", link: "https://www.betterhelp.com/" },
  ];

  return (
    <div className="emergency-dashboard">
      <div className="emergency-banner">
        <strong>
          If you or someone you know is in immediate danger because of thoughts of suicide, please call <span className="highlight">911</span> or your local emergency number immediately.
        </strong>
      </div>

      <div className="resource-grid">
        {resources.map((res, i) => (
          <div className="resource-card" key={i}>
            <h3>{res.title}</h3>
            <p>{res.description}</p>
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="visit-btn">
              Visit Website
            </a>
          </div>
        ))}
      </div>

      <div className="other-resources">
        <h4>Other Resources</h4>
        <ul>
          {otherResources.map((res, i) => (
            <li key={i}>
              <a href={res.link} target="_blank" rel="noopener noreferrer">
                {res.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
