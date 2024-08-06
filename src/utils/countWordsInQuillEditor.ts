export function countWordsInQuillEditor(quillContent: string): number {
    // Replace HTML tags with spaces
    const cleanContent = quillContent.replace(/<\/?[^>]+(>|$)/g, ' ');

    // Normalize whitespace and remove leading/trailing spaces
    const normalizedText = cleanContent.replace(/\s+/g, ' ').trim();

    // Split the text into words
    const words = normalizedText.split(' ');

    // Return the word count
    return words.length;
}