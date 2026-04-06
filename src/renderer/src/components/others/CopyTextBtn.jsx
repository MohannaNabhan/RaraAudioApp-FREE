import { useState } from 'react'

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Texto copiado al portapapeles')
    })
    .catch((err) => {
      console.error('Error al copiar al portapapeles:', err)
    })
}


export default function CopyTextBtn({ text, className }) {
  const [isCopied, setCopied] = useState(false)

  const handleCopy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 400)
  }

  return (
    <span
      onClick={handleCopy}
      className={` ${isCopied ? 'text-green-500' : ''} select-none ${className}`}
      style={{ cursor: 'pointer' }}
    >
      {isCopied ? 'Copied' : text}
    </span>
  )
}
