import IconCheckSucess from '@/icons/IconCheckSucess.jsx'

export default function Pricing({
  discount,
  percent,
  href,
  className,
  month = 0,
  price,
  duration,
  popularity = false
}) {
  return (
    <article className="relative">
      {popularity ? (
        <span className="text-pretty text-xl font-bold absolute bg-gradient-to-r from-[var(--background-color-gradient-2)] to-[var(--background-color-gradient-1)] bg-[var(--background-color-btn-main)] rounded-t-[20px] w-full h-20 left-0 text-white text-center pt-3 -top-10">
          Most popular
        </span>
      ) : (
        ''
      )}
      <div
        className={`flex flex-col relative justify-between z-20 gap-y-6 px-6 w-[280px] py-6 bg-background rounded-[25px] ${className}`}
      >
        <h1 className="text-xl mb-4">{month} Month</h1>
        <div
          className={`flex items-end mb-4 relative ${discount ? 'justify-start' : 'justify-center'}`}
        >
          <h2 className="text-3xl font-bold">
            ${discount ? (price - (price * percent) / 100).toFixed(2) : price}/
          </h2>
          <p className="text-lg font-bold">{duration}</p>
          <span className="absolute left-0 -top-8 font-medium text-lg line-through">
            {discount ? `$${price} MONTH` : ''}
          </span>
          <span className="absolute -right-2 -top-6 font-bold text-lg text-red-500">
            {discount ? `${percent}% OFF!` : ''}
          </span>
        </div>
        <div className="flex flex-col gap-y-3 mb-2">
          <div className="flex items-center gap-x-2 w-full">
            <div>
              <IconCheckSucess />
            </div>
            <h3 className="text-xs text-wrap">
              <span className="font-bold">Unlock All Premium Features</span>
            </h3>
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div>
              <IconCheckSucess />
            </div>
            <h3 className="text-xs text-wrap">
              <span className="font-bold">+6 PREMIUM REAL TIME SETTINGS</span>
            </h3>
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div>
              <IconCheckSucess />
            </div>
            <h3 className="text-xs text-wrap">
              <span className="font-bold">+2 NEW PREMIUM AUDIO SETTINGS FOR BLACK OPS 6</span>
            </h3>
          </div>
          <div className="flex items-center gap-x-2 w-full">
            <div>
              <IconCheckSucess />
            </div>
            <h3 className="text-xs text-wrap">
              <span className="font-bold">+2 NEW PREMIUM AUDIO SETTINGS FOR WARZONE</span>
            </h3>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          className="btn btn-main font-bold !rounded-lg !border-none !py-2 !text-xl"
        >
          Buy Now
        </a>
      </div>
    </article>
  )
}
