import PremiumIcon from '@/assets/PremiumIcon.png'
import cutText from '@/hooks/cutText.js'

function Mode(mode, game) {
  if (mode === 'Free') {
    /*if (game === 'blo6') {
      return (
        <>
          <div className="size-3"></div>
          <h2 className="bg-[var(--color-green)] right-5 -top-6 h-5 flex justify-center items-center absolute px-8  text-[11px] rounded-sm ">FREE</h2>
        </>
      )
    }*/
    return (
      <h2 className="bg-gradient-to-r from-[var(--Select-Gradient-1)] to-[var(--Select-Gradient-2)] px-5 py-1 font-semibold text-[13px] text-xs  rounded-sm !text-white  ">
        FREE
      </h2>
    )
  } else if (mode === 'Premium') {
    return <img src={PremiumIcon} className="size-3" />
  } else return null
}
function Game(game) {
  if (game === 'blo6') {
    return (
      <h2 className="bg-[var(--color-orange)] font-medium text-white px-2 text-xs  py-1">
        Black&nbsp;Ops&nbsp;6
      </h2>
    )
  } else if (game === 'wz') {
    return (
      <h2 className="bg-[var(--background-color)] text-[var(--background-color-btn)] font-medium  px-2 text-xs py-1 ">
        Warzone
      </h2>
    )
  } else {
    return null
  }
}
function BorderColor(game) {
  return game === 'blo6'
    ? 'border-[var(--border-color-select-box)]'
    : 'border-[var(--border-color-select-box)]'
}

export default function SelectBoxOpctions({ children, onClick, mode, game, seleted = false }) {
  return (
    <>
      <div
        onClick={onClick}
        className={`h-12 relative w-full select-none flex border ${BorderColor(game)} justify-between _no_move items-center pl-3 pr-2 bg-[var(--background-select-box)] text-[var(--Select-Text-color)] hover:bg-[#edd8fc] `}
      >
        <h1 className="text-sm font-medium select-none">{cutText({ t: children, l: 27 })}</h1>
        <div className="flex relative items-center gap-x-2">
          {Game(game)}
          {seleted ? (
            <div className="size-3 bg-[var(--color-green)] rounded-full"></div>
          ) : (
            Mode(mode, game)
          )}
        </div>
      </div>
    </>
  )
}
