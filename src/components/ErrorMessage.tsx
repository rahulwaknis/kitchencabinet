import React from 'react'

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="card rounded-[1.5rem] border border-rose-200 bg-rose-50/80">
      <div className="text-rose-700 font-semibold">Error</div>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </div>
  )
}
