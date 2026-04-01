# Block Types Reference

docmaker has 24 built-in block types, each with both an edit mode (form controls) and a preview mode (clean output).

## Text Blocks

### Paragraph (`text`)
Plain text with alignment control (left / center / right / justify).

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` |

### Heading (`heading`)
Section heading at H1, H2, or H3 level.

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |
| `level` | `1 \| 2 \| 3` | `2` |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` |

### Quote (`quote`)
Blockquote with optional attribution.

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |
| `attribution` | string? | — |

### Callout (`callout`)
Highlighted callout box with a label and message.

| Field | Type | Default |
|-------|------|---------|
| `label` | string | `'Note'` |
| `content` | string | `''` |
| `variant` | `'info' \| 'warning' \| 'tip' \| 'danger'` | `'info'` |

## Media Blocks

### Image (`image`)
Image displayed from a URL or base64 data URI.

| Field | Type | Default |
|-------|------|---------|
| `url` | string | `''` |
| `alt` | string | `''` |
| `caption` | string? | — |

### Video (`video`)
Embedded video via iframe (YouTube, Vimeo, etc.).

| Field | Type | Default |
|-------|------|---------|
| `url` | string | `''` |
| `caption` | string? | — |

### Code (`code`)
Code block with optional language label (not syntax-highlighted, but monospace).

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |
| `language` | string | `'bash'` |

## Layout Blocks

### Divider (`divider`)
Horizontal rule. No fields.

### Spacer (`spacer`)
Vertical whitespace.

| Field | Type | Default |
|-------|------|---------|
| `height` | number | `24` (px) |

### Columns (`columns`)
Two-column layout with independent text content.

| Field | Type | Default |
|-------|------|---------|
| `left` | string | `''` |
| `right` | string | `''` |

## Structure Blocks

### Steps (`steps`)
Numbered step list. Each step has a title and description.

| Field | Type | Default |
|-------|------|---------|
| `items` | `Array<{ title: string; description: string }>` | `[]` |

### FAQ (`faq`)
Question and answer pairs.

| Field | Type | Default |
|-------|------|---------|
| `items` | `Array<{ question: string; answer: string }>` | `[]` |

### Cards (`cards`)
Grid of cards, each with a title, description, and optional icon.

| Field | Type | Default |
|-------|------|---------|
| `items` | `Array<{ title: string; description: string; icon?: string }>` | `[]` |

### Table (`table`)
Data table with header row and body rows.

| Field | Type | Default |
|-------|------|---------|
| `headers` | `string[]` | `['Column 1', 'Column 2']` |
| `rows` | `string[][]` | `[['', '']]` |

## Interactive Blocks

### Accordion (`accordion`)
Collapsible sections. Toggle open/closed in preview and exported HTML.

| Field | Type | Default |
|-------|------|---------|
| `items` | `Array<{ title: string; content: string }>` | `[]` |

### Tabs (`tabs`)
Tabbed content panels.

| Field | Type | Default |
|-------|------|---------|
| `items` | `Array<{ label: string; content: string }>` | `[]` |

### Alert (`alert`)
Banner-style alert with icon.

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |
| `variant` | `'info' \| 'warning' \| 'danger' \| 'success'` | `'info'` |

## Navigation Blocks

### Button (`button`)
Clickable button that links to a URL.

| Field | Type | Default |
|-------|------|---------|
| `label` | string | `'Click here'` |
| `url` | string | `''` |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` |

### Link (`link`)
Inline text link.

| Field | Type | Default |
|-------|------|---------|
| `label` | string | `''` |
| `url` | string | `''` |

## Embed Blocks

### HTML Embed (`html`)
Raw HTML injected into the guide. Use for custom widgets, iframes, etc.

| Field | Type | Default |
|-------|------|---------|
| `content` | string | `''` |

> **Note:** HTML blocks are not sandboxed. Only embed trusted content.

### Badge (`badge`)
Small pill-shaped label.

| Field | Type | Default |
|-------|------|---------|
| `label` | string | `''` |
| `color` | `'blue' \| 'green' \| 'red' \| 'yellow' \| 'gray'` | `'blue'` |
