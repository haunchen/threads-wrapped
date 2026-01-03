/**
 * 響應式縮放工具
 * 根據視窗大小動態調整容器縮放比例
 */

(function () {
  function calcScale() {
    const isMobile = window.innerWidth <= 480;
    // 手機版：按鈕兩行約 90px + footer 約 60px + padding 24px + gap 32px = 206px
    // 桌面版：按鈕一行約 50px + footer 約 60px + padding 32px + gap 32px = 174px
    const reservedHeight = isMobile ? 206 : 174;
    const padding = isMobile ? 24 : 32;
    const availableWidth = window.innerWidth - padding;
    const availableHeight = window.innerHeight - reservedHeight;
    const scaleW = availableWidth / 1080;
    const scaleH = availableHeight / 1080;
    const scale = Math.min(scaleW, scaleH, 1);
    document.documentElement.style.setProperty('--container-scale', scale);
  }
  
  calcScale();
  window.addEventListener('resize', calcScale);
})();
