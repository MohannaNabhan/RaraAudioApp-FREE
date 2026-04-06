export default function Cooldown({ children, Is, className = "bg-black/50" }) {
  return (
    <div className="relative">
      {Is ? (
        <span
          className={`absolute top-0 left-0 w-full h-full text-center  !flex !items-center !justify-center select-none z-[99999999] ` + className}
        > 
          <svg
            fill="#000000" 
            viewBox="0 0 24 24" 
            className="size-4 animate-spin  "
          >
            <path d="M6.108,20H4a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2H17.892c-.247-2.774-1.071-7.61-3.826-9,2.564-1.423,3.453-4.81,3.764-7H20a1,1,0,0,0,0-2H4A1,1,0,0,0,4,4H6.17c.311,2.19,1.2,5.577,3.764,7C7.179,12.39,6.355,17.226,6.108,20ZM9,16.6c0-1.2,3-3.6,3-3.6s3,2.4,3,3.6V20H9Z" />
          </svg>
        </span>
      ) : (
        ""
      )}
      {children}
    </div>
  );
}
