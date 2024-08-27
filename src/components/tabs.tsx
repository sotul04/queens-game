import Link from "next/link"

interface TabsProps {
    left: string
    right: string
    current? : boolean
}

export function Tabs({left, right, current = false}: TabsProps) {
    return <div className="mx-auto flex gap-3 my-4">
        <Link href={`/${left}`} className={`relative ${current ? '': 'font-semibold after:absolute after:h-[3px] after:w-[110%] after:rounded-full after:bg-black after:bottom-0 after:-translate-x-[95%] after:animate-scale'}`}>{left.toUpperCase()}</Link>
        <Link href={`/${right}`} className={`relative ${current ? 'font-semibold after:absolute after:h-[3px] after:w-[110%] after:rounded-full after:bg-black after:bottom-0 after:-translate-x-[95%] after:animate-scale' : ''}`}>{right.toUpperCase()}</Link>
    </div>
}