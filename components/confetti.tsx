"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const colors = ["#0891b2", "#ec4899", "#f97316", "#10b981", "#8b5cf6", "#f59e0b"]

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)

      // Create confetti pieces
      const newPieces: ConfettiPiece[] = []
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        })
      }
      setPieces(newPieces)

      // Animate confetti
      const animateConfetti = () => {
        setPieces((currentPieces) => {
          const updatedPieces = currentPieces.map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.3, // gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))

          // Remove pieces that have fallen off screen
          return updatedPieces.filter((piece) => piece.y < window.innerHeight + 50)
        })
      }

      const interval = setInterval(animateConfetti, 16) // ~60fps

      // Clean up after 3 seconds
      setTimeout(() => {
        clearInterval(interval)
        setPieces([])
        setIsActive(false)
        onComplete?.()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [trigger, isActive, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  )
}
