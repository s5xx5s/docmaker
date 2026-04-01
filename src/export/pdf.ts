// ── PDF Exporter ─────────────────────────────────────────────────────────────
// Opens the guide in a new window with print-optimized CSS, then triggers print.

import type { Guide, Theme } from '../types';
import { exportGuideAsHTML } from './html';

const PRINT_CSS = `
@media print {
  .gp-sidebar { display: none !important; }
  .gp-main { padding: 0; max-width: 100%; }
  .gp-shell { display: block; }
  .gp-section { page-break-inside: avoid; }
  .gp-section-title { page-break-after: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
  .gp-btn { border: 1px solid currentColor !important; }
}
@page { margin: 2cm; }
`;

export function exportGuideAsPDF(guide: Guide, theme: Theme) {
  const html = exportGuideAsHTML(guide, theme);
  // Inject print CSS before </style>
  const withPrint = html.replace('</style>', `${PRINT_CSS}</style>`);

  const win = window.open('', '_blank');
  if (!win) { alert('Please allow pop-ups to export PDF.'); return; }
  win.document.open();
  win.document.write(withPrint);
  win.document.close();
  // Wait for fonts/images to load, then print
  win.addEventListener('load', () => {
    setTimeout(() => { win.print(); }, 300);
  });
}
