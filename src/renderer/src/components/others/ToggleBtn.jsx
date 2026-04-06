export default function ToggleBtn({ Is, Set, className, ActiveIcon, InactiveIcon }) {
  return (
    <button
      onClick={() => Set(!Is)}
      className={` relative  w-[50px] h-7 p-[1px] rounded-full px-[1px] border-[--btn-night-border] border-[1px]`}
    >
      <div
        className={`bg-[var(--btn-night)]  flex justify-center size-6 ${Is ? ' left-[1px]' : ' right-[1px]'} top-[1px]  absolute  rounded-full items-center`}
      >
        {Is ? (
          <ActiveIcon className="stroke-[--btn-night] w-full" />
        ) : (
          <InactiveIcon className="stroke-[--btn-night]  w-full" />
        )}
      </div>
    </button>
  )
}
