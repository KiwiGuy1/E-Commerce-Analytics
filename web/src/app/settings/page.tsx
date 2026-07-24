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
      <div className="surface rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Client-side preferences for this showcase environment.
        </p>
      </div>

      <div className="surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Live Data</h2>
        <div className="mt-4 space-y-4">
          <label className="surface-muted flex items-center justify-between rounded-xl p-4">
            <span className="text-sm text-slate-700">Enable live polling</span>
            <input
              type="checkbox"
              checked={liveUpdates}
              onChange={(event) => setLiveUpdates(event.target.checked)}
              className="h-4 w-4 accent-slate-900"
            />
          </label>

          <label className="surface-muted block rounded-xl p-4">
            <span className="text-sm text-slate-700">
              Polling interval (ms)
            </span>
            <input
              type="number"
              min={1000}
              step={500}
              value={pollIntervalMs}
              onChange={(event) =>
                setPollIntervalMs(Number(event.target.value))
              }
              className="field mt-2 w-full text-sm"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={savePreferences} className="btn-primary text-sm">
            Save preferences
          </button>
          <button onClick={resetPreferences} className="btn-secondary text-sm">
            Reset defaults
          </button>
        </div>

        {savedAt && (
          <p className="mt-4 text-sm text-emerald-700">
            Saved at {savedAt.toLocaleTimeString("en-US")}
          </p>
        )}
      </div>

      <div className="surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Showcase Mode</h2>
        <p className="mt-2 text-sm text-slate-600">
          This project intentionally runs without authentication to keep
          reviewer setup simple. Use seeded data and live simulator updates to
          demonstrate product behavior quickly.
        </p>
      </div>
    </div>
  );
}
