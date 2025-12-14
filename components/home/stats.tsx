"use client"

import { useEffect, useState } from "react"

const stats = [
  { label: "Students", value: 1200 },
  { label: "Faculty", value: 85 },
  { label: "Clubs & Teams", value: 35 },
  { label: "Average Class Size", value: 22 },
]

export function Stats() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(1, (t - start) / 1200)
      setProgress(dt)
      if (dt < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="rounded-xl border bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-950 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => {
          const current = Math.floor(s.value * progress)
          return (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {current.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
