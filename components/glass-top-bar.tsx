"use client"

import { motion } from "framer-motion"
import { Search, Bell, Menu } from "lucide-react"
import { useState } from "react"

export function GlassTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-4 right-4 left-4 lg:left-[272px] z-20 flex items-center gap-3"
    >
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuToggle}
        className="lg:hidden glass-panel w-12 h-12 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Search pill */}
      <motion.div
        animate={{
          boxShadow: searchFocused
            ? "0 0 0 1px rgba(99, 135, 241, 0.4), 0 8px 32px rgba(0,0,0,0.3)"
            : "none",
        }}
        className="flex-1 max-w-xl glass-panel rounded-full flex items-center px-5 h-12 gap-3 transition-all duration-300"
      >
        <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-[hsl(var(--muted-foreground))] outline-none"
        />
        <kbd className="hidden sm:inline-flex h-6 items-center px-2 rounded-md bg-white/5 text-[10px] font-mono text-[hsl(var(--muted-foreground))] border border-white/10">
          {'/'}</kbd>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors relative"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[hsl(225,70%,60%)]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-panel w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-br from-[hsl(225,70%,60%)] to-[hsl(260,50%,55%)] flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
        </motion.button>
      </div>
    </motion.header>
  )
}
