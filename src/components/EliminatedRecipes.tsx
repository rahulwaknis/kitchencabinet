import React from 'react'
import { EliminatedRecipe } from '../types'

export default function EliminatedRecipes({ items }: { items: EliminatedRecipe[] }) {
  return (
    <div className="card space-y-4">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Rejected options</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">What the cabinet ruled out</h3>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">None — the cabinet was decisive.</div>
        ) : (
          items.map((it) => (
            <div key={it.name} className="rounded-3xl border border-rose-200 bg-rose-50/80 p-3 sm:p-4">
              <div className="font-semibold text-slate-900 text-sm sm:text-base">{it.name}</div>
              <div className="mt-1 sm:mt-2 text-sm text-slate-600">Reason: {it.reason}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
