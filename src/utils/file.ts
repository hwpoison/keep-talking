/**
 * Triggers a file download in the browser.
 * @param content The text content of the file.
 * @param options Filename and other options.
 */
export function saveToFile(content: string, { fileName }: { fileName: string }) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
