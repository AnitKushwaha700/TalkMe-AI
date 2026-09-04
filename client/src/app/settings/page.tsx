import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice & Audio</CardTitle>
          <CardDescription>Configure your microphone and AI voice settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>AI Voice: Female 1 (en-US)</p>
          <p>Microphone: Default Input Device</p>
          <Button variant="outline">Change Audio Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
