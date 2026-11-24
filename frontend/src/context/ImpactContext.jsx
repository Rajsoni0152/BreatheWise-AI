import React, { createContext, useContext, useState, useEffect } from 'react';
import { logAction as apiLogAction } from '../api/client';

const ImpactContext = createContext(null);

const INITIAL_BADGES = [
  { id: 'first_action', name: 'Smog Sentinel', desc: 'Logged your first clean-air action', icon: 'ShieldCheck', unlocked: true },
  { id: 'clean_commuter', name: 'Clean Commuter', desc: 'Used public transit 3 times', icon: 'Train', unlocked: true },
  { id: 'iaq_shield', name: 'Indoor Oasis', desc: 'Sealed windows & ran HEPA optimization', icon: 'Wind', unlocked: true },
  { id: 'carbon_hero', name: 'Carbon Saver', desc: 'Avoided over 10 kg of CO2 emissions', icon: 'Leaf', unlocked: false },
  { id: 'streak_master', name: '7-Day Streak', desc: 'Logged clean routines 7 days consecutively', icon: 'Flame', unlocked: false }
];

export function ImpactProvider({ children }) {
  const [totalCo2Avoided, setTotalCo2Avoided] = useState(() => {
    const saved = localStorage.getItem('bw_co2_avoided');
    return saved ? parseFloat(saved) : 14.8;
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('bw_eco_points');
    return saved ? parseInt(saved, 10) : 340;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('bw_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [actionsHistory, setActionsHistory] = useState(() => {
    const saved = localStorage.getItem('bw_action_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: 1, type: 'public_transit', title: 'Took Metro instead of driving', co2_saved: 2.4, timestamp: 'Today, 8:45 AM' },
      { id: 2, type: 'hepa_smart_mode', title: 'Optimized HEPA purifier runtime', co2_saved: 0.35, timestamp: 'Yesterday, 10:15 PM' },
      { id: 3, type: 'low_emission_cooking', title: 'Covered cooking pots & used exhaust', co2_saved: 0.45, timestamp: 'Yesterday, 7:30 PM' },
      { id: 4, type: 'carpool', title: 'Carpool ride-share with coworkers', co2_saved: 1.8, timestamp: '2 days ago' }
    ];
  });

  const [badges, setBadges] = useState(INITIAL_BADGES);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bw_co2_avoided', totalCo2Avoided.toString());
    localStorage.setItem('bw_eco_points', points.toString());
    localStorage.setItem('bw_streak', streak.toString());
    localStorage.setItem('bw_action_history', JSON.stringify(actionsHistory));
  }, [totalCo2Avoided, points, streak, actionsHistory]);

  const logUserAction = async (actionType, title, defaultCo2 = 1.5, defaultPts = 30) => {
    try {
      const res = await apiLogAction(actionType);
      const co2 = res.co2_avoided_kg || defaultCo2;
      const pts = res.points_earned || defaultPts;
      
      setTotalCo2Avoided(prev => +(prev + co2).toFixed(2));
      setPoints(prev => prev + pts);
      
      const newEntry = {
        id: Date.now(),
        type: actionType,
        title: title || res.action_type,
        co2_saved: co2,
        timestamp: 'Just now',
        feedback: res.feedback_message,
        assumptions: res.assumptions_explanation
      };
      
      setActionsHistory(prev => [newEntry, ...prev]);

      // Check badge unlock
      if (totalCo2Avoided + co2 >= 10) {
        setBadges(prev => prev.map(b => b.id === 'carbon_hero' ? { ...b, unlocked: true } : b));
      }

      return res;
    } catch {
      // Fallback
      setTotalCo2Avoided(prev => +(prev + defaultCo2).toFixed(2));
      setPoints(prev => prev + defaultPts);
      return { success: true, co2_avoided_kg: defaultCo2, points_earned: defaultPts };
    }
  };

  return (
    <ImpactContext.Provider
      value={{
        totalCo2Avoided,
        points,
        streak,
        actionsHistory,
        badges,
        logUserAction
      }}
    >
      {children}
    </ImpactContext.Provider>
  );
}

export function useImpact() {
  const context = useContext(ImpactContext);
  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }
  return context;
}
