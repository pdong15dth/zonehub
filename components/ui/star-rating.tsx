"use client"

import { useState, useEffect } from "react"
import { Star, StarHalf } from "lucide-react"
import { Input } from "@/components/ui/input"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  showInput?: boolean
}

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = "md",
  readOnly = false,
  showInput = true
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-6 w-6"
      default:
        return "h-5 w-5"
    }
  }

  const handleClick = (index: number, isHalf: boolean = false) => {
    if (readOnly) return
    
    const newValue = isHalf ? index + 0.5 : index + 1
    setInternalValue(newValue)
    onChange(newValue)
  }

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, index: number) => {
    if (readOnly) return
    
    // Get the position within the star to determine if it's a half star
    const rect = e.currentTarget.getBoundingClientRect()
    const halfPoint = rect.left + rect.width / 2
    const isHalf = e.clientX < halfPoint
    
    const newValue = isHalf ? index + 0.5 : index + 1
    setHoverValue(newValue)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverValue(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value)
    
    if (isNaN(inputValue)) {
      setInternalValue(0)
      onChange(0)
      return
    }
    
    // Clamp value between 0 and max
    const clampedValue = Math.min(Math.max(0, inputValue), max)
    
    // Round to nearest 0.5
    const roundedValue = Math.round(clampedValue * 2) / 2
    
    setInternalValue(roundedValue)
    onChange(roundedValue)
  }

  const renderStar = (index: number) => {
    const sizeClass = getSizeClass()
    const displayValue = hoverValue !== null ? hoverValue : internalValue
    
    // Calculate if this star should be filled, half-filled, or empty
    const isFullyFilled = index + 0.5 < displayValue
    const isHalfFilled = !isFullyFilled && index < displayValue

    return (
      <div key={index} className="relative inline-block">
        {isFullyFilled ? (
          <Star
            className={`${sizeClass} cursor-pointer transition-all text-yellow-400 fill-yellow-400`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={() => handleClick(index, false)}
          />
        ) : isHalfFilled ? (
          <div className="relative">
            <Star
              className={`${sizeClass} cursor-pointer transition-all text-gray-300`}
              onMouseMove={(e) => handleMouseMove(e, index)}
            />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star
                className={`${sizeClass} cursor-pointer transition-all text-yellow-400 fill-yellow-400`}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onClick={() => handleClick(index, true)}
              />
            </div>
          </div>
        ) : (
          <Star
            className={`${sizeClass} cursor-pointer transition-all text-gray-300`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={() => handleClick(index, false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center gap-1" 
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(max)].map((_, index) => renderStar(index))}
        {!readOnly && (
          <span className="ml-2 text-sm text-muted-foreground">
            {hoverValue !== null ? hoverValue.toFixed(1) : internalValue.toFixed(1)}
          </span>
        )}
      </div>
      
      {showInput && !readOnly && (
        <div className="flex items-center gap-2">
          <Input 
            type="number"
            min="0"
            max={max}
            step="0.5"
            value={internalValue}
            onChange={handleInputChange}
            className="w-20 h-8 text-sm"
          />
          <span className="text-sm text-muted-foreground">
            Nhập giá trị từ 0 đến {max} (bước 0.5)
          </span>
        </div>
      )}
    </div>
  )
} 