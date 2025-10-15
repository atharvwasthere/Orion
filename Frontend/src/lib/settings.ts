const SETTINGS_KEY = 'orion_settings';

export type Settings = {
  aiModel: string;
  confidenceThreshold: string;
  apiKey: string;
  companyName: string;
  logoUrl: string;
};

export const DEFAULT_SETTINGS: Settings = {
  aiModel: 'gemini',
  confidenceThreshold: '0.82',
  apiKey: '',
  companyName: 'Acme Support Team',
  logoUrl: '',
};

/**
 * Get settings from localStorage
 */
export function getSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
    throw err;
  }
}

/**
 * Get a specific setting value
 */
export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
  const settings = getSettings();
  return settings[key];
}
