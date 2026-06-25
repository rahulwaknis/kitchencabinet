import React from 'react'
import { AgentConfig } from '../../lib/agents'
import AgentAvatar from './AgentAvatar'

interface Props {
  agent: AgentConfig
  selected?: boolean
  onDetails?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function AgentCard({ agent, selected, onDetails }: Props) {
  const focusLine = agent.scoringFocus || agent.scoring_focus || 'Distinct perspective on the meal.'
  return (
    <div className={`relative rounded-[1.5rem] border p-4 shadow-sm transition ${selected ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white'} ${agent.color || 'text-slate-900'}`}>
      <div className="absolute right-4 top-4 flex items-center gap-2 text-[0.72rem] font-semibold text-slate-700">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${selected ? 'border-amber-700 bg-amber-100 text-amber-900' : 'border-slate-300 bg-white text-slate-400'}`}>
          {selected ? '✓' : '○'}
        </span>
        <span>{selected ? 'Selected' : 'Select'}</span>
      </div>

      <div className="flex items-start gap-4">
        <AgentAvatar agent={agent} size="md" selected={selected} />
        <div className="min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">{agent.name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-600">{agent.role}</span>
            </div>
            <p className="text-sm text-slate-600">{agent.motto}</p>
          </div>
          <p className="mt-3 text-xs text-slate-500">Focus: {focusLine}</p>
        </div>
      </div>

      {onDetails && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDetails(event)
          }}
          className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Meet {agent.name}
        </button>
      )}
    </div>
  )
}
