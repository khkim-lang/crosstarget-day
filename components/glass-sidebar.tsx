"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Sparkles,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Users", active: false },
  { icon: FolderKanban, label: "Projects", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function GlassSidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="hidden lg:flex flex-col fixed left-4 top-4 bottom-4 w-[240px] glass-panel rounded-[2.5rem] z-30 p-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-[1rem] bg-[hsl(225,70%,60%)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-foreground tracking-tight">
          Prism
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-4 min-h-[44px] rounded-full transition-all duration-200 ${
              item.active
                ? "glass-panel-hover text-foreground"
                : "text-[hsl(var(--muted-foreground))] hover:text-foreground hover:bg-white/5"
            }`}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span className="text-sm font-medium">{item.label}</span>
            {item.active && (
              <motion.div
                layoutId="nav-active"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(225,70%,60%)]"
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-1.5 pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 min-h-[44px] rounded-full text-[hsl(var(--muted-foreground))] hover:text-foreground hover:bg-white/5 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">Sign Out</span>
        </motion.button>
      </div>
    </motion.aside>
  )
}
