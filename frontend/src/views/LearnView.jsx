import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Shield,
  Wind,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react';
import { Card, CardHeader } from '../components/Common/Card';
import { Badge } from '../components/Common/Badge';

export function LearnView() {
  const [activeSection, setActiveSection] = useState('inversion');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          Atmospheric Science & Smog Defense Guide
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Master the science of thermal inversions, aerosol filtration mechanics, and respiratory epidemiology.
        </p>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'inversion', label: 'Winter Thermal Inversion' },
          { id: 'particulates', label: 'PM2.5 vs PM10 Scale' },
          { id: 'masks', label: 'Respirators & Mask Guide' },
          { id: 'diy_filter', label: 'DIY Corsi-Rosenthal Box' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSection === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Winter Thermal Inversion Guide */}
      {activeSection === 'inversion' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="The Thermal Inversion Phenomenon: Why Winter Smog Stagnates"
              subtitle="Understand why pollution levels skyrocket between sunset and sunrise"
              icon={Layers}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>☀️ Normal Day Conditions</span>
                </div>
                <p>
                  Under normal sunny conditions, solar radiation warms the earth's surface. Warm air near the ground
                  is less dense and naturally ascends high into the cooler upper atmosphere.
                </p>
                <p>
                  This natural vertical convection carries vehicular exhaust, smoke, and industrial particulate matter upward,
                  dispersing pollutants safely into higher tropospheric winds.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <span>❄️ Winter Nocturnal Inversion (The Smog Trap)</span>
                </div>
                <p>
                  On long, clear winter nights, the land rapidly radiates its heat into space, chilling the air immediately
                  above the ground.
                </p>
                <p>
                  A layer of warmer air moves aloft, creating a <strong>thermal "lid" or cap</strong>. Because cold air is dense
                  and heavy, it cannot rise vertically. All traffic soot, biomass smoke, and dust remain compressed in a shallow
                  layer right at human breathing height.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Practical Rule of Thumb:</strong>
                Never go for vigorous aerobic runs or open windows between <strong>6:00 AM – 9:30 AM</strong> during winter.
                Wait until <strong>1:00 PM – 3:30 PM</strong> when solar heating dissolves the inversion layer.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. Particulate Scale Guide */}
      {activeSection === 'particulates' && (
        <Card>
          <CardHeader
            title="Understanding Particle Size: Why PM2.5 is Deadly"
            subtitle="Comparing micro-pollutants against biological barriers"
            icon={Wind}
          />

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                  70µm
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Human Hair Strand</h4>
                  <p className="text-xs text-slate-400">Reference benchmark: approximately 50 to 70 micrometers in diameter.</p>
                </div>
              </div>
              <Badge variant="slate" size="sm">Visible to eye</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400">
                  10µm
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Coarse Particulate (PM10)</h4>
                  <p className="text-xs text-slate-400">
                    Road dust, pollen, mold. Trapped largely in the upper nasal passages and trachea.
                  </p>
                </div>
              </div>
              <Badge variant="amber" size="sm">Nasal mucosal filter</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-bold text-rose-400">
                  2.5µm
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Fine Particulate (PM2.5)</h4>
                  <p className="text-xs text-slate-300">
                    1/30th hair width. Bypasses nasal cilia, penetrates deep into alveolar sacs, and translocates directly
                    into the arterial bloodstream, elevating cardiovascular and stroke risks.
                  </p>
                </div>
              </div>
              <Badge variant="rose" size="sm">Systemic danger</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* 3. Masks & Respirators Guide */}
      {activeSection === 'masks' && (
        <Card>
          <CardHeader
            title="Respiratory Protection Matrix: N95 vs Surgical vs Cloth"
            subtitle="Why fabric weave and face perimeter seals make or break protection"
            icon={Shield}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">Mask Standard</th>
                  <th className="py-3 px-3">PM2.5 Filtration</th>
                  <th className="py-3 px-3">Perimeter Seal</th>
                  <th className="py-3 px-3">Smog Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">N95 / FFP2 / KN95</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">&gt; 95% down to 0.3 µm</td>
                  <td className="py-3 px-3 text-emerald-400">Airtight with nose clip</td>
                  <td className="py-3 px-3">
                    <Badge variant="emerald" size="sm">Gold Standard for Smog</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">N99 / FFP3</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">&gt; 99% down to 0.3 µm</td>
                  <td className="py-3 px-3 text-emerald-400">Maximum hermetic seal</td>
                  <td className="py-3 px-3">
                    <Badge variant="emerald" size="sm">Best for Severe Alerts (&gt;300)</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400">Surgical Blue Mask</td>
                  <td className="py-3 px-3 text-amber-400">20% - 35% (Leaking sides)</td>
                  <td className="py-3 px-3 text-rose-400">Loose gap at cheeks & nose</td>
                  <td className="py-3 px-3">
                    <Badge variant="orange" size="sm">Ineffective for Fine PM2.5</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400">Cloth / Cotton Mask</td>
                  <td className="py-3 px-3 text-rose-400">&lt; 15% (Pores are 50x too large)</td>
                  <td className="py-3 px-3 text-rose-400">Non-sealing</td>
                  <td className="py-3 px-3">
                    <Badge variant="rose" size="sm">Zero PM2.5 Protection</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. DIY Corsi-Rosenthal Box Guide */}
      {activeSection === 'diy_filter' && (
        <Card>
          <CardHeader
            title="How to Build a DIY Corsi-Rosenthal Air Filter"
            subtitle="A low-cost, high-CADR emergency air purifier proven by environmental engineers"
            icon={Cpu}
          />

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              When commercial air purifiers are sold out during winter smog crises, you can construct a proven
              Corsi-Rosenthal box filter in 20 minutes for under $40 that outperforms $400 commercial units in Clean Air Delivery Rate (CADR).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 text-xs block mb-1">Step 1: Materials</span>
                <p className="text-[11px] text-slate-400">
                  One 20-inch standard box fan, 4 MERV-13 (or higher) furnace filters (20"x20"), cardboard base, duct tape.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-teal-400 text-xs block mb-1">Step 2: Box Formation</span>
                <p className="text-[11px] text-slate-400">
                  Tape the four MERV-13 filters together into a cube. Ensure the airflow direction arrows face INWARD toward center.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan-400 text-xs block mb-1">Step 3: Fan Mounting</span>
                <p className="text-[11px] text-slate-400">
                  Tape the box fan on top, blowing air OUTWARD (upwards into room). Tape cardboard as the bottom floor.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 text-xs block mb-1">Step 4: Seal All Gaps</span>
                <p className="text-[11px] text-slate-400">
                  Seal every edge with duct tape to prevent air bypass. Turn on low or medium speed for silent continuous air cleaning.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
