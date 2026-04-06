import { useState, useEffect } from 'react'
import EyeSlashIcon from '../../icons/EyeSlashIcon.jsx'
import EyeIcon from '../../icons/EyeIcon.jsx'

export default function InputBox({
  label,
  placeHolder,
  type = 'text',
  value = '',
  Set,
  Is,
  className,
  ...props
}) {
  const [isShowSecret, setShowSecret] = useState(type === 'password')
  const [isText, setText] = useState(value)

  useEffect(() => {
    Set(isText)
  }, [isText])

  const handleClickVisible = () => {
    setShowSecret((prev) => !prev)
  }

  const onChangeText = (e) => {
    setText(e.target.value)
  }

  return (
    <div className={` flex flex-col relative ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type === 'password' ? (isShowSecret ? 'password' : 'text') : type}
        placeholder={placeHolder}
        className="bg-secundary px-5 py-2 h-12 rounded-xl w-full text-sm outline-none normal-case"
        onChange={onChangeText}
        value={isText}
        {...props}
      />
      {type === 'password' && (
        <div className="absolute bottom-[1px] rounded-r-xl right-0 h-[46px] px-4 bg-secundary flex justify-center items-center">
          <button onClick={() => handleClickVisible()}>
            {!isShowSecret ? (
              <EyeIcon className="text-black" />
            ) : (
              <EyeSlashIcon className="text-[var(--text-color-input)] hover:text-black" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
