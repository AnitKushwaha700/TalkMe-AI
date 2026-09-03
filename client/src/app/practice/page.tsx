import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Briefcase, Coffee, Plane, Utensils, MessageSquare } from "lucide-react"
import Link from "next/link"

const practiceModes = [
  {
    title: "Job Interview",
    description: "Practice answering common interview questions.",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    title: "Restaurant",
    description: "Order food and handle restaurant conversations.",
    icon: Utensils,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
  },
  {
    title: "Airport",
    description: "Navigate check-in, security, and boarding.",
    icon: Plane,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
  },
  {
    title: "Casual Chat",
    description: "Talk with a friend about hobbies and daily life.",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
  },
  {
    title: "Customer Support",
    description: "Resolve an issue over the phone.",
    icon: MessageSquare,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
  }
]

export default function PracticePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice Modes</h1>
        <p className="text-muted-foreground">Select a scenario to start your conversation practice.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practiceModes.map((mode) => (
          <Card key={mode.title} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${mode.color}`}>
                <mode.icon className="w-6 h-6" />
              </div>
              <CardTitle>{mode.title}</CardTitle>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={`/voice?mode=${mode.title.toLowerCase().replace(' ', '-')}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                Start Practice
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
