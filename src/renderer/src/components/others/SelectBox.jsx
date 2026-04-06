/**
 * @description
 * A SelectBox component that renders a dropdown menu from a provided list of items.
 * The component is controlled by the `textSelected` prop which is used to determine which item is selected.
 * The component also handles mouse scroll events to show an animation when the user scrolls to the bottom of the list.
 *
 * @param {Object} props - Component props
 * @param {String} [props.className] - Additional class names to add to the component
 * @param {String} [props.textSelected] - The text to display as the selected item
 * @param {Array<Object>} [props.list] - The list of items to display in the dropdown
 * @param {Function} [props.Set] - The function to call when an item is selected
 *
 * @returns {JSX.Element}
 */

import { useState, useEffect, useRef } from 'react'
import AngleUpIcon from '@/icons/AngleUpIcon.jsx'
import AnimationMouse from '@/components/others/AnimationMouse'
import SelectBoxOpctions from '@/components/others/SelectBoxOpctions'
import cutText from '@/hooks/cutText.js'

export default function SelectBox({ className, Is, List = [], Set }) {
  const [isSelectedText, setSelectedText] = useState('Select Your Audio Device')
  const [isShow, setShow] = useState(false)
  const hasManyChildren = Array.isArray(List) && List.length >= 8
  const scrollRef = useRef(null)
  const [isMouseAnimation, setMouseAnimation] = useState(false)
  const [isBadge, setBadge] = useState(false)
  useEffect(() => {
    setSelectedText(Is)
  }, [Is])

  useEffect(() => {
    const checkScrollPosition = () => {
      if (hasManyChildren && scrollRef.current) {
        const currentScroll = scrollRef.current.scrollTop
        const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight
        setMouseAnimation(currentScroll <= maxScroll * 0.9)
      }
    }

    checkScrollPosition()

    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPosition)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [hasManyChildren, isShow, List])

  // Reiniciar la animación cuando List cambia
  useEffect(() => {
    setMouseAnimation(false)
  }, [List])
  const HandleClick = (item) => {
    if ((item.mode == 'Free') | (item.mode == undefined) || item.mode == null || item.mode == '') {
      Set(item.name)
      setSelectedText(item.name)
    } else {
      window.api.ipcRenderer.send('Popup', { mode: 'open-premium-add', event: true })
    }
  }

  return (
    <button
      onClick={() => setShow(!isShow)}
      className={`w-full outline-none relative ${className}`}
    >
      <div
        className={`w-full h-14 bg-[var(--background-select-box)] text-[var(--Select-Text-color)] border border-transparent  ${isShow ? 'rounded-[var(--Select-Rounded)] !rounded-b-none !border-[var(--border-color-select-box)]' : 'rounded-[var(--Select-Rounded)]'} hover:border-[var(--border-color-select-box)]   flex items-center justify-between px-5`}
      >
        <h1 className="font-medium text-base select-none">
          {cutText({ t: isSelectedText, l: 25 })}
        </h1>
        {isBadge}
        <AngleUpIcon className={`transition-transform ${isShow ? '' : '-rotate-180'}`} />
      </div>
      {isShow ? (
        isMouseAnimation ? (
          <div
            className={`absolute w-[calc(100%-2px)] left-[1px] border-b  border-[var(--border-color-select-box)]  h-12  bg-gradient-to-b from-white/0 to-[--background-select-box] flex justify-center items-center  pointer-events-none z-10 top-[297px]`}
          >
            <AnimationMouse />
          </div>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      <div
        ref={scrollRef}
        className={`absolute _no_move   ${hasManyChildren ? 'h-[288px]' : 'h-auto'} ${isShow ? '' : 'h-0 hidden'} bg-background overflow-x-hidden overflow-y-auto w-full`}
      >
        {List.length > 0
          ? List?.map((item) => (
              <SelectBoxOpctions
                mode={item.mode}
                game={item.game}
                onClick={() => {
                  HandleClick(item)
                }}
                key={item.id}
                seleted={Is === item.name}
              >
                {item.name}
              </SelectBoxOpctions>
            ))
          : null}
      </div>
    </button>
  )
}
