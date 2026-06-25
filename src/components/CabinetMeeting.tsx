import React from 'react'
import { CabinetMeeting as CabinetMeetingType } from '../types'

interface Props {
  meeting: CabinetMeetingType | null | undefined
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'selected':
      return 'bg-emerald-100 text-emerald-800'
    case 'eliminated':
      return 'bg-slate-100 text-slate-700'
    case 'backup':
      return 'bg-amber-100 text-amber-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'selected':
      return 'Selected'
    case 'eliminated':
      return 'Politely Rejected'
    case 'backup':
      return 'Backup Idea'
    default:
      return status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }
}

const getMoodLabel = (mood?: string, tone?: string) => {
  if (mood) return mood
  return tone
}

export default function CabinetMeeting({ meeting }: Props) {
  if (!meeting) {
    return null
  }

  return (
    <div className="space-y-6">
      {meeting.opening_note && (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {meeting.opening_note}
        </div>
      )}

      <div className="space-y-4">
        {meeting.recipe_discussions.map((discussion, idx) => (
          <div key={idx} className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{discussion.recipe_name}</h3>
                <div className="text-sm text-slate-500 mt-1">A quick look at the cabinet’s take.</div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeColor(discussion.status)}`}>
                {getStatusLabel(discussion.status)}
              </span>
            </div>

            {(discussion.supporting_agents.length > 0 || discussion.objecting_agents.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {discussion.supporting_agents.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Supporting: {discussion.supporting_agents.join(', ')}</span>
                )}
                {discussion.objecting_agents.length > 0 && (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-800">Objecting: {discussion.objecting_agents.join(', ')}</span>
                )}
              </div>
            )}

            <div className="mt-5 space-y-4">
              {discussion.dialogue.map((line, lineIdx) => (
                <div key={lineIdx} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl">{line.agent_icon}</span>
                    <span className="text-sm font-semibold text-slate-900">{line.agent_name}</span>
                    {getMoodLabel(line.mood, line.tone) && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-slate-600">
                        {getMoodLabel(line.mood, line.tone)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{line.line}</p>
                </div>
              ))}
            </div>

            {discussion.moderator_decision && (
              <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-900">Chef Kabir’s verdict</div>
                <p className="mt-2 text-sm text-amber-900 leading-6">{discussion.moderator_decision}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {meeting.closing_note && (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {meeting.closing_note}
        </div>
      )}
    </div>
  )
}
