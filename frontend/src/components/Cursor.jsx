import { useEffect, useRef } from 'react'

export default function Cursor() {
  const curRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const rafId   = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (curRef.current) {
        curRef.current.style.left = e.clientX + 'px'
        curRef.current.style.top  = e.clientY + 'px'
      }
    }

    const lerp = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.09
      ring.current.y += (pos.current.y - ring.current.y) * 0.09
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      rafId.current = requestAnimationFrame(lerp)
    }

    const onEnter = () => {
      curRef.current?.classList.add('hovered')
      ringRef.current?.classList.add('hovered')
    }
    const onLeave = () => {
      curRef.current?.classList.remove('hovered')
      ringRef.current?.classList.remove('hovered')
    }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('button, a, .card, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    rafId.current = requestAnimationFrame(lerp)

    // hide on touch
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) {
      if (curRef.current)  curRef.current.style.display  = 'none'
      if (ringRef.current) ringRef.current.style.display = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div className="cursor"      ref={curRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}