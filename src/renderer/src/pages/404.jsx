export default function name({ ROUTER }) {
  return (
    <div className="w-full h-full flex flex-col  justify-center items-center">
      <h1>404</h1>
      <button onClick={() => ROUTER('/')}>Go TO HOME</button>
    </div>
  )
}
