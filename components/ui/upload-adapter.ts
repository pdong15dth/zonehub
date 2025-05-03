/**
 * Custom upload adapter for CKEditor
 * This adapter saves images to the /public/uploads directory
 */

class UploadAdapter {
  private loader: any;
  private abortController: AbortController;

  constructor(loader: any) {
    this.loader = loader;
    this.abortController = new AbortController();
  }

  async upload(): Promise<Record<string, any>> {
    try {
      const file = await this.loader.file;
      const formData = new FormData();
      formData.append('file', file);

      // You can customize this URL to your API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      return {
        default: data.url
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  abort(): void {
    this.abortController.abort();
  }
}

export function UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader);
  };
} 