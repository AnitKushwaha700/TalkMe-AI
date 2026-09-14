import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { MessageCircle, Briefcase, UtensilsCrossed, Plane, Building2, GraduationCap, ShoppingBag, Swords } from "lucide-react"
import Link from "next/link"
import { PRACTICE_MODES } from "@/constants/practice-modes"

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Briefcase,
  UtensilsCrossed,
  Plane,
  Building2,
  GraduationCap,
  ShoppingBag,
  Swords,
};

export default function PracticePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice Modes</h1>
        <p className="text-muted-foreground">Select a scenario to start your conversation practice.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_MODES.map((mode) => {
          const Icon = iconMap[mode.icon] || MessageCircle;
          return (
            <Card key={mode.slug} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${mode.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle>{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href={`/voice?mode=${mode.slug}`} className={buttonVariants({ variant: "outline", className: "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" })}>
                  Start Practice
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}
