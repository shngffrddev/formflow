type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#folio-shadow)">
        <path
          d="M0 142C0 130.799 0 125.198 2.17987 120.92C4.09734 117.157 7.15695 114.097 10.9202 112.18C15.1984 110 20.799 110 32 110H100V178C100 189.201 100 194.802 97.8201 199.08C95.9027 202.843 92.8431 205.903 89.0798 207.82C84.8016 210 79.201 210 68 210H32C20.799 210 15.1984 210 10.9202 207.82C7.15695 205.903 4.09734 202.843 2.17987 199.08C0 194.802 0 189.201 0 178V142Z"
          fill="#3B82F6"
        />
        <path
          d="M100 110H168C179.201 110 184.802 110 189.08 112.18C192.843 114.097 195.903 117.157 197.82 120.92C200 125.198 200 130.799 200 142V178C200 189.201 200 194.802 197.82 199.08C195.903 202.843 192.843 205.903 189.08 207.82C184.802 210 179.201 210 168 210H132C120.799 210 115.198 210 110.92 207.82C107.157 205.903 104.097 202.843 102.18 199.08C100 194.802 100 189.201 100 178V110Z"
          fill="#2563EB"
        />
        <path
          d="M100 42C100 30.799 100 25.1984 102.18 20.9202C104.097 17.1569 107.157 14.0973 110.92 12.1799C115.198 10 120.799 10 132 10H168C179.201 10 184.802 10 189.08 12.1799C192.843 14.0973 195.903 17.1569 197.82 20.9202C200 25.1984 200 30.799 200 42V78C200 89.201 200 94.8016 197.82 99.0798C195.903 102.843 192.843 105.903 189.08 107.82C184.802 110 179.201 110 168 110H100V42Z"
          fill="#DBEAFE"
        />
        <path
          d="M0 42C0 30.799 0 25.1984 2.17987 20.9202C4.09734 17.1569 7.15695 14.0973 10.9202 12.1799C15.1984 10 20.799 10 32 10H68C79.201 10 84.8016 10 89.0798 12.1799C92.8431 14.0973 95.9027 17.1569 97.8201 20.9202C100 25.1984 100 30.799 100 42V110H32C20.799 110 15.1984 110 10.9202 107.82C7.15695 105.903 4.09734 102.843 2.17987 99.0798C0 94.8016 0 89.201 0 78V42Z"
          fill="#EFF6FF"
        />
      </g>
      <defs>
        <filter
          id="folio-shadow"
          x="0"
          y="0"
          width="220"
          height="220"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="10" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
