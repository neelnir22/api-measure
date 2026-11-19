import React, { useState, useEffect } from 'react';
import { INDIAN_CITIES, CPCB_THRESHOLDS } from './data/cities';

export default function App() {
  // City and pollutant states initialized with realistic sample values
  const [cityName, setCityName] = useState('Delhi');
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [pollutants, setPollutants] = useState({
    pm25: 85.5,
    pm10: 160.2,
    no2: 42.1,
    co: 1.8,
    so2: 15.4,
    o3: 38.0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Check backend health on mount
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'Live') {
          setBackendStatus(`Live (${data.model})`);
        } else {
          setBackendStatus('Offline');
        }
      })
      .catch(() => {
        setBackendStatus('Backend unreachable (:8000)');
      });
  }, [API_BASE]);

  // Initial prediction on page load
  useEffect(() => {
    handlePredict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user selects a city from dropdown/presets
  const handleCitySelect = (e) => {
    const chosenName = e.target.value;
    setSelectedCity(chosenName);
    setCityName(chosenName);

    const found = INDIAN_CITIES.find((c) => c.name === chosenName);
    if (found) {
      setPollutants({
        pm25: found.pm25,
        pm10: found.pm10,
        no2: found.no2,
        co: found.co,
        so2: found.so2,
        o3: found.o3
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPollutants((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      city: cityName || undefined,
      pm25: parseFloat(pollutants.pm25) || 0,
      pm10: parseFloat(pollutants.pm10) || 0,
      no2: parseFloat(pollutants.no2) || 0,
      co: parseFloat(pollutants.co) || 0,
      so2: parseFloat(pollutants.so2) || 0,
      o3: parseFloat(pollutants.o3) || 0
    };

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(`Failed to connect to backend at ${API_BASE}. Make sure the backend server or container is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Badge styles according to category (Green for Good, Yellow for Moderate, Red/Purple for Poor/Severe)
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Good':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          ring: 'border-emerald-500',
          summary: 'Clean Air: Minimal impact on health. Outdoor activities are completely safe.'
        };
      case 'Satisfactory':
        return {
          bg: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
          dot: 'bg-lime-500',
          textColor: 'text-lime-400',
          ring: 'border-lime-500',
          summary: 'Acceptable Air Quality: Minor breathing discomfort to sensitive individuals.'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          textColor: 'text-amber-400',
          ring: 'border-amber-400',
          summary: 'Moderate Pollution: Breathing discomfort to people with asthma, lung, and heart diseases.'
        };
      case 'Poor':
        return {
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          dot: 'bg-orange-500',
          textColor: 'text-orange-400',
          ring: 'border-orange-500',
          summary: 'Unhealthy: Breathing discomfort to most people on prolonged exposure. Limit intense outdoor exercise.'
        };
      case 'Very Poor':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          textColor: 'text-rose-400',
          ring: 'border-rose-500',
          summary: 'Very Unhealthy: Respiratory illness on prolonged exposure. Sensitive groups and children must stay indoors.'
        };
      case 'Severe':
        return {
          bg: 'bg-purple-900/40 text-purple-300 border-purple-500/50',
          dot: 'bg-purple-500',
          textColor: 'text-purple-400',
          ring: 'border-purple-600',
          summary: 'Hazardous / Emergency: Severe health impact even on healthy individuals. Wear N95 respirator mask.'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          textColor: 'text-white',
          ring: 'border-slate-700',
          summary: 'Awaiting prediction...'
        };
    }
  };

  const theme = prediction ? getCategoryTheme(prediction.category) : getCategoryTheme(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight">VayuDrishti AQI AI</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                  React + Vite
                </span>
              </div>
              <p className="text-xs text-slate-400">Cloud Computing Sem 7 • CPCB India Standards</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${backendStatus.includes('Live') ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
            <span className="text-slate-300">API: {backendStatus}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">

        {/* Hero Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800/80 shadow-xl">
          <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            Air Quality Index (AQI) Predictor
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Enter any Indian city name along with the 6 core environmental pollutants (PM2.5, PM10, NO2, CO, SO2, O3) to predict the real-time CPCB Air Quality Index using Machine Learning (Random Forest Regressor, R² = 0.9231).
          </p>
        </div>

        {/* Quick City Presets */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick City Benchmarks (Historical CPCB Averages)
            </label>
            <span className="text-xs text-slate-500">Click to auto-populate</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {INDIAN_CITIES.slice(0, 6).map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  setSelectedCity(city.name);
                  setCityName(city.name);
                  setPollutants({
                    pm25: city.pm25,
                    pm10: city.pm10,
                    no2: city.no2,
                    co: city.co,
                    so2: city.so2,
                    o3: city.o3
                  });
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                  cityName === city.name
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold">{city.name}</div>
                  <div className="text-[10px] text-slate-400">{city.state}</div>
                </div>
                <span className="text-[10px] text-slate-500">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Form Input (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Pollutant Inputs</h3>
                <p className="text-xs text-slate-400">Values are pre-filled for immediate testing</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCityName('Custom City');
                  setSelectedCity('custom');
                  setPollutants({
                    pm25: 85.5,
                    pm10: 160.2,
                    no2: 42.1,
                    co: 1.8,
                    so2: 15.4,
                    o3: 38.0
                  });
                }}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition"
              >
                Reset Defaults
              </button>
            </div>

            <form onSubmit={handlePredict} className="space-y-5">
              {/* City Selection / Custom Input */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Target City Name
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Select from Database</label>
                    <select
                      value={selectedCity}
                      onChange={handleCitySelect}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="custom">-- Custom City --</option>
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Enter / Edit City Name</label>
                    <input
                      type="text"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      placeholder="e.g. Delhi, Mumbai, Pune..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* 6 Pollutant Inputs */}
              <div className="space-y-4">
                {/* PM2.5 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-cyan-300">PM2.5 (Fine Particulate)</div>
                      <div className="text-[10px] text-slate-500">CPCB 24h limit: 60 µg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={pollutants.pm25}
                        onChange={(e) => handleInputChange('pm25', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">µg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="0.5"
                    value={pollutants.pm25}
                    onChange={(e) => handleInputChange('pm25', e.target.value)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* PM10 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-cyan-300">PM10 (Coarse Particulate)</div>
                      <div className="text-[10px] text-slate-500">CPCB 24h limit: 100 µg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={pollutants.pm10}
                        onChange={(e) => handleInputChange('pm10', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">µg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="0.5"
                    value={pollutants.pm10}
                    onChange={(e) => handleInputChange('pm10', e.target.value)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* NO2 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-blue-300">NO2 (Nitrogen Dioxide)</div>
                      <div className="text-[10px] text-slate-500">CPCB 24h limit: 80 µg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={pollutants.no2}
                        onChange={(e) => handleInputChange('no2', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">µg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    step="0.5"
                    value={pollutants.no2}
                    onChange={(e) => handleInputChange('no2', e.target.value)}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* CO */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-purple-300">CO (Carbon Monoxide)</div>
                      <div className="text-[10px] text-slate-500">CPCB 8h limit: 2.0 mg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={pollutants.co}
                        onChange={(e) => handleInputChange('co', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">mg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.05"
                    value={pollutants.co}
                    onChange={(e) => handleInputChange('co', e.target.value)}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* SO2 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-amber-300">SO2 (Sulfur Dioxide)</div>
                      <div className="text-[10px] text-slate-500">CPCB 24h limit: 80 µg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={pollutants.so2}
                        onChange={(e) => handleInputChange('so2', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">µg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="0.5"
                    value={pollutants.so2}
                    onChange={(e) => handleInputChange('so2', e.target.value)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* O3 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-teal-300">O3 (Ground Ozone)</div>
                      <div className="text-[10px] text-slate-500">CPCB 8h limit: 100 µg/m³</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={pollutants.o3}
                        onChange={(e) => handleInputChange('o3', e.target.value)}
                        className="w-20 px-2 py-1 text-right text-sm font-semibold rounded bg-slate-800 border border-slate-700 text-white"
                      />
                      <span className="text-xs text-slate-400">µg/m³</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    step="0.5"
                    value={pollutants.o3}
                    onChange={(e) => handleInputChange('o3', e.target.value)}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition transform active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Predicting AQI...' : `Predict AQI for ${cityName || 'City'}`}
              </button>
            </form>

            {error && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <span className="text-rose-400 font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right: Results Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Model Prediction Result
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {cityName || 'General'}
                </span>
              </div>

              {/* AQI Score Display */}
              <div className="text-center py-4">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
                  Predicted Air Quality Index
                </div>
                <div className={`text-6xl sm:text-7xl font-black tracking-tight font-mono transition-colors ${theme.textColor}`}>
                  {prediction ? prediction.predicted_aqi.toFixed(1) : '--'}
                </div>

                {/* Color-Coded Category Badge */}
                <div className="mt-4 flex justify-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${theme.bg}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`}></span>
                    <span>{prediction ? prediction.category : 'Awaiting Input'}</span>
                  </span>
                </div>
              </div>

              {/* Health Advisory */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Health Advisory</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{theme.summary}</p>
              </div>

              {/* Pollutant Relative Limits Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Pollutants vs 24h Safe Limit
                </div>
                <div className="space-y-1.5">
                  {Object.entries(CPCB_THRESHOLDS).map(([key, info]) => {
                    const val = pollutants[key] || 0;
                    const pct = Math.min(250, Math.round((val / info.limit) * 100));
                    let barColor = 'bg-emerald-500';
                    if (pct > 200) barColor = 'bg-rose-500';
                    else if (pct > 100) barColor = 'bg-amber-500';

                    return (
                      <div key={key}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-300 font-medium">{key.toUpperCase()} ({val} {info.unit})</span>
                          <span className={pct > 100 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Indian CPCB Reference Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider">
                CPCB Standard Category Buckets
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                  <span className="font-bold">0 - 50: Good</span>
                  <span>Minimal Impact</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-lime-950/30 border border-lime-900/40 text-lime-300">
                  <span className="font-bold">51 - 100: Satisfactory</span>
                  <span>Minor Breathing Discomfort</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-amber-950/30 border border-amber-900/40 text-amber-300">
                  <span className="font-bold">101 - 200: Moderate</span>
                  <span>Asthma / Heart Discomfort</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-orange-950/30 border border-orange-900/40 text-orange-300">
                  <span className="font-bold">201 - 300: Poor</span>
                  <span>Unhealthy on Exposure</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300">
                  <span className="font-bold">301 - 400: Very Poor</span>
                  <span>Respiratory Illness</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-purple-950/40 border border-purple-900/40 text-purple-300">
                  <span className="font-bold">401+: Severe</span>
                  <span>Hazardous Health Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        React (Vite) + Tailwind CSS • Air Quality Index Predictor Microservice
      </footer>
    </div>
  );
}
