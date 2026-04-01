# Storage Reference

docmaker stores all data in the browser's `localStorage`. No data is ever sent to a server.

## localStorage Keys

| Key | Content | Store |
|-----|---------|-------|
| `docmaker_projects` | All projects and their guides | `project.store.ts` |
| `docmaker_themes` | Custom (non-built-in) themes | `theme.store.ts` |
| `docmaker_settings` | App settings | `settings.store.ts` |
| `docmaker_provider_keys` | Translation API keys | `TranslationPanel.tsx` |

## Data Structures

### `docmaker_projects`

```typescript
Project[] // array of projects
```

Each `Project`:
```typescript
{
  id: string;
  name: string;
  description?: string;
  createdAt: string;      // ISO date
  updatedAt: string;      // ISO date
  guides: Guide[];
}
```

Each `Guide`:
```typescript
{
  id: string;
  title: string;
  subtitle?: string;
  themeId: string;
  defaultLang: string;    // e.g. 'en'
  availableLangs: string[]; // e.g. ['en', 'ar', 'fr']
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
```

Each `Section`:
```typescript
{
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  order: number;
  blocks: Block[];
  translations: {
    [langCode: string]: {
      title: string;
      blocks: Block[];
    }
  };
}
```

### `docmaker_themes`

```typescript
Theme[] // array of custom themes only (built-ins are hardcoded)
```

### `docmaker_settings`

```typescript
{
  uiLang: 'en' | 'ar';
  autoSaveInterval: number;   // seconds
  defaultThemeId: string;
  defaultGuideLang: string;
}
```

### `docmaker_provider_keys`

```typescript
{
  gemini?: string;
  openai?: string;
  deepl?: string;
  customEndpoint?: string;
  customApiKey?: string;
}
```

## Backup and Restore

### Export all data
Settings → Storage & Data → **Download Backup**

Downloads a `docmaker-backup-{date}.json` file containing all projects.

### Import data
Home screen → **Import** button (top right)

Accepts the same JSON format as the backup export.

### Clear all data
Settings → Storage & Data → **Clear All Data**

Calls `localStorage.clear()` and reloads the page. This is irreversible.

## Storage Limits

Browsers typically allow 5–10 MB per origin for localStorage. The Settings page shows an estimated size in KB.

If you hit the limit:
1. Export your projects as JSON backup
2. Delete projects you no longer need
3. Re-import specific projects as needed

Images stored as base64 data URIs consume the most space. Consider using image URLs instead.
