import React from 'react'
import { AgentScoreItem, RecipeEvaluation } from '../types'

export default function AgentScorecard({
  legacyItems,
  evaluations,
}: {
  legacyItems?: AgentScoreItem[]
  evaluations?: RecipeEvaluation[]
}) {
  if (!evaluations && !legacyItems) return null

  return (
    <div className="card space-y-5">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Cabinet Evaluation</p>
        <h3 className="text-xl font-semibold text-slate-900 mt-3">How the cabinet rated the recipes</h3>
      </div>

      {evaluations ? (
        <div className="space-y-4">
          {evaluations.map((ev) => (
            <div key={ev.recipe_name} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{ev.recipe_name}</div>
                <div className="score-pill">{Math.round(ev.average_score)}</div>
              </div>
              <div className="mt-3 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 text-sm text-slate-600">
                {ev.agent_scores.map((as) => (
                  <div key={as.agent_id}><span className="font-semibold">{as.agent_icon} {as.agent_name}:</span> {as.note} <span className="ml-2 text-slate-500">({as.score})</span></div>
                ))}
              </div>
              {ev.moderator_note ? <div className="mt-3 text-sm text-slate-700"><strong>Chef:</strong> {ev.moderator_note}</div> : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {legacyItems!.map((it) => (
            <div key={it.recipe_name} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="font-semibold text-slate-900">{it.recipe_name}</div>
              <div className="mt-3 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 text-sm text-slate-600">
                <div><span className="font-semibold">Nutrition:</span> {it.nutrition_score}</div>
                <div><span className="font-semibold">Time:</span> {it.time_score}</div>
                <div><span className="font-semibold">Waste:</span> {it.waste_saver_score}</div>
                <div><span className="font-semibold">Feasibility:</span> {it.feasibility_score}</div>
              </div>
              <div className="mt-3 text-sm text-slate-600">
                <div><strong>Notes:</strong></div>
                <div className="mt-2 text-xs text-slate-700">{it.agent_notes.nutrition_agent}</div>
                <div className="mt-1 text-xs text-slate-700">{it.agent_notes.time_agent}</div>
                <div className="mt-1 text-xs text-slate-700">{it.agent_notes.waste_saver_agent}</div>
                <div className="mt-1 text-xs text-slate-700">{it.agent_notes.feasibility_agent}</div>
                {it.agent_notes.taste_agent ? <div className="mt-1 text-xs text-slate-700">{it.agent_notes.taste_agent}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
