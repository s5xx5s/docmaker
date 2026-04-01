import type { Block } from '../../types';
import { TextBlock } from './TextBlock';
import { HighlightBlock } from './HighlightBlock';
import { StepsBlock } from './StepsBlock';
import { CardsBlock } from './CardsBlock';
import { FaqBlock } from './FaqBlock';
import { TableBlock } from './TableBlock';
import { FlowBlock } from './FlowBlock';
import { ImageBlock } from './ImageBlock';
import { CompareBlock } from './CompareBlock';
import { ImageTextBlock } from './ImageTextBlock';
import { DividerBlock } from './DividerBlock';
import { LogoBlock } from './LogoBlock';
import { VideoBlock } from './VideoBlock';
import { CodeBlock } from './CodeBlock';
import { QuoteBlock } from './QuoteBlock';
import { TimelineBlock } from './TimelineBlock';
import { StatsBlock } from './StatsBlock';
import { AlertBlock } from './AlertBlock';
import { ChecklistBlock } from './ChecklistBlock';
import { GalleryBlock } from './GalleryBlock';
import { ButtonBlock } from './ButtonBlock';
import { EmbedBlock } from './EmbedBlock';
import { AccordionBlock } from './AccordionBlock';
import { RatingBlock } from './RatingBlock';

interface Props {
  block: Block;
  onUpdate(patch: Partial<Block>): void;
  isEditing: boolean;
}

export function BlockRenderer({ block, onUpdate, isEditing }: Props) {
  const props = { block: block as never, onUpdate: onUpdate as never, isEditing };
  switch (block.type) {
    case 'text':       return <TextBlock {...props} />;
    case 'highlight':  return <HighlightBlock {...props} />;
    case 'steps':      return <StepsBlock {...props} />;
    case 'cards':      return <CardsBlock {...props} />;
    case 'faq':        return <FaqBlock {...props} />;
    case 'table':      return <TableBlock {...props} />;
    case 'flow':       return <FlowBlock {...props} />;
    case 'image':      return <ImageBlock {...props} />;
    case 'compare':    return <CompareBlock {...props} />;
    case 'image-text': return <ImageTextBlock {...props} />;
    case 'divider':    return <DividerBlock {...props} />;
    case 'logo':       return <LogoBlock {...props} />;
    case 'video':      return <VideoBlock {...props} />;
    case 'code':       return <CodeBlock {...props} />;
    case 'quote':      return <QuoteBlock {...props} />;
    case 'timeline':   return <TimelineBlock {...props} />;
    case 'stats':      return <StatsBlock {...props} />;
    case 'alert':      return <AlertBlock {...props} />;
    case 'checklist':  return <ChecklistBlock {...props} />;
    case 'gallery':    return <GalleryBlock {...props} />;
    case 'button':     return <ButtonBlock {...props} />;
    case 'embed':      return <EmbedBlock {...props} />;
    case 'accordion':  return <AccordionBlock {...props} />;
    case 'rating':     return <RatingBlock {...props} />;
    default:           return <div className="text-gray-500 text-xs p-2">Unknown block</div>;
  }
}
