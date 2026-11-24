import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  UserCheck,
  Activity,
  Navigation,
  Sparkles,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  AlertTriangle
} from 'lucide-react';
import { useAirQuality } from '../context/AirQualityContext';
import { generateDailyRoutine } from '../api/client';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';
import { Button } from '../components/Common/Button';

const LIFESTYLES = [
  { id: 'student', title: 'Student / Scholar', icon: '🎓', desc: 'Focus on classroom ventilation, transit, and library air quality' },
  { id: 'office_worker', title: 'Corporate Professional', icon: '💼', desc: 'Optimizing commute windows, HVAC air intake, and midday walks' },
  { id: 'outdoor_worker', title: 'Outdoor / Field Worker', icon: '👷', desc: 'Extended respirator duration, dust barriers, hydration' },
  { id: 'parent_with_child', title: 'Parent & Toddler', icon: '👶', desc: 'Stroller particulate protection, nursery HEPA filtration' },
  { id: 'senior_asthma', title: 'Senior / Respiratory Care', icon: '🫁', desc: 'Strict zero-inversion exposure, emergency inhaler readiness' }
];

const EXERCISES = [
  { id: 'morning_jog', label: 'Morning Cardio / Jog' },
  { id: 'evening_walk', label: 'Evening Walk' },
  { id: 'indoor_gym', label: 'Indoor Gym / Yoga' },
  { id: 'no_exercise', label: 'Rest / Minimal Exertion' }
];

const COMMUTES = [
  { id: 'metro_transit', label: 'Metro / Rail' },
  { id: 'bike_scooter', label: 'Motorbike / Scooter' },
  { id: 'carpool_car', label: 'Car / Carpool' },
  { id: 'walk_cycle', label: 'Walking / Cycling' }
];

export function RoutineView() {
  const { selectedCity, data } = useAirQuality();
  const currentAqi = data?.current?.us_aqi || 220;
  const pm25 = data?.current?.pm2_5 || 145.0;

  const [lifestyle, setLifestyle] = useState('office_worker');
  const [exercise, setExercise] = useState('indoor_gym');
  const [commute, setCommute] = useState('metro_transit');
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateDailyRoutine({
        city: selectedCity,
        aqi: currentAqi,
        pm2_5: pm25,
        lifestyle,
        exercise_preference: exercise,
        commute_mode: commute
      });
      setRoutine(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [selectedCity, currentAqi]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-emerald-400" />
            Smart Daily Routine Builder
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Personalized diurnal schedule minimizing exposure to winter temperature inversion smog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            {selectedCity} (AQI: {currentAqi})
          </Badge>
        </div>
      </div>

      {/* Controls Card: Persona, Exercise, Commute */}
      <Card>
        <CardHeader
          title="1. Personalize Your Profile & Daily Demands"
          subtitle="Choose your lifestyle, exercise preference, and transit mode for tailored guidance"
          icon={UserCheck}
        />

        {/* Persona Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Select Lifestyle Persona
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {LIFESTYLES.map((item) => (
              <button
                key={item.id}
                onClick={() => setLifestyle(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  lifestyle === item.id
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-2xl mb-1.5 block">{item.icon}</span>
                  <p className="font-semibold text-xs text-slate-200">{item.title}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Commute & Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Exercise Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setExercise(ex.id)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                    exercise === ex.id
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Primary Commute Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMUTES.map((cm) => (
                <button
                  key={cm.id}
                  onClick={() => setCommute(cm.id)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                    commute === cm.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          loading={loading}
          icon={Sparkles}
          variant="primary"
          className="w-full sm:w-auto"
        >
          Regenerate Personalized Schedule
        </Button>
      </Card>

      {/* Routine Display Section */}
      {routine && (
        <div className="space-y-6">
          {/* Key Diurnal Windows Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Peak Pollution Window (Inversion Peak)
                </span>
                <p className="font-semibold text-white text-sm mt-0.5">{routine.peak_pollution_window}</p>
                <p className="text-xs text-slate-300 mt-1">
                  Keep windows sealed and avoid outdoor physical exertion during these hours.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Best Outdoor & Ventilation Window
                </span>
                <p className="font-semibold text-white text-sm mt-0.5">{routine.best_outdoor_window}</p>
                <p className="text-xs text-slate-300 mt-1">
                  Solar heating breaks surface inversion. Safest slot for a quick walk or 10-minute ventilation.
                </p>
              </div>
            </div>
          </div>

          {/* Hour-by-Hour Timeline Schedule */}
          <Card>
            <CardHeader
              title="Hour-by-Hour Smog Shield Routine"
              subtitle={routine.overall_guidance}
              icon={Clock}
            />

            <div className="space-y-4">
              {routine.hourly_schedule.map((slot, idx) => {
                const isSevere = slot.air_quality_risk === 'Severe';
                const isHigh = slot.air_quality_risk === 'High';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0 text-xs font-bold">
                        {slot.time_window}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-100">{slot.activity}</h4>
                          <Badge
                            variant={isSevere ? 'rose' : isHigh ? 'orange' : 'emerald'}
                            size="sm"
                          >
                            {slot.air_quality_risk} Risk
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{slot.recommendation}</p>
                      </div>
                    </div>

                    <div className="md:max-w-xs p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 shrink-0">
                      <span className="font-semibold block text-slate-300 mb-0.5">Shield Action:</span>
                      {slot.protective_action}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Key Indoor Habits */}
          <Card>
            <CardHeader
              title="Essential Indoor Habits for Winter Smog"
              subtitle="Daily micro-actions to maintain clean indoor breathing air"
              icon={CheckCircle2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {routine.key_indoor_habits.map((habit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{habit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
