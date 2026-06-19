import type { ContentBlock } from "@/lib/blog-types";
import {
  HeroBlock,
  HeadingBlock,
  ParagraphBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  ImageTextBlock,
  VideoBlock,
  TravelInfoTableBlock,
  HighlightCardBlock,
  FAQBlock,
  QuoteBlock,
  CalloutBlock,
  TimelineBlock,
  ChecklistBlock,
  RelatedPackageBlock,
  MapBlock,
  DividerBlock,
  AudioPhraseBlock,
  LanguageGuideBlock,
} from "./blocks";

interface Props {
  contentBlocks?: ContentBlock[];
  /** Legacy plain-text/Markdown content for backwards compatibility */
  legacyContent?: string;
}

export default function BlockRenderer({ contentBlocks, legacyContent }: Props) {
  // If no contentBlocks but legacy content exists, render it as a paragraph
  if (!contentBlocks || contentBlocks.length === 0) {
    if (legacyContent) {
      return (
        <div className="prose prose-invert prose-amber max-w-none
          prose-p:text-foreground/90 prose-p:leading-relaxed
          prose-a:text-amber-400
          prose-strong:text-foreground
          prose-blockquote:border-l-amber-500
          prose-li:marker:text-amber-500
        ">
          {/* Render legacy markdown-ish content as preformatted text */}
          <div
            className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap"
          >
            {legacyContent}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      {contentBlocks.map((block, idx) => {
        const key = `block-${idx}-${block.type}`;

        switch (block.type) {
          case "hero":
            return <HeroBlock key={key} block={block} />;
          case "heading":
            return <HeadingBlock key={key} block={block} />;
          case "paragraph":
            return <ParagraphBlock key={key} block={block} />;
          case "richText":
            return <RichTextBlock key={key} block={block} />;
          case "image":
            return <ImageBlock key={key} block={block} />;
          case "gallery":
            return <GalleryBlock key={key} block={block} />;
          case "imageText":
            return <ImageTextBlock key={key} block={block} />;
          case "video":
            return <VideoBlock key={key} block={block} />;
          case "travelInfoTable":
            return <TravelInfoTableBlock key={key} block={block} />;
          case "highlightCard":
            return <HighlightCardBlock key={key} block={block} />;
          case "faq":
            return <FAQBlock key={key} block={block} />;
          case "quote":
            return <QuoteBlock key={key} block={block} />;
          case "callout":
            return <CalloutBlock key={key} block={block} />;
          case "timeline":
            return <TimelineBlock key={key} block={block} />;
          case "checklist":
            return <ChecklistBlock key={key} block={block} />;
          case "relatedPackage":
            return <RelatedPackageBlock key={key} block={block} />;
          case "map":
            return <MapBlock key={key} block={block} />;
          case "divider":
            return <DividerBlock key={key} block={block} />;
          case "audioPhrase":
            return <AudioPhraseBlock key={key} block={block} />;
          case "languageGuide":
            return <LanguageGuideBlock key={key} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
