interface InfoCircleProps {
  color: string;
}

export function InfoSquare({ color, ...props }: InfoCircleProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_888_15524)">
        <path
          d="M10 8H10.0083"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.16675 10.5H10.0001V13.8333H10.8334"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 3C16 3 17.5 4.5 17.5 10.5C17.5 16.5 16 18 10 18C4 18 2.5 16.5 2.5 10.5C2.5 4.5 4 3 10 3Z"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_888_15524">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
