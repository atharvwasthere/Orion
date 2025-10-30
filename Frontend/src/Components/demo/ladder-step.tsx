import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface LadderStepProps {
  icon: string | React.ReactNode
  title: string
  description: string
  index: number
}

export function LadderStep({ icon, title, description, index }: LadderStepProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="relative flex gap-6 pl-8"
    >
      {/* Connecting spine line */}
      <div className="absolute left-0 top-0 h-full w-1">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
          className="h-full w-full origin-top bg-gradient-to-b from-primary/60 to-accent/40"
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* Icon circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl shadow-lg shadow-primary/20"
      >
        {typeof icon === 'string' ? (
          <img src={icon} alt="" className="w-8 h-8" />
        ) : (
          icon
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}
