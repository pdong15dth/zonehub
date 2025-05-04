'use client';

/**
 * Plugin cho CKEditor để thêm chức năng chèn hình ảnh từ URL
 */
export function ImageFromUrlPlugin(editor: any) {
  // Đăng ký button trong toolbar
  editor.ui.componentFactory.add('imageFromUrl', () => {
    // Tạo một button element đơn giản
    const button = {
      // Khai báo các thuộc tính cần thiết
      element: document.createElement('button'),
      
      get label(): string {
        return this._label;
      },
      
      set label(text: string) {
        this._label = text;
        this.element.textContent = text;
      },
      
      _label: 'Chèn hình ảnh từ URL',
      
      // Thiết lập icon
      set icon(icon: string) {
        this.element.innerHTML = icon;
      },
      
      // Tương tự như addEventListener
      on(eventName: string, callback: Function) {
        if (eventName === 'execute') {
          this.element.addEventListener('click', () => callback());
        }
        return this;
      },
      
      // Kích hoạt một sự kiện
      fire(eventName: string) {
        if (eventName === 'execute') {
          // Thực hiện sự kiện click
          this.element.click();
        }
      },
      
      // Theo dõi chế độ dark mode
      _isDarkMode: false,
      
      updateTheme(isDark: boolean) {
        this._isDarkMode = isDark;
        // Cập nhật lại icon với màu sắc phù hợp
        this.render();
      },
      
      // Phương thức render CKEditor cần
      render() {
        this.element.className = 'ck ck-button';
        
        // Chọn màu phù hợp với theme
        const iconColor = this._isDarkMode ? '#f8f9fa' : '#1e1e2e';
        
        this.element.innerHTML = `
          <span class="ck ck-icon">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="${iconColor}"/>
            </svg>
          </span>
          <span class="ck ck-button__label" style="color: ${iconColor}">Chèn hình ảnh từ URL</span>
        `;
        this.element.setAttribute('type', 'button');
        this.element.setAttribute('title', 'Chèn hình ảnh từ URL');
        
        // Theo dõi thay đổi theme từ container
        const checkTheme = () => {
          const editorElement = this.element.closest('.ck-editor');
          if (editorElement) {
            const container = editorElement.closest('.ck-dark-theme');
            const isDark = !!container;
            if (this._isDarkMode !== isDark) {
              this.updateTheme(isDark);
            }
          }
        };
        
        // Kiểm tra theme ngay khi render và thiết lập MutationObserver
        setTimeout(checkTheme, 0);
        
        // Thiết lập observer để theo dõi thay đổi của class trên container
        if (!this._observer) {
          this._observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                checkTheme();
              }
            });
          });
          
          // Bắt đầu quan sát sau khi phần tử được thêm vào DOM
          setTimeout(() => {
            const editorElement = this.element.closest('.ck-editor');
            if (editorElement && editorElement.parentElement) {
              // Kiểm tra observer tồn tại trước khi sử dụng
              if (this._observer) {
                this._observer.observe(editorElement.parentElement, { 
                  attributes: true,
                  attributeFilter: ['class']
                });
              }
            }
          }, 100);
        }
        
        return this.element;
      },
      
      // Phương thức destroy
      destroy() {
        if (this._observer) {
          this._observer.disconnect();
          this._observer = null;
        }
        this.element.remove();
      },
      
      // MutationObserver để theo dõi thay đổi theme
      _observer: null as MutationObserver | null
    };

    // Xử lý khi button được click
    button.on('execute', () => {
      // Hiển thị hộp thoại nhập URL
      const url = prompt('Nhập URL của hình ảnh:');
      
      if (url && isValidUrl(url)) {
        // Chèn hình ảnh vào editor
        editor.model.change((writer: any) => {
          const imageElement = writer.createElement('imageBlock', {
            src: url
          });
          editor.model.insertContent(imageElement, editor.model.document.selection);
        });
      } else if (url) {
        // Thông báo lỗi nếu URL không hợp lệ
        alert('URL không hợp lệ. Vui lòng kiểm tra lại.');
      }
    });

    return button;
  });
}

// Hàm kiểm tra URL có hợp lệ không
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
} 