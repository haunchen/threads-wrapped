/**
 * 漢堡選單控制
 * 提供選單開關、ARIA 狀態管理、鍵盤支援
 */

/**
 * 初始化漢堡選單
 */
export function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburgerBtn || !navMenu) {
    console.warn('漢堡選單元素未找到');
    return;
  }

  // 點擊按鈕切換選單
  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isActive = hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');

    // 更新 ARIA 屬性
    hamburgerBtn.setAttribute('aria-expanded', isActive);
    hamburgerBtn.setAttribute('aria-label', isActive ? '關閉選單' : '開啟選單');
  });

  // 點擊外部關閉選單
  document.addEventListener('click', function (e) {
    if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', '開啟選單');
    }
  });

  // Escape 鍵關閉選單
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburgerBtn.classList.contains('active')) {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', '開啟選單');
      hamburgerBtn.focus();
    }
  });
}

// 自動初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHamburgerMenu);
} else {
  initHamburgerMenu();
}
