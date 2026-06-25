import React from 'react'

const agents = [
  'Inventory Agent is sorting ingredients',
  'Recipe Agent is drafting possibilities',
  'Nutrition Agent is checking balance',
  'Time Agent is checking effort',
  'Waste-Saver Agent is hunting for leftovers',
  'Feasibility Agent is checking cookability',
  'Final Chef Agent is calling the vote',
]

export default function LoadingAgents() {
  return (
    <div className="card">
      <h3 className="font-semibold">Agents working</h3>
      <ul className="mt-3 space-y-3">
        {agents.map((a, i) => (
          <li key={a} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse inline-block" />
            <span className="text-sm text-gray-700">{a}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
