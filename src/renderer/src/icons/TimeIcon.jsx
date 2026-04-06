export default function TimerIcon({ className, ...props }) {
  return (
    <svg 
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor" 
      {...props}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}
