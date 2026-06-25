import React from 'react'
import { AgentConfig } from '../../lib/agents'
import AgentAvatar from './AgentAvatar'

interface Props {
  agent: AgentConfig | null
  onClose: () => void
}

export default function AgentDetailModal({ agent, onClose }: Props) {
  React.useEffect(() => {
    if (!agent) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [agent, onClose])

  if (!agent) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-detail-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <AgentAvatar agent={agent} size="lg" selected={false} />
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-amber-800 font-semibold">{agent.role}</div>
              <h2 id="agent-detail-title" className="text-2xl font-semibold text-slate-900 mt-2">{agent.name}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Motto</div>
            <p className="mt-2 text-slate-900">{agent.motto}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Personality</div>
              <p className="mt-2">{agent.personality}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Speech style</div>
              <p className="mt-2">{agent.speechStyle}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Cares about</div>
              <p className="mt-2">{agent.caresAbout}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Objects to</div>
              <p className="mt-2">{agent.objectsTo}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Example line</div>
            <p className="mt-2 italic text-slate-900">“{agent.exampleLine}”</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Scoring focus</div>
            <p className="mt-2">{agent.scoringFocus || agent.scoring_focus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
