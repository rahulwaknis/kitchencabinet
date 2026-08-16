import React from 'react'
import { AgentConfig } from '../../lib/agents'

interface Props {
  agent: AgentConfig
  selected: boolean
  onToggle: () => void
}

export default function AgentToggleRow({ agent, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className="flex min-h-[64px] w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 sm:px-5"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-slate-900">{agent.name}</span>
        <span className="mt-0.5 block text-sm leading-5 text-slate-500">{agent.shortDescription}</span>
      </span>

      <span className="shrink-0">
        <span className="sr-only">{selected ? 'On' : 'Off'}</span>
        <span
          aria-hidden="true"
          className={`flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200 ${
            selected ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              selected ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>
      </span>
    </button>
  )
}
