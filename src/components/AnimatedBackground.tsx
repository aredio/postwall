import { useMemo } from 'react'

export function AnimatedBackground() {
  const total = 200
  const time = 10

  const triangles = useMemo(() => {
    return Array.from({ length: total }).map((_, i) => {
      const size = Math.random() * 50
      const rotate = Math.random() * 360
      const delay = (i + 1) * -(time / total)
      const hue = Math.random() * 360
      const randomX = Math.random() * 1000
      const randomY = Math.random() * 1000

      return {
        id: i,
        size,
        rotate,
        delay,
        hue,
        randomX,
        randomY
      }
    })
  }, [])

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 bg-[#0000FF] overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #0000FF 0%, #0000CC 20%, #000066 60%, #000033 100%)',
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '800px',
        }}
      >
        <style>
          {triangles.map((t, i) => `
            @keyframes anim_bg_${i} {
              0% {
                opacity: 1;
                transform: rotate(${t.rotate * 1.5}deg) translate3d(${t.randomX}px, ${t.randomY}px, 1000px) scale(1);
              }
            }
          `).join('\n')}
        </style>
        
        {triangles.map((t, i) => (
          <div
            key={t.id}
            className="absolute top-1/2 left-1/2 w-0 h-0"
            style={{
              borderTop: `${t.size}px solid hsla(${t.hue}, 100%, 50%, 1)`,
              borderRight: `${t.size}px solid transparent`,
              borderLeft: `${t.size}px solid transparent`,
              marginLeft: `-${t.size / 2}px`,
              marginTop: `-${t.size / 2}px`,
              filter: 'grayscale(1)',
              transform: `rotate(${t.rotate}deg) translate3d(0, 0, -1500px) scale(0)`,
              animation: `anim_bg_${i} ${time}s infinite linear`,
              animationDelay: `${t.delay}s`,
              opacity: 0
            }}
          />
        ))}
      </div>
    </div>
  )
}
