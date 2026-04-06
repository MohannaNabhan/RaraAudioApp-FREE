import { useState, useEffect } from 'react'
import AnimationMouse from '@/components/others/AnimationMouse.jsx'

export default function AnimationMause({ mode = 'down', scrollRef, hasManyChildren }) {
  const [isIndicator, setIndicator] = useState(true)

  useEffect(() => {
    if (hasManyChildren && scrollRef.current) {
      const handleScroll = () => {
        const currentScroll = scrollRef.current.scrollTop
        const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight
        if (currentScroll <= maxScroll * 0.8) {
          setIndicator(true)
        } else {
          setIndicator(false)
        }
      }

      const currentRef = scrollRef.current
      currentRef.addEventListener('scroll', handleScroll)

      return () => currentRef.removeEventListener('scroll', handleScroll)
    }
  }, [hasManyChildren, scrollRef])

  return (
    <>
      {isIndicator ? (
        <div className="absolute top-full z-10">
          <AnimationMouse mode={mode} />
        </div>
      ) : null}
    </>
  )
}
