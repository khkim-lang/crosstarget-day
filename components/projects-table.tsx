"use client"

import { motion } from "framer-motion"
import { MoreHorizontal, ArrowUpRight } from "lucide-react"

const projects = [
  { name: "Nexus Platform", status: "Active", progress: 87, team: 5, color: "hsl(160, 60%, 45%)" },
  { name: "Atlas Migration", status: "In Review", progress: 64, team: 3, color: "hsl(225, 70%, 60%)" },
  { name: "Quantum API", status: "Active", progress: 92, team: 8, color: "hsl(160, 60%, 45%)" },
  { name: "Prism Dashboard", status: "Planning", progress: 23, team: 2, color: "hsl(35, 80%, 60%)" },
  { name: "Orbit Sync", status: "Active", progress: 71, team: 4, color: "hsl(160, 60%, 45%)" },
]

export function ProjectsTable() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card rounded-[2rem] p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Active Projects</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            {projects.length} projects in progress
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 text-xs font-medium text-[hsl(225,70%,60%)] hover:text-[hsl(225,70%,70%)] transition-colors"
        >
          View All <ArrowUpRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] px-3 pb-3">
                Project
              </th>
              <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] px-3 pb-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] px-3 pb-3">
                Progress
              </th>
              <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] px-3 pb-3">
                Team
              </th>
              <th className="w-10 px-3 pb-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => (
              <motion.tr
                key={project.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="group hover:bg-white/3 transition-colors"
              >
                <td className="px-3 py-3 rounded-l-[1rem]">
                  <span className="text-sm font-medium text-foreground">{project.name}</span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${project.color}15`,
                      color: project.color,
                    }}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden max-w-[100px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
                      {project.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(project.team, 3) }).map((_, j) => (
                      <div
                        key={j}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[9px] font-medium text-[hsl(var(--muted-foreground))]"
                      >
                        {String.fromCharCode(65 + j + i)}
                      </div>
                    ))}
                    {project.team > 3 && (
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-medium text-[hsl(var(--muted-foreground))]">
                        +{project.team - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 rounded-r-[1rem]">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-foreground hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
