import React from 'react'
import { ParsedInventory } from '../types'

export default function ParsedInventoryView({ inventory }: { inventory: ParsedInventory }) {
  const groups: [keyof ParsedInventory, string][] = [
    ['proteins', 'Proteins'],
    ['vegetables', 'Vegetables'],
    ['carbs', 'Carbs'],
    ['dairy', 'Dairy'],
    ['leftovers', 'Leftovers'],
    ['urgent_use', 'Urgent Use'],
    ['assumed_staples', 'Assumed Staples'],
  ]

  return (
    <div className="card space-y-5">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Inventory parsed</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">What the cabinet found</h3>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3.5">
        {groups.map(([key, label]) => (
          <div key={key} className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-3">
            <div className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold">{label}</div>
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {inventory[key].length === 0 ? (
                <span className="tag empty-chip text-xs">None</span>
              ) : (
                inventory[key].map((it) => (
                  <span key={it} className="tag bg-amber-100 text-amber-800 border-transparent text-xs">
                    {it}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
