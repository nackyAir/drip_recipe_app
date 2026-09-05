import Link from 'next/link'

const CoffeeMark = () => (
  <svg
    viewBox="0 0 32 32"
    width="22"
    height="22"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M9 13c0-3.2 3.1-6 7-6s7 2.8 7 6v7.2c0 2.4-2.5 4.3-7 4.3s-7-1.9-7-4.3V13Z"
      fill="currentColor"
      opacity="0.25"
    />
    <path
      d="M11 12.5c.4-2.4 2.6-4.2 5-4.2s4.6 1.8 5 4.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8.5 15.5h15c.8 3.6-1.6 8.5-7.5 8.5s-8.3-4.9-7.5-8.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M23.2 16.2h1.6c1.5 0 2.7 1.4 2.4 2.9-.3 1.3-1.5 2.1-2.8 2.1H23"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M13.2 7.2c.4-1.2 1-2.2 1.6-2.6M16.4 6.6c.2-1.1.7-2.1 1.5-2.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

export const Logo = ({ href = '/user' }: { href?: string }) => {
  return (
    <Link href={href} className="logo" aria-label="Coffee Recipe ホーム">
      <span className="logo-mark">
        <CoffeeMark />
      </span>
      <span>
        <span className="logo-name">Coffee Recipe</span>
        <span className="logo-sub">ドリップレシピ帳</span>
      </span>
    </Link>
  )
}
