import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function PageTransition({ children, timeout = 300 }) {
  const router = useRouter()
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Run the initial enter animation
    el.classList.add('fade-enter')
    // trigger the active state on next tick
    const enterTick = setTimeout(() => {
      el.classList.add('fade-enter-active')
    }, 10)

    const handleStart = () => {
      // start exit animation
      el.classList.remove('fade-enter', 'fade-enter-active')
      el.classList.add('fade-exit')
      // trigger active exit
      setTimeout(() => el.classList.add('fade-exit-active'), 10)
    }

    const handleComplete = () => {
      // after route finishes, clear exit classes and run enter animation
      el.classList.remove('fade-exit', 'fade-exit-active')
      el.classList.add('fade-enter')
      setTimeout(() => {
        el.classList.add('fade-enter-active')
      }, 10)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      clearTimeout(enterTick)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.events, timeout])

  return (
    <div ref={containerRef} className="page">
      {children}
    </div>
  )
}
