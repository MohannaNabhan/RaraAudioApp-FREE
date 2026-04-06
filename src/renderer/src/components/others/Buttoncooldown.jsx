import { useState } from 'react'

export default function Button({ text = 'Wait...', onClick, delay = 1000, className, ...props }) {
  const [isCooldown, setCooldown] = useState(false)

  const handleClick = (event) => {
    if (isCooldown) return // Evita que el botón se haga clic durante el cooldown

    // Ejecuta la función onClick proporcionada
    if (onClick) {
      onClick(event)
    }

    // Establece el estado de cooldown
    setCooldown(true)
    setTimeout(() => {
      setCooldown(false)
    }, delay) // 1 segundo de cooldown
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
      disabled={isCooldown} // Deshabilita el botón durante el cooldown
    >
      {isCooldown ? text : props.children}
    </button>
  )
}
