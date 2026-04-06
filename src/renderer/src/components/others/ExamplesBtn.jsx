export default function ExamplesBtn({ Is, Set, Text, className, Target }) {
  return (
    <button
      onClick={() => Set(Target)}
      className={` ${Is == Target ? ' !pointer-events-none !bg-[var(--background-color-btn-main)] !text-white !font-bold !border-[var(--border-color-btn)]' : ''} !text-sm active:!text-white active:!bg-[var(--background-color-btn-main)] text-center h-10 btn !px-3 !m-0 w-full !rounded-none !py-0 ${className} `}
    >
      {Text}
    </button>
  )
}
