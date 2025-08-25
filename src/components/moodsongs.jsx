import React, { useState, useEffect, useRef } from 'react';
import { useMood } from '../context/moodcontext.jsx';
import YouTube from 'react-youtube';
import './moodsongs.css';
import headphone from "../assets/headphone.svg";
import disk from "../assets/disk.jpg";
import dsc from "../assets/frstdsc.jpg";
import dsctwo from "../assets/secdsc.png";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MoodSongs = () => {
  const { selectedMood } = useMood();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const getMoodThemeClass = () => {
    switch (selectedMood) {
      case '😄':
      case '😍':
      case '🥳':
      case '😎':
        return 'theme-happy';
      case '😭':
      case '😰':
      case '😕':
        return 'theme-sad';
      case '😡':
        return 'theme-angry';
      default:
        return 'theme-default';
    }
  };

  const fetchVideos = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data?.items?.length) setVideos(data.items);
      else setVideos([]);
      setSearchTerm(query);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMood && selectedMood !== 'Select a mood') {
      fetchVideos(`${selectedMood} music`);
    }
  }, [selectedMood]);

  const handleSearch = () => {
    if (userQuery.trim()) fetchVideos(userQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
    setIsPlaying(true);
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) setIsPlaying(true);   // playing
    else if (event.data === 2) setIsPlaying(false); // paused
    else if (event.data === 0) setIsPlaying(false); // ended
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const skipTime = (seconds) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  return (
    <div className={`spotify-box ${getMoodThemeClass()}`}>
      <h2>
        🎧 Mood Playlist for <span className="glow-mood">{selectedMood}</span>
      </h2>

      <div className="search-bar">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search any song (e.g., Ishq, Lo-fi, etc.)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="footer-bar">
        <img src={headphone} alt="Headphone" className="footer-image headphone" />
        <img src={disk} alt="Disc" className="footer-image disc" />
      </div>

      {loading && <p className="loading-text">Loading songs...</p>}

      <div className="songs-grid">
  {videos.map((video) => (
    <div
      key={video.id.videoId}
      className="song-card"
      onClick={() => handleVideoClick(video.id.videoId)}
    >
      <div className="thumbnail-container">
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
        />
        {/* <div className="play-button">▶</div> */}
      </div>
      <p className="song-title">{video.snippet.title}</p>
    </div>
  ))}
</div>


      <div className={`video-player-container ${selectedVideoId ? 'show' : 'hide'}`}>
        {selectedVideoId && (
          <>
            <YouTube
              videoId={selectedVideoId}
              opts={{ height: "0", width: "0", playerVars: { autoplay: 1 } }}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
            />

            <div className="rotating-disk-container">
              <button className="control-btn" onClick={() => skipTime(-10)}>⏪ 10s</button>

              <img
                src={dsctwo}
                alt="Playing Disk"
                className={`rotating-disk ${isPlaying ? 'spin' : ''}`}
              />

              <button className="control-btn" onClick={() => skipTime(10)}>10s ⏩</button>
            </div>

            <div className="play-pause-container">
              <button className="play-pause-btn" onClick={togglePlayPause}>
                {isPlaying ? '⏸ Pause' : '▶️ Play'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodSongs;
