"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Tag, ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface DetailItem {
  id: number
  icon: LucideIcon
  color: string
  title: string
  description: string
  time: string
}

export function DetailPanel({
  item,
  onClose,
}: {
  item: DetailItem | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-panel z-50 lg:right-4 lg:top-4 lg:bottom-4 lg:rounded-[2.5rem] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-foreground">Detail View</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-8">
                <div
                  className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="glass-card rounded-[1.25rem] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">Timestamp</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.time}</p>
                </div>
                <div className="glass-card rounded-[1.25rem] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">Category</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">System Event</p>
                </div>
              </div>

              {/* Extended details */}
              <div className="glass-card rounded-[1.5rem] p-5 mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Event Details</h4>
                <div className="space-y-3">
                  {[
                    { label: "Event ID", value: `EVT-${String(item.id).padStart(4, "0")}` },
                    { label: "Source", value: "system.automation" },
                    { label: "Priority", value: "Normal" },
                    { label: "Status", value: "Processed" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">{row.label}</span>
                      <span className="text-foreground font-mono text-xs">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related items */}
              <h4 className="text-sm font-medium text-foreground mb-3">Related Events</h4>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-[1rem] bg-white/3 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-xs text-[hsl(var(--muted-foreground))] flex-1">
                      Related event #{item.id * 10 + i}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div className="p-6 pt-4 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-full bg-[hsl(225,70%,60%)] text-white text-sm font-medium hover:bg-[hsl(225,70%,65%)] transition-colors"
              >
                View Full Report
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
