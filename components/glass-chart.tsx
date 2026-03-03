"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Jan", revenue: 4200, users: 2400 },
  { name: "Feb", revenue: 3800, users: 2200 },
  { name: "Mar", revenue: 5100, users: 2900 },
  { name: "Apr", revenue: 4700, users: 3100 },
  { name: "May", revenue: 5800, users: 3400 },
  { name: "Jun", revenue: 6200, users: 3800 },
  { name: "Jul", revenue: 7100, users: 4200 },
  { name: "Aug", revenue: 6800, users: 4500 },
  { name: "Sep", revenue: 7400, users: 4800 },
  { name: "Oct", revenue: 8200, users: 5100 },
  { name: "Nov", revenue: 7900, users: 5400 },
  { name: "Dec", revenue: 9100, users: 5900 },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-[1rem] p-3 min-w-[140px]">
        <p className="text-xs font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-[hsl(var(--muted-foreground))] capitalize">{entry.dataKey}</span>
            <span className="font-mono text-foreground">
              {entry.dataKey === "revenue"
                ? `$${(entry.value / 1000).toFixed(1)}k`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function GlassChart() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card rounded-[2rem] p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Revenue Overview</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Monthly revenue and user growth
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(225,70%,60%)]" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(260,50%,55%)]" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Users</span>
          </div>
        </div>
      </div>

      <div className="h-[260px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(225, 70%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(225, 70%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(260, 50%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(260, 50%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }}
              dx={-4}
              tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(225, 70%, 60%)"
              strokeWidth={2}
              fill="url(#revenueGrad)"
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="hsl(260, 50%, 55%)"
              strokeWidth={2}
              fill="url(#usersGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
