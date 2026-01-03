/**
 * 漢堡選單控制模組
 */

// 漢堡選單控制
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');

hamburgerBtn.addEventListener('click', function () {
  hamburgerBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
  const isExpanded = navMenu.classList.contains('active');
  hamburgerBtn.setAttribute('aria-expanded', isExpanded);
});

// 點擊選單外部關閉
document.addEventListener('click', function (e) {
  if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

// ESC 鍵關閉選單
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});
