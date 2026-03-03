"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, UserPlus, CheckCircle2, AlertCircle, GitBranch } from "lucide-react"

const activities = [
  {
    id: 1,
    icon: UserPlus,
    color: "hsl(225, 70%, 60%)",
    title: "New user registered",
    description: "sarah.chen@example.com joined the platform",
    time: "2 min ago",
  },
  {
    id: 2,
    icon: CheckCircle2,
    color: "hsl(160, 60%, 45%)",
    title: "Project deployed",
    description: "Nexus v2.4.1 deployed to production",
    time: "15 min ago",
  },
  {
    id: 3,
    icon: GitBranch,
    color: "hsl(260, 50%, 55%)",
    title: "Branch merged",
    description: "feature/auth-flow merged into main",
    time: "1 hr ago",
  },
  {
    id: 4,
    icon: AlertCircle,
    color: "hsl(35, 80%, 60%)",
    title: "Spike in API errors",
    description: "Error rate increased to 2.3% on /api/users",
    time: "2 hr ago",
  },
  {
    id: 5,
    icon: FileText,
    color: "hsl(225, 70%, 60%)",
    title: "Report generated",
    description: "Monthly analytics report for January",
    time: "4 hr ago",
  },
]

export function ActivityList({ onItemClick }: { onItemClick: (item: (typeof activities)[number]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {activities.map((activity, index) => (
          <motion.button
            key={activity.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.06, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onItemClick(activity)}
            className="flex items-start gap-4 p-4 rounded-[1.5rem] text-left transition-colors min-h-[44px] w-full"
          >
            <div
              className="w-10 h-10 rounded-[0.75rem] flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${activity.color}20` }}
            >
              <activity.icon className="w-[18px] h-[18px]" style={{ color: activity.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5">
              {activity.time}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
