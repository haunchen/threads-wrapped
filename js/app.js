/**
 * app.js - 主程式流程控制
 * 處理檔案上傳、頁面切換、圖片匯出
 */

import { Parser } from './parser.js';
import { Analyzer } from './analyzer.js';
import { Renderer } from './renderer.js';

class App {
  constructor() {
    this.parser = new Parser();
    this.stats = null;

    this.initElements();
    this.initEventListeners();
  }

  /**
   * 初始化 DOM 元素參照
   */
  initElements() {
    // 頁面
    this.uploadPage = document.getElementById('upload-page');
    this.loadingPage = document.getElementById('loading-page');
    this.resultPage = document.getElementById('result-page');

    // 上傳相關
    this.dropZone = document.getElementById('drop-zone');
    this.folderInput = document.getElementById('folder-input');

    // Loading 相關
    this.loadingText = document.getElementById('loading-text');
    this.progressFill = document.getElementById('progress-fill');

    // 按鈕
    this.downloadBtn = document.getElementById('download-btn');
    this.restartBtn = document.getElementById('restart-btn');

    // 結果容器
    this.wrappedContainer = document.getElementById('wrapped-container');
  }

  /**
   * 初始化事件監聽
   */
  initEventListeners() {
    // 點擊上傳區域
    this.dropZone.addEventListener('click', () => {
      this.folderInput.click();
    });

    // 檔案選擇
    this.folderInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFiles(e.target.files);
      }
    });

    // 拖曳事件
    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('dragover');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('dragover');
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('dragover');

      // 嘗試取得資料夾
      const items = e.dataTransfer.items;
      if (items) {
        this.handleDataTransferItems(items);
      }
    });

    // 下載按鈕
    this.downloadBtn.addEventListener('click', () => {
      this.downloadImage();
    });

    // 重新開始按鈕
    this.restartBtn.addEventListener('click', () => {
      this.restart();
    });
  }

  /**
   * 處理 DataTransfer items（拖曳）
   */
  async handleDataTransferItems(items) {
    const files = [];

    // 遞迴讀取資料夾
    const readEntry = async (entry, path = '') => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file((file) => {
            // 創建帶有路徑的 File 物件
            Object.defineProperty(file, 'webkitRelativePath', {
              value: path + file.name
            });
            files.push(file);
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        return new Promise((resolve) => {
          const readEntries = () => {
            dirReader.readEntries(async (entries) => {
              if (entries.length === 0) {
                resolve();
              } else {
                for (const e of entries) {
                  await readEntry(e, path + entry.name + '/');
                }
                readEntries();
              }
            });
          };
          readEntries();
        });
      }
    };

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        await readEntry(entry);
      }
    }

    if (files.length > 0) {
      this.handleFiles(files);
    }
  }

  /**
   * 處理檔案
   */
  async handleFiles(files) {
    this.showPage('loading');
    this.updateProgress(0, '正在讀取檔案...');

    try {
      // 解析檔案
      this.updateProgress(20, '正在解析 Threads 資料...');
      const data = await this.parser.parseFiles(files);

      // 分析資料
      this.updateProgress(50, '正在分析統計資料...');
      const analyzer = new Analyzer(data);
      this.stats = analyzer.analyze();

      // 渲染結果
      this.updateProgress(80, '正在產生視覺化結果...');
      const renderer = new Renderer(this.stats);
      await renderer.render();

      this.updateProgress(100, '完成！');

      // 延遲顯示結果頁
      await this.delay(500);
      this.showPage('result');

    } catch (error) {
      console.error('Error:', error);
      alert(`錯誤：${error.message}`);
      this.showPage('upload');
    }
  }

  /**
   * 更新進度
   */
  updateProgress(percent, text) {
    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`;
    }
    if (this.loadingText) {
      this.loadingText.textContent = text;
    }
  }

  /**
   * 切換頁面
   */
  showPage(page) {
    this.uploadPage.classList.remove('active');
    this.loadingPage.classList.remove('active');
    this.resultPage.classList.remove('active');

    switch (page) {
      case 'upload':
        this.uploadPage.classList.add('active');
        break;
      case 'loading':
        this.loadingPage.classList.add('active');
        break;
      case 'result':
        this.resultPage.classList.add('active');
        break;
    }
  }

  /**
   * 下載圖片
   */
  async downloadImage() {
    if (!this.wrappedContainer) return;

    this.downloadBtn.disabled = true;
    this.downloadBtn.textContent = '正在產生圖片...';

    try {
      // 暫時移除動畫類別以確保完整渲染
      const animateItems = this.wrappedContainer.querySelectorAll('.animate-item');
      animateItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });

      // 確保熱力圖格子都顯示
      const heatmapCells = this.wrappedContainer.querySelectorAll('.heatmap-cell');
      heatmapCells.forEach(cell => {
        cell.style.opacity = '1';
      });

      // 確保長條圖都顯示
      const weeklyBars = this.wrappedContainer.querySelectorAll('.weekly-bar');
      weeklyBars.forEach(bar => {
        bar.style.transform = 'scaleY(1)';
      });

      // 暫時移除 transform scale 以確保正確截圖
      const originalTransform = this.wrappedContainer.style.transform;
      const originalMargin = this.wrappedContainer.style.margin;
      this.wrappedContainer.style.transform = 'none';
      this.wrappedContainer.style.margin = '0';

      // 使用 html2canvas 截圖
      const canvas = await html2canvas(this.wrappedContainer, {
        width: 1080,
        height: 1080,
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false
      });

      // 還原 transform
      this.wrappedContainer.style.transform = originalTransform;
      this.wrappedContainer.style.margin = originalMargin;

      // 下載圖片
      const link = document.createElement('a');
      link.download = `threads_wrapped_2025_${this.stats?.username || 'user'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('下載失敗:', error);
      alert('圖片產生失敗，請重試。');
    }

    this.downloadBtn.disabled = false;
    this.downloadBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      下載圖片
    `;
  }

  /**
   * 重新開始
   */
  restart() {
    // 重置狀態
    this.stats = null;
    this.folderInput.value = '';
    this.updateProgress(0, '正在分析你的 Threads 資料...');

    // 重置動畫狀態
    const animateItems = document.querySelectorAll('.animate-item');
    animateItems.forEach(item => {
      item.classList.remove('visible');
      item.style.opacity = '';
      item.style.transform = '';
    });

    const heatmapCells = document.querySelectorAll('.heatmap-cell');
    heatmapCells.forEach(cell => {
      cell.classList.remove('animate');
      cell.style.opacity = '';
    });

    const weeklyBars = document.querySelectorAll('.weekly-bar');
    weeklyBars.forEach(bar => {
      bar.classList.remove('animate');
      bar.style.transform = '';
    });

    this.showPage('upload');
  }

  /**
   * 延遲函數
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
