import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export type FeatureItem = {
  icon: LucideIcon
  title: string
  description: string
  url?: string
}

export function Features({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        const inner = (
          <div className="group flex flex-col gap-3 p-4 rounded-xl bg-background border border-border/50 hover:border-border hover:shadow-sm transition-all h-full">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
          </div>
        )

        if (item.url && item.url !== '#') {
          return (
            <Link key={item.title} href={item.url} className="block">
              {inner}
            </Link>
          )
        }
        return <div key={item.title}>{inner}</div>
      })}
    </div>
  )
}
