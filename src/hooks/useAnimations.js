import { useState, useEffect } from 'react'

export function useTypewriter(text, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return

    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, speed, startDelay])

  return { displayed, done }
}

export function useCounter(target, duration = 1500, startDelay = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTime = null
    let animId = null

    const timer = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        setValue(Math.floor(ease * target))
        if (progress < 1) animId = requestAnimationFrame(step)
      }
      animId = requestAnimationFrame(step)
    }, startDelay)

    return () => {
      clearTimeout(timer)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [target, duration, startDelay])

  return value
}
