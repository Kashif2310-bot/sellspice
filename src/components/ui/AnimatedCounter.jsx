import { motion } from 'framer-motion'
import { useCounter } from '../../hooks/useAnimations'

export default function AnimatedCounter({ value, prefix = '', suffix = '', delay = 0 }) {
  const count = useCounter(value, 1400, delay)
  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
