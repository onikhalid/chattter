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
