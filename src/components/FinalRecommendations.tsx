import React from 'react'
import { FinalRecommendation } from '../types'

export default function FinalRecommendations({ items }: { items: FinalRecommendation[] }) {
  return (
    <div className="card space-y-5">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Final cabinet picks</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">What to cook tonight</h3>
      </div>
      <div className="grid gap-4 sm:gap-5">
        {items.map((r) => (
          <div key={r.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{r.rank}. {r.name}</div>
                <div className="mt-2 sm:mt-3 text-sm text-slate-600">{r.why_selected}</div>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-amber-900 whitespace-nowrap">{r.estimated_time_minutes}m</div>
            </div>
            <div className="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 text-sm">
              <div className="text-slate-700"><span className="font-semibold">Uses:</span> {r.uses.join(', ')}</div>
              <div className="text-rose-700"><span className="font-semibold">Missing:</span> {r.missing_ingredients.length > 0 ? r.missing_ingredients.join(', ') : 'None'}</div>
            </div>
            <div className="mt-4 sm:mt-5">
              <div className="text-sm font-semibold text-slate-900">Steps</div>
              <ol className="list-decimal list-inside mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-sm text-slate-600">
                {r.steps.map((s, i) => <li key={i} className="ml-2">{s}</li>)}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
