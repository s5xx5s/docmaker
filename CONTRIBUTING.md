# Contributing to docmaker

Thank you for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/s5xx5s/docmaker.git
cd docmaker
npm install
npm run dev
```

## Project Structure

```
src/
├── components/blocks/   # One file per block type
├── export/              # One file per export format
├── pages/               # Top-level pages (Home, Editor, Preview, Settings)
├── store/               # Zustand stores
└── types/               # Shared TypeScript types
```

## Adding a New Block Type

1. **Define the type** in `src/types/index.ts`:
   ```typescript
   export interface MyBlock {
     id: string;
     type: 'my-block';
     // ... your fields
   }
   ```
   Add it to the `Block` union type.

2. **Create the component** in `src/components/blocks/MyBlock.tsx`:
   ```tsx
   interface Props {
     block: MyBlock;
     onUpdate: (patch: Partial<MyBlock>) => void;
     isEditing: boolean;
   }
   export function MyBlock({ block, onUpdate, isEditing }: Props) {
     if (!isEditing) {
       return <div>{/* clean preview output */}</div>;
     }
     return <div>{/* edit controls */}</div>;
   }
   ```

3. **Register in BlockRenderer** (`src/components/blocks/BlockRenderer.tsx`) — add a case in the switch.

4. **Add to block palette** in `src/components/editor/BlockList.tsx` — add an entry to `BLOCK_DEFS`.

5. **Add HTML export** in `src/export/html.ts` — add a case in `blockToHtml()`.

6. **Add Markdown export** in `src/export/markdown.ts` — add a case in `blockToMarkdown()`.

7. **Add translation extraction** in `src/components/translation/TranslationPanel.tsx` — update `extractBlockStrings()` and `applyTranslationsToBlock()`.

8. **Update the count** in `src/pages/Settings.tsx` — the "Block types" stat in the About section.

## Code Rules

- No `any` types
- TypeScript must compile with zero errors (`npx tsc --noEmit`)
- Every block must support both `isEditing={true}` and `isEditing={false}` modes
- Use `var(--gp-*)` CSS custom properties for colors in preview mode (not hardcoded values)

## Pull Requests

- One feature or fix per PR
- Run `npm run lint` and `npx tsc --noEmit` before submitting
- Describe what the PR adds or fixes in the description
