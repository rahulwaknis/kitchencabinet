import React from 'react'
import { AgentConfig } from '../../lib/agents'

const sizeMap: Record<string, string> = {
  sm: 'h-10 w-10 text-base',
  md: 'h-12 w-12 text-lg',
  lg: 'h-14 w-14 text-2xl',
}

const themeBadge: Record<string, string> = {
  green: 'bg-emerald-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  amber: 'bg-amber-500 text-white',
  teal: 'bg-teal-500 text-white',
  red: 'bg-rose-500 text-white',
  slate: 'bg-slate-500 text-white',
  purple: 'bg-indigo-500 text-white',
  blue: 'bg-sky-500 text-white',
  brown: 'bg-orange-500 text-white',
  beige: 'bg-amber-400 text-slate-900',
  indigo: 'bg-indigo-500 text-white',
  charcoal: 'bg-slate-700 text-white',
}

const themeRing: Record<string, string> = {
  green: 'ring-2 ring-emerald-300',
  yellow: 'ring-2 ring-yellow-300',
  amber: 'ring-2 ring-amber-300',
  teal: 'ring-2 ring-teal-300',
  red: 'ring-2 ring-rose-300',
  slate: 'ring-2 ring-slate-300',
  purple: 'ring-2 ring-indigo-300',
  blue: 'ring-2 ring-sky-300',
  brown: 'ring-2 ring-orange-300',
  beige: 'ring-2 ring-amber-300',
  indigo: 'ring-2 ring-indigo-300',
  charcoal: 'ring-2 ring-slate-400',
}

interface Props {
  agent: AgentConfig
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
}

export default function AgentAvatar({ agent, size = 'md', selected }: Props) {
  const initials = agent.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
  const theme = (agent.colorTheme || 'slate').toLowerCase()
  const badgeStyle = themeBadge[theme] || themeBadge.slate
  const ringStyle = themeRing[theme] || themeRing.slate
  const sizeClass = sizeMap[size]

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm ${ringStyle} ${sizeClass}`}>
      <span className={`flex h-full w-full items-center justify-center rounded-3xl ${agent.color || 'bg-slate-100'} ${agent.color ? 'text-current' : 'text-slate-900'}`}>
        {agent.icon || initials}
      </span>
      <span className="sr-only">{agent.name}</span>
      <div className={`absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white ${badgeStyle}`}>
        <span className="text-[0.7rem] leading-none">{agent.icon}</span>
      </div>
      {selected ? (
        <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[0.65rem] font-bold">
          ✓
        </div>
      ) : null}
    </div>
  )
}
