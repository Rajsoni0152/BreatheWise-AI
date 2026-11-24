import React, { useState, useEffect } from 'react';
import {
  Home,
  Bed,
  Flame,
  Monitor,
  CheckCircle,
  AlertCircle,
  Wind,
  Droplets,
  Sparkles,
  Leaf,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { fetchIndoorAdvisor } from '../api/client';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';

export function IndoorView() {
  const [advisorData, setAdvisorData] = useState(null);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);

  // Interactive IAQ Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'True HEPA air purifier active in bedroom at least 1.5m from bed', checked: true },
    { id: 2, text: 'Range exhaust hood turned ON before cooking; pots covered with lids', checked: true },
    { id: 3, text: 'Exterior windows sealed during morning/night temperature inversion', checked: true },
    { id: 4, text: 'Damp mopping used for floor dust instead of dry sweeping or vacuuming', checked: false },
    { id: 5, text: 'Door threshold draft stopper installed at front door to block hallway smog', checked: false },
    { id: 6, text: 'Indoor humidity maintained between 40% - 50% to prevent airway irritation', checked: true }
  ]);

  useEffect(() => {
    fetchIndoorAdvisor().then((data) => {
      setAdvisorData(data);
    });
  }, []);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.checked).length;
  const scorePercent = Math.round((completedCount / checklist.length) * 100);

  const rooms = advisorData?.rooms || [
    {
      room: 'Bedroom & Sleeping Sanctuary',
      icon: 'Bed',
      risk_level: 'High (8 hours continuous exposure)',
      key_rules: [
        'Keep bedroom doors and windows shut throughout the nocturnal temperature inversion (10 PM - 8 AM).',
        'Place a True HEPA purifier 1.5 meters away from head of the bed on quiet whisper mode.',
        'Use hypoallergenic, tightly woven pillow encasings to block fine dust mite allergens.',
        'Add a Snake Plant (Sansevieria)—unlike most plants, it converts CO2 to Oxygen at night.'
      ]
    },
    {
      room: 'Kitchen & Cooking Zone',
      icon: 'Flame',
      risk_level: 'Critical (Combustion emissions)',
      key_rules: [
        'Always activate the kitchen range exhaust 2 minutes BEFORE igniting the gas burner.',
        'Cook with tight-fitting lids: cuts cooking time by 30% and traps oil aerosols.',
        'Avoid deep-frying and high-smoke charring during severe smog alerts.',
        'Consider transitioning to an electric induction plate to eliminate indoor nitrogen dioxide (NO2).'
      ]
    },
    {
      room: 'Living Room & Entryway',
      icon: 'Home',
      risk_level: 'Moderate (Frequent door openings)',
      key_rules: [
        'Place double rubber weather-strips or draft stoppers under the main entrance door.',
        'Establish a clean-entry threshold: remove outdoor shoes and jackets at the door.',
        'Damp mop hard floors with water and mild soap; never dry-sweep or use harsh aerosol spray air fresheners.',
        'Maintain indoor humidity between 40% and 50% using a clean ultrasonic humidifier.'
      ]
    }
  ];

  const currentRoom = rooms[selectedRoomIdx] || rooms[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-emerald-400" />
            Indoor Air Quality (IAQ) Advisor
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Science-backed strategies to keep your home's air clean, safe, and low-particulate during severe smog.
          </p>
        </div>

        {/* Live IAQ Shield Score */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg">
            {scorePercent}%
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Home Air Shield</span>
            <span className="text-xs text-white font-medium">
              {completedCount} of {checklist.length} Protocols Active
            </span>
          </div>
        </div>
      </div>

      {/* Room-by-Room Interactive Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Room Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Select Living Zone
          </label>
          {rooms.map((room, idx) => {
            const isSelected = selectedRoomIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedRoomIdx(idx)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {idx === 0 ? <Bed className="w-5 h-5" /> : idx === 1 ? <Flame className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">{room.room}</h4>
                    <span className="text-[11px] text-slate-400">{room.risk_level}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Zone Guidance Card (8 cols) */}
        <Card className="lg:col-span-8">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Target Zone Protocols</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{currentRoom.room}</h3>
            </div>
            <Badge variant="orange" size="sm">
              {currentRoom.risk_level}
            </Badge>
          </div>

          <div className="space-y-3.5">
            {currentRoom.key_rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3 hover:border-emerald-500/30 transition"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive IAQ Checklist & NASA Plant Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Checklist */}
        <Card>
          <CardHeader
            title="Interactive Clean Home Checklist"
            subtitle="Check off completed actions to boost your indoor defense score"
            icon={CheckSquare}
          />
          <div className="space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  item.checked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {item.checked ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className={`text-xs sm:text-sm ${item.checked ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* NASA Air-Purifying Flora Guide */}
        <Card>
          <CardHeader
            title="NASA-Proven Air-Filtering Flora"
            subtitle="Natural botanical bio-filters that enhance indoor oxygen & capture volatile compounds"
            icon={Leaf}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(advisorData?.top_purifying_plants || [
              { name: 'Snake Plant (Sansevieria)', benefit: 'Releases nighttime oxygen, traps formaldehyde & benzene' },
              { name: 'Spider Plant (Chlorophytum)', benefit: 'Removes carbon monoxide & xylene, pet safe' },
              { name: 'Peace Lily (Spathiphyllum)', benefit: 'Filters mold spores, thrives in low light' },
              { name: 'Areca Palm', benefit: 'Natural humidity stabilizer and air purifier' }
            ]).map((plant, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">🌿</span>
                    <h4 className="font-semibold text-xs text-white">{plant.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{plant.benefit}</p>
                </div>
                <span className="text-[10px] text-teal-400 mt-2 font-medium">NASA Clean Air Study</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
