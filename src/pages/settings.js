import React, { useEffect, useState } from "react";

// ToggleSwitch component with label support and animation
const ToggleSwitch = ({ isOn, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-12 h-6 flex items-center bg-gray-600 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
      isOn ? "bg-green-500" : "bg-gray-500"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
        isOn ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </div>
);

const SettingsPage = () => {
  const [normalizeVolume, setNormalizeVolume] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [language, setLanguage] = useState("English (United Kingdom)");
  const [quality, setQuality] = useState("Automatic");

  // Persist settings using localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("spotifySettings"));
    if (savedSettings) {
      setNormalizeVolume(savedSettings.normalizeVolume);
      setCompactLayout(savedSettings.compactLayout);
      setShowNowPlaying(savedSettings.showNowPlaying);
      setShowCanvas(savedSettings.showCanvas);
      setLanguage(savedSettings.language);
      setQuality(savedSettings.quality);
    }
  }, []);

  useEffect(() => {
    const settings = {
      normalizeVolume,
      compactLayout,
      showNowPlaying,
      showCanvas,
      language,
      quality,
    };
    localStorage.setItem("spotifySettings", JSON.stringify(settings));
  }, [normalizeVolume, compactLayout, showNowPlaying, showCanvas, language, quality]);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-[#121212] via-[#191414] to-black text-white px-4 md:px-20 py-10 space-y-10"
      style={{
        backgroundImage: `url('/images/spotify-bg-pattern.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="text-sm text-gray-400">Edit login methods</p>
        <button className="mt-2 border border-gray-500 px-4 py-1 rounded-full hover:bg-white hover:text-black transition">
          Edit
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Language</h2>
        <p className="text-sm text-gray-400">
          Choose language – Changes will be applied after restarting the app
        </p>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#121212] border border-gray-700 rounded px-3 py-2 w-full sm:w-96"
        >
          <option>English (United Kingdom)</option>
          <option>English (United States)</option>
          <option>Hindi</option>
        </select>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Audio quality</h2>
        <div>
          <p className="text-sm text-gray-400">Streaming quality</p>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="bg-[#121212] border border-gray-700 rounded px-3 py-2 w-full sm:w-96"
          >
            <option>Automatic</option>
            <option>Low</option>
            <option>High</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Normalise volume – Set the same volume level for all songs and podcasts
          </p>
          <ToggleSwitch
            isOn={normalizeVolume}
            onToggle={() => setNormalizeVolume((prev) => !prev)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your Library</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">Use compact library layout</p>
          <ToggleSwitch
            isOn={compactLayout}
            onToggle={() => setCompactLayout((prev) => !prev)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Display</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Show the now-playing panel on click of play
          </p>
          <ToggleSwitch
            isOn={showNowPlaying}
            onToggle={() => setShowNowPlaying((prev) => !prev)}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Display short, looping visuals on tracks (Canvas)
          </p>
          <ToggleSwitch
            isOn={showCanvas}
            onToggle={() => setShowCanvas((prev) => !prev)}
          />
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
