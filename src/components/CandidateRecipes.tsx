import React from 'react'
import { CandidateRecipe } from '../types'

export default function CandidateRecipes({ list }: { list: CandidateRecipe[] }) {
  return (
    <div className="card space-y-5">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Candidate recipes</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">The cabinet shortlist</h3>
      </div>
      <div className="grid gap-3 sm:gap-4">
        {list.map((r) => (
          <div key={r.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-base sm:text-lg">{r.name}</div>
                <div className="mt-1 sm:mt-2 text-sm text-slate-600">{r.short_description}</div>
              </div>
              <div className="text-sm font-semibold text-amber-900 bg-amber-100 px-3 py-1 rounded-full whitespace-nowrap">{r.estimated_time_minutes}m</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {r.uses.map((use) => (
                <span key={use} className="tag text-xs sm:text-sm">{use}</span>
              ))}
            </div>
            {r.taste_note ? <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-700"><span className="font-semibold">Taste note:</span> {r.taste_note}</div> : null}
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-rose-700"><span className="font-semibold">Missing:</span> {r.missing_ingredients.length > 0 ? r.missing_ingredients.join(', ') : 'None'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
