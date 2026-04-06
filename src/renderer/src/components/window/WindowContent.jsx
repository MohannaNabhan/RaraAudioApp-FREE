export default function WindowContent({ className,  children }) {
    return (
      <div className={'h-[calc(100vh-32px)]  w-full relative p-10 ' + className}>{children}</div>
    )
}