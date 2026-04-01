# Themes Reference

## Built-in Themes

| ID | Name | Style |
|----|------|-------|
| `dark-navy` | Dark Navy | Dark blue — default |
| `midnight` | Midnight | Pure black |
| `arctic` | Arctic | Light/white |
| `emerald` | Emerald | Dark with green accent |
| `corporate` | Corporate | Dark with blue accent |

## Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  isBuiltIn: boolean;
  colors: {
    primary: string;       // accent color — buttons, links, active nav
    background: string;    // page background
    surface: string;       // card / sidebar background
    text: string;          // body text
    textMuted: string;     // secondary / caption text
    border: string;        // dividers and borders
    accent: string;        // highlights
    sidebarBg: string;     // sidebar background
    sidebarText: string;   // sidebar link text
    sidebarActive: string; // active sidebar item background
    codeBg: string;        // code block background
  };
  fonts: {
    heading: string;   // Google Font name or system font
    body: string;      // Google Font name or system font
    fontSize: string;  // e.g. '15px'
    lineHeight: string; // e.g. '1.7'
  };
  spacing: {
    borderRadius: string;   // e.g. '8px'
    sectionPadding: string; // e.g. '24px'
    contentWidth: string;   // e.g. '720px'
  };
  customCss?: string; // raw CSS injected after base styles
}
```

## CSS Custom Properties

All theme values are exposed as CSS custom properties on the `.gp-root` element:

| Property | Maps to |
|----------|---------|
| `--gp-primary` | `colors.primary` |
| `--gp-bg` | `colors.background` |
| `--gp-surface` | `colors.surface` |
| `--gp-text` | `colors.text` |
| `--gp-text-muted` | `colors.textMuted` |
| `--gp-border` | `colors.border` |
| `--gp-accent` | `colors.accent` |
| `--gp-sidebar-bg` | `colors.sidebarBg` |
| `--gp-sidebar-text` | `colors.sidebarText` |
| `--gp-sidebar-active` | `colors.sidebarActive` |
| `--gp-code-bg` | `colors.codeBg` |
| `--gp-radius` | `spacing.borderRadius` |
| `--gp-section-pad` | `spacing.sectionPadding` |
| `--gp-content-width` | `spacing.contentWidth` |
| `--gp-font-heading` | `fonts.heading` |
| `--gp-font-body` | `fonts.body` |
| `--gp-font-size` | `fonts.fontSize` |
| `--gp-line-height` | `fonts.lineHeight` |

These properties are used by both the live preview (`GuidePreview.tsx`) and the HTML export (`html.ts`), ensuring the exported file matches what you see in the editor.

## Custom Themes

To create a custom theme:
1. Open any guide in the editor
2. Click **Theme** in the toolbar
3. Select any theme and click **Customize**
4. Edit Colors, Fonts, Spacing, and Custom CSS tabs
5. Click **Save Theme**

Custom themes are stored in localStorage under the `docmaker_themes` key.

### Export / Import

In the Theme Picker modal:
- **Export** — downloads all custom themes as `docmaker-themes.json`
- **Import** — loads themes from a previously exported JSON file
