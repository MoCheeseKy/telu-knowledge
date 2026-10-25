"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // 1. Gaya Umum
        "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        // 2. Gaya DEFAULT Bawaan Shadcn (Kotak / Pill tetap aman untuk teman-temanmu)
        "group-data-[variant=default]/tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:px-2 group-data-[variant=default]/tabs-list:py-1",
        "group-data-[variant=default]/tabs-list:text-foreground/60 group-data-[variant=default]/tabs-list:hover:text-foreground",
        "group-data-[variant=default]/tabs-list:data-active:bg-background group-data-[variant=default]/tabs-list:data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-xs",
        // 3. Gaya LINE Khusus Garis Bawah Merah (Untuk Halaman Artikel Saya)
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "group-data-[variant=line]/tabs-list:text-[15px] group-data-[variant=line]/tabs-list:text-[var(--muted)] group-data-[variant=line]/tabs-list:hover:text-[var(--foreground)]",
        "group-data-[variant=line]/tabs-list:pb-3 group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:-mb-[1px]",
        "group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent",
        "group-data-[variant=line]/tabs-list:data-active:border-[var(--primary)] group-data-[variant=line]/tabs-list:data-active:text-[var(--primary)] group-data-[variant=line]/tabs-list:data-active:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
