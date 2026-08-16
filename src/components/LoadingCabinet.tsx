import React from 'react'
import { SELECTABLE_AGENTS, MODERATOR } from '../../lib/agents'
import AgentAvatar from './AgentAvatar'

export default function LoadingCabinet({ selectedIds = [] }: { selectedIds?: string[] }) {
  const agentsToShow = SELECTABLE_AGENTS.filter((a) => selectedIds.includes(a.id))

  return (
    <div className="card space-y-5">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Cabinet in session</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">Recipes are entering the cabinet floor</h3>
        <p className="text-sm text-slate-600 mt-2">The agents are checking your pantry, timing, and dinner trade-offs.</p>
      </div>
      <div className="space-y-3">
        {agentsToShow.map((agent) => (
          <div key={agent.id} className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm flex items-center gap-3">
            <AgentAvatar agent={agent} size="sm" selected={false} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">{agent.loadingLine}</div>
            </div>
            <span className="h-2.5 w-8 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 animate-pulse inline-block" />
          </div>
        ))}

        <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm flex items-center gap-3">
          <AgentAvatar agent={MODERATOR as any} size="sm" selected={false} />
          <div>
            <div className="text-sm font-semibold text-slate-900">{MODERATOR.name}</div>
            <div className="text-sm text-slate-600 mt-1">{MODERATOR.loadingLine}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
