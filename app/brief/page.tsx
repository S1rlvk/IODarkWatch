'use client';

import { useEffect, useState } from 'react';
import { Vessel, ALERT_META, generateVesselData } from '@/app/lib/vessels';

function formatWeekRange(): string {
  const end = new Date();
  const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

export default function WeeklyBriefPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  // Computed client-side only, after mount, so the date range can't differ
  // between server render and client hydration around a day boundary.
  const [weekRange, setWeekRange] = useState<string | null>(null);

  useEffect(() => {
    setVessels(generateVesselData());
    setWeekRange(formatWeekRange());
  }, []);

  const anomalies = vessels.filter((v) => v.alertType !== null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/dashboard" className="text-sm text-blue-400 hover:underline">&larr; Back to dashboard</a>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6 mb-8 text-sm text-yellow-200">
          This is a static mockup of what an automated weekly brief email would contain, built from the same
          simulated dataset as the dashboard. No mailer runs behind this &mdash; see{' '}
          <a href="/about" className="underline">How this works</a>.
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">IODarkWatch Weekly Brief</h1>
        <p className="text-gray-400 mb-10">{weekRange ?? ' '}</p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">This week&apos;s anomalies</h2>
          <div className="space-y-3">
            {anomalies.map((v) => (
              <div key={v.id} className="bg-[#1a1a1a] border border-[#333] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{v.name ?? 'Unidentified Contact'}</span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      color: ALERT_META[v.alertType as Exclude<typeof v.alertType, null>].color,
                      backgroundColor: `${ALERT_META[v.alertType as Exclude<typeof v.alertType, null>].color}20`,
                    }}
                  >
                    {ALERT_META[v.alertType as Exclude<typeof v.alertType, null>].label.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{v.reason}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {v.lat.toFixed(2)}, {v.lng.toFixed(2)} &middot; {v.type}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Week over week</h2>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-red-400">
                {anomalies.filter((v) => v.alertType === 'dark_vessel').length}
              </div>
              <div className="text-sm text-gray-400 mt-1">Dark Vessels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {anomalies.filter((v) => v.alertType === 'ais_gap').length}
              </div>
              <div className="text-sm text-gray-400 mt-1">AIS Gaps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {anomalies.filter((v) => v.alertType === 'spoofing_signature').length}
              </div>
              <div className="text-sm text-gray-400 mt-1">Spoofing Signatures</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
