"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Sparkles,
  X,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Users", active: false },
  { icon: FolderKanban, label: "Projects", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-4 top-4 bottom-4 w-[260px] glass-panel rounded-[2.5rem] z-50 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1rem] bg-[hsl(225,70%,60%)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-foreground tracking-tight">
                  Prism
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[hsl(var(--muted-foreground))]"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1.5">
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 min-h-[44px] rounded-full transition-all duration-200 ${
                    item.active
                      ? "glass-panel-hover text-foreground"
                      : "text-[hsl(var(--muted-foreground))] hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 min-h-[44px] rounded-full text-[hsl(var(--muted-foreground))] hover:text-foreground hover:bg-white/5 transition-all duration-200 w-full"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">Sign Out</span>
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
