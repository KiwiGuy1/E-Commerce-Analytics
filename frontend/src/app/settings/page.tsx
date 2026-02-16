"use client";

import { useEffect, useState } from "react";

const LIVE_UPDATES_KEY = "ea_live_updates";
const POLL_INTERVAL_KEY = "ea_poll_interval_ms";

export default function SettingsPage() {
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [pollIntervalMs, setPollIntervalMs] = useState(5000);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const savedLive = localStorage.getItem(LIVE_UPDATES_KEY);
    const savedInterval = localStorage.getItem(POLL_INTERVAL_KEY);

    if (savedLive !== null) {
      setLiveUpdates(savedLive === "true");
    }

    if (savedInterval !== null) {
      const parsed = Number(savedInterval);
      if (Number.isFinite(parsed) && parsed >= 1000) {
        setPollIntervalMs(parsed);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem(LIVE_UPDATES_KEY, String(liveUpdates));
    localStorage.setItem(POLL_INTERVAL_KEY, String(pollIntervalMs));
    setSavedAt(new Date());
  };

  const resetPreferences = () => {
    const defaultLive = true;
    const defaultInterval = 5000;
    setLiveUpdates(defaultLive);
    setPollIntervalMs(defaultInterval);
    localStorage.setItem(LIVE_UPDATES_KEY, String(defaultLive));
    localStorage.setItem(POLL_INTERVAL_KEY, String(defaultInterval));
    setSavedAt(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Client-side preferences for this showcase environment.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Live Data</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-sm text-slate-700">Enable live polling</span>
            <input
              type="checkbox"
              checked={liveUpdates}
              onChange={(event) => setLiveUpdates(event.target.checked)}
              className="h-4 w-4 accent-slate-900"
            />
          </label>

          <label className="block rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-sm text-slate-700">Polling interval (ms)</span>
            <input
              type="number"
              min={1000}
              step={500}
              value={pollIntervalMs}
              onChange={(event) => setPollIntervalMs(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={savePreferences}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save preferences
          </button>
          <button
            onClick={resetPreferences}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Reset defaults
          </button>
        </div>

        {savedAt && (
          <p className="mt-4 text-sm text-emerald-700">
            Saved at {savedAt.toLocaleTimeString("en-US")}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Showcase Mode</h2>
        <p className="mt-2 text-sm text-slate-600">
          This project intentionally runs without authentication to keep reviewer setup simple.
          Use seeded data and live simulator updates to demonstrate product behavior quickly.
        </p>
      </div>
    </div>
  );
}
