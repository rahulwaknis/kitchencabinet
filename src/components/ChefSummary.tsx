import React from 'react'

export default function ChefSummary({ text }: { text: string }) {
  return (
    <div className="card summary-card space-y-4">
      <div>
        <p className="text-xs sm:text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Cabinet conclusion</p>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mt-2">Cabinet Moderator&apos;s final take</h3>
      </div>
      <p className="text-sm sm:text-base text-slate-700 leading-7">{text}</p>
    </div>
  )
}
