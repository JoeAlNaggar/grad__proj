import { Bagel_Fat_One } from "next/font/google"

const bagelFatOne = Bagel_Fat_One({ subsets: ["latin"], weight: "400" })

export default function Logo() {
  return (
    <div className={`${bagelFatOne.className} text-3xl font-bold whitespace-nowrap`}>
      <span className="text-purple-500 dark:text-purple-400">Cy</span>
      <span className="text-gray-900 dark:text-white">Mate</span>
    </div>
  )
}
