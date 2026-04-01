// ── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'text' | 'highlight' | 'steps' | 'cards' | 'faq' | 'table'
  | 'flow' | 'image' | 'compare' | 'image-text' | 'divider' | 'logo'
  | 'video' | 'code' | 'quote' | 'timeline' | 'stats' | 'alert'
  | 'checklist' | 'gallery' | 'button' | 'embed' | 'accordion' | 'rating';

interface BaseBlock {
  id: string;
  type: BlockType;
}

// ── الـ 12 الحالية ────────────────────────────────────────────────────────────

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // HTML أو markdown
  align?: 'left' | 'center' | 'right';
}

export interface HighlightBlock extends BaseBlock {
  type: 'highlight';
  variant: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  content: string;
}

export interface StepsBlock extends BaseBlock {
  type: 'steps';
  steps: Array<{ title: string; description?: string; icon?: string }>;
}

export interface CardsBlock extends BaseBlock {
  type: 'cards';
  columns?: 2 | 3 | 4;
  cards: Array<{ title: string; description?: string; icon?: string; image?: string }>;
}

export interface FaqBlock extends BaseBlock {
  type: 'faq';
  items: Array<{ question: string; answer: string }>;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  striped?: boolean;
}

export interface FlowBlock extends BaseBlock {
  type: 'flow';
  steps: Array<{ label: string; description?: string; icon?: string }>;
  direction?: 'horizontal' | 'vertical';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string; // base64 أو URL
  alt?: string;
  caption?: string;
  width?: 'full' | 'large' | 'medium' | 'small';
}

export interface CompareBlock extends BaseBlock {
  type: 'compare';
  leftTitle?: string;
  rightTitle?: string;
  leftItems: string[];
  rightItems: string[];
}

export interface ImageTextBlock extends BaseBlock {
  type: 'image-text';
  src: string;
  alt?: string;
  title?: string;
  content: string;
  imagePosition?: 'left' | 'right';
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

export interface LogoBlock extends BaseBlock {
  type: 'logo';
  src: string;
  alt?: string;
  width?: number;
  link?: string;
}

// ── الـ 12 الجديدة ────────────────────────────────────────────────────────────

export interface VideoBlock extends BaseBlock {
  type: 'video';
  src: string; // base64 أو YouTube/Vimeo URL
  caption?: string;
  autoplay?: boolean;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
  source?: string;
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  direction?: 'horizontal' | 'vertical';
  items: Array<{ date?: string; title: string; description?: string; icon?: string }>;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  items: Array<{ value: string; label: string; prefix?: string; suffix?: string }>;
  columns?: 2 | 3 | 4;
}

export interface AlertBlock extends BaseBlock {
  type: 'alert';
  variant: 'info' | 'warning' | 'danger' | 'success' | 'tip';
  title: string;
  content?: string;
  dismissible?: boolean;
}

export interface ChecklistBlock extends BaseBlock {
  type: 'checklist';
  items: Array<{ label: string; checked: boolean; description?: string }>;
  interactive?: boolean;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: Array<{ src: string; alt?: string; caption?: string }>;
  columns?: 2 | 3 | 4;
  lightbox?: boolean;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  icon?: string;
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  src: string;
  title?: string;
  height?: number;
  allowFullscreen?: boolean;
}

export interface AccordionBlock extends BaseBlock {
  type: 'accordion';
  items: Array<{ title: string; content: string; defaultOpen?: boolean }>;
  allowMultiple?: boolean;
}

export interface RatingBlock extends BaseBlock {
  type: 'rating';
  value: number; // 0-5
  maxValue?: number;
  label?: string;
  showValue?: boolean;
}

// ── Union Type ───────────────────────────────────────────────────────────────

export type Block =
  | TextBlock | HighlightBlock | StepsBlock | CardsBlock | FaqBlock | TableBlock
  | FlowBlock | ImageBlock | CompareBlock | ImageTextBlock | DividerBlock | LogoBlock
  | VideoBlock | CodeBlock | QuoteBlock | TimelineBlock | StatsBlock | AlertBlock
  | ChecklistBlock | GalleryBlock | ButtonBlock | EmbedBlock | AccordionBlock | RatingBlock;
