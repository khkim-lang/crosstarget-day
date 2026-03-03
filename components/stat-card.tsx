"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  change: string
  positive: boolean
  index: number
}

export function StatCard({ icon: Icon, label, value, change, positive, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="glass-card rounded-[2rem] p-6 flex flex-col gap-4 cursor-default group"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/8 transition-colors">
          <Icon className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-foreground transition-colors" />
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            positive
              ? "bg-[hsl(160,60%,45%)]/15 text-[hsl(160,60%,55%)]"
              : "bg-[hsl(0,72%,55%)]/15 text-[hsl(0,72%,65%)]"
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{label}</p>
      </div>
    </motion.div>
  )
}
