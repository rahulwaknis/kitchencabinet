import React from 'react'
import AgentToggleRow from './AgentToggleRow'
import { SELECTABLE_AGENTS, MODERATOR } from '../../lib/agents'

export default function AgentRoster({
  selectedIds,
  onToggle,
  maxSelectable = 3,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
  maxSelectable?: number
}) {
  const selectedCount = selectedIds.length

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-600">{selectedCount} of {maxSelectable} agents selected</p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm divide-y divide-slate-200">
        {SELECTABLE_AGENTS.map((agent) => (
          <AgentToggleRow
            key={agent.id}
            agent={agent}
            selected={selectedIds.includes(agent.id)}
            onToggle={() => onToggle(agent.id)}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5">
        <div className="font-medium text-slate-700">{MODERATOR.name}</div>
        <div className="mt-0.5 text-sm leading-5 text-slate-500">
          Always included to summarize the debate and call the final vote.
        </div>
      </div>
    </div>
  )
}
