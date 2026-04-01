# Export Reference

## HTML Export

The HTML exporter produces a single `.html` file with zero external dependencies (except Google Fonts).

### What's included

- **CSS**: All theme styles + block styles inlined in a `<style>` tag
- **JavaScript**: Accordion toggle, image lightbox, language switcher, sidebar active state — all inlined in a `<script>` tag
- **Fonts**: Google Fonts `<link>` tag if the theme uses a Google Font
- **Images**: Referenced by URL (base64 images are embedded inline)
- **Videos**: YouTube/Vimeo embedded via `<iframe>`

### Structure

```html
<!DOCTYPE html>
<html lang="{defaultLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{guide.title}</title>
  <!-- Google Fonts link if applicable -->
  <style>/* theme + block CSS */</style>
</head>
<body>
  <div class="gp-root">
    <!-- sidebar with section nav + lang switcher -->
    <nav class="gp-sidebar">...</nav>
    <!-- sections -->
    <main class="gp-content">
      <section id="section-{id}" data-lang="{langCode}">...</section>
    </main>
  </div>
  <script>/* accordion + lightbox + lang switcher JS */</script>
</body>
</html>
```

### Language switching

If the guide has multiple languages, each section is rendered once per language with `data-lang` attributes. The JS switcher shows/hides sections based on the selected language.

```javascript
// Generated JS (simplified)
function switchLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.dataset.lang === lang ? '' : 'none';
  });
}
```

---

## Markdown Export

GitHub-flavored Markdown (GFM) with:
- Auto-generated table of contents with anchor links
- All 24 block types rendered to appropriate markdown constructs

### Block → Markdown mappings

| Block | Output |
|-------|--------|
| Paragraph | Plain text |
| Heading | `#` / `##` / `###` |
| Quote | `> blockquote` |
| Callout | `> **Label:** content` |
| Image | `![alt](url)` |
| Video | `[Watch video](url)` link |
| Code | ` ```language ``` ` fenced block |
| Divider | `---` |
| Spacer | empty line |
| Steps | `1.` numbered list |
| FAQ | `**Q:** ... **A:** ...` |
| Cards | bulleted list |
| Table | GFM table |
| Accordion | `### title` + content |
| Tabs | repeated `### label` + content |
| Alert | `> ⚠️ content` |
| Button | `[label](url)` |
| Link | `[label](url)` |
| HTML | raw HTML (GFM supports it) |
| Badge | inline `code` span |

---

## JSON Export

Exports the full `Guide` object as pretty-printed JSON. Can be re-imported via the project page's "Import Guide" button (if implemented) or by pasting into the project store.

---

## PDF Export

Opens a new browser window with a print-optimized version of the guide and immediately calls `window.print()`. Use your browser's "Save as PDF" option in the print dialog.

The print CSS removes the sidebar and uses single-column layout suitable for A4/Letter paper.
