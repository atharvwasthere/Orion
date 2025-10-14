import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your Orion assistant</p>
      </div>

      {/* Model Settings */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Model Configuration</h2>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select defaultValue="gemini">
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini 2.5 Flash</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Confidence Threshold for Escalation</Label>
            <Input id="threshold" type="number" defaultValue="0.82" step="0.01" min="0" max="1" />
            <p className="text-xs text-muted-foreground">Conversations below this confidence will be escalated</p>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">API Configuration</h2>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <Input id="apikey" type="password" placeholder="••••••••••••••••" />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Branding</h2>

          <div className="space-y-2">
            <Label htmlFor="companyname">Company Name</Label>
            <Input id="companyname" defaultValue="Acme Support Team" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
