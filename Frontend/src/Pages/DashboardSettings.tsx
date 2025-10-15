import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { CheckCircle2, Loader2 } from "lucide-react"

const SETTINGS_KEY = 'orion_settings';

type Settings = {
  aiModel: string;
  confidenceThreshold: string;
  apiKey: string;
  companyName: string;
  logoUrl: string;
};

const DEFAULT_SETTINGS: Settings = {
  aiModel: 'gemini',
  confidenceThreshold: '0.82',
  apiKey: '',
  companyName: 'Acme Support Team',
  logoUrl: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setShowSuccess(false);

    try {
      // Validate confidence threshold
      const threshold = parseFloat(settings.confidenceThreshold);
      if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        alert('Confidence threshold must be between 0 and 1');
        setSaving(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

      // Show success message
      setTimeout(() => {
        setSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 500);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your Orion assistant</p>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">Settings saved successfully!</p>
          </CardContent>
        </Card>
      )}

      {/* Model Settings */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Model Configuration</h2>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select 
              value={settings.aiModel} 
              onValueChange={(value) => updateSetting('aiModel', value)}
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini 2.5 Flash</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Confidence Threshold for Escalation</Label>
            <Input 
              id="threshold" 
              type="number" 
              value={settings.confidenceThreshold}
              onChange={(e) => updateSetting('confidenceThreshold', e.target.value)}
              step="0.01" 
              min="0" 
              max="1" 
            />
            <p className="text-xs text-muted-foreground">Conversations below this confidence will be escalated (0.0 - 1.0)</p>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">API Configuration</h2>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <Input 
              id="apikey" 
              type="password" 
              placeholder="••••••••••••••••"
              value={settings.apiKey}
              onChange={(e) => updateSetting('apiKey', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Your API key is stored locally and never sent to our servers</p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Branding</h2>

          <div className="space-y-2">
            <Label htmlFor="companyname">Company Name</Label>
            <Input 
              id="companyname" 
              value={settings.companyName}
              onChange={(e) => updateSetting('companyName', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input 
              id="logo" 
              placeholder="https://example.com/logo.png"
              value={settings.logoUrl}
              onChange={(e) => updateSetting('logoUrl', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">URL to your company logo (will be displayed in the chat widget)</p>
          </div>

          {settings.logoUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Logo Preview:</p>
              <div className="border-2 rounded-lg p-4 bg-muted/20">
                <img 
                  src={settings.logoUrl} 
                  alt="Company Logo" 
                  className="h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 min-w-[140px]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  )
}
