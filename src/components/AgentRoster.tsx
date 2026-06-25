import React from 'react'
import AgentCard from './AgentCard'
import AgentDetailModal from './AgentDetailModal'
import { SELECTABLE_AGENTS, MODERATOR, AgentConfig } from '../../lib/agents'

export default function AgentRoster({
  selectedIds,
  onToggle,
  maxSelectable = 5,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
  maxSelectable?: number
}) {
  const [detailAgent, setDetailAgent] = React.useState<AgentConfig | null>(null)
  const selectedCount = selectedIds.length

  return (
    <div className="card space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Choose Your Kitchen Cabinet</p>
          <h3 className="text-xl font-semibold text-slate-900 mt-2">Select up to {maxSelectable} agents</h3>
          <div className="text-sm text-slate-600 mt-1">Selected: {selectedCount} of {maxSelectable}</div>
          {selectedCount > maxSelectable && (
            <div className="text-sm text-rose-700 mt-1">The cabinet table only has five chairs. Deselect someone first.</div>
          )}
        </div>
        <div className="text-sm text-slate-500">Final Moderator: <span className="font-semibold">{MODERATOR.name}</span></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SELECTABLE_AGENTS.map((a: AgentConfig) => {
          const isSelected = selectedIds.includes(a.id)
          const disabled = !isSelected && selectedCount >= maxSelectable
          return (
            <div
              key={a.id}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onClick={() => {
                if (disabled) return
                onToggle(a.id)
              }}
              onKeyDown={(e) => {
                if (disabled) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggle(a.id)
                }
              }}
              aria-pressed={isSelected}
              aria-disabled={disabled}
              className={`relative cursor-pointer rounded-[1.5rem] ${disabled ? 'opacity-60' : 'hover:shadow-lg'} focus:outline-none focus:ring-2 focus:ring-amber-300`}
            >
              <AgentCard
                agent={a as any}
                selected={isSelected}
                onDetails={() => setDetailAgent(a)}
              />
            </div>
          )
        })}
      </div>
      <AgentDetailModal agent={detailAgent} onClose={() => setDetailAgent(null)} />
    </div>
  )
}
