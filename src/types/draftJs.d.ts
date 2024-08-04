declare module 'draftjs-to-markdown' {
    import { RawDraftContentState } from 'draft-js';
    
    function draftToMarkdown(
      rawContent: RawDraftContentState,
      options?: {
        styleItems?: { [key: string]: (style: string) => string };
        entityItems?: { [key: string]: (entity: any, text: string) => string };
        preserveNewlines?: boolean;
      }
    ): string;
  
    export = draftToMarkdown;
  }