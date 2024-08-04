import { Quill } from 'react-quill';

// Custom Image Upload Module
class ImageUploader {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    // Create a hidden file input
    this.fileInput = document.createElement('input');
    this.fileInput.setAttribute('type', 'file');
    this.fileInput.setAttribute('accept', 'image/*');
    this.fileInput.style.display = 'none';

    // Add click event listener to the toolbar button
    this.quill.container.appendChild(this.fileInput);
    this.fileInput.addEventListener('change', this.handleFileChange.bind(this));

    // Add custom handler for image upload
    this.quill.getModule('toolbar').addHandler('image', this.selectLocalImage.bind(this));
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileInput.click();
  }

  async handleFileChange() {
    const file = this.fileInput.files[0];
    if (file) {
      try {
        const imageUrl = await this.options.upload(file);
        this.insertImage(imageUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
        // You might want to show an error message to the user here
      }
    }
  }

  insertImage(url) {
    const range = this.range;
    this.quill.insertEmbed(range.index, 'image', url);
  }
}

Quill.register('modules/imageUploader', ImageUploader);