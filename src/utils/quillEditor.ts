
import TurndownService from 'turndown';
import { marked } from 'marked';


export function countWordsInQuillEditor(quillContent: string): number {
    const cleanContent = quillContent.replace(/<\/?[^>]+(>|$)/g, ' ');
    const normalizedText = cleanContent.replace(/\s+/g, ' ').trim();
    const words = normalizedText.split(' ');
    return words.length;
}
export function cleanUpPostQuillEditorContent(quillContent: string): string {
    const cleanContent = quillContent.replace(/<\/?[^>]+(>|$)/g, ' ');
    const normalizedText = cleanContent.replace(/\s+/g, ' ').trim();
    return normalizedText;
}

export function averageReadingTime(content: string): number {
    const words = countWordsInQuillEditor(content);
    const wordsPerMinute = 200;
    const minutes = words / wordsPerMinute;
    const roundedReadingTimeInSeconds = Math.ceil(minutes * 60);
    return roundedReadingTimeInSeconds;
}





const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

// Customize turndown for Quill-specific elements
turndownService.addRule('quillHeader', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: function(content: string, node: Node) {
    const level = Number(node.nodeName.charAt(1));
    return '\n\n' + '#'.repeat(level) + ' ' + content + '\n\n';
  }
});

export async function convertHtmlToMarkdown(html: string): Promise<string> {
  // Remove any empty paragraphs that Quill might have added
  const cleanHtml = html.replace(/<p><br><\/p>/g, '');
  return turndownService.turndown(cleanHtml);
}

export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}