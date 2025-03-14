/**
 * ナビゲーション機能
 * セクション間のナビゲーションとタブ切り替えを管理
 */

(function() {
  'use strict';

  // 初期化関数
  function initNavigation() {
    const navLinks = document.querySelectorAll('#survey-nav a');
    const sections = document.querySelectorAll('.survey-section');
    
    // ナビゲーションリンクのクリックイベントを設定
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          // スムーズスクロール
          smoothScrollTo(targetSection);
          
          // アクティブなナビリンクを更新
          updateActiveNavLink(this);
        }
      });
    });
  }

  // スムーズスクロール機能
  function smoothScrollTo(element) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = CONFIG.ANIMATION.SCROLL_DURATION;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, scrollY);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    // イージング関数
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }

  // アクティブなナビゲーションリンクを更新
  function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('#survey-nav a');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    activeLink.classList.add('active');
  }

  // 指定されたIDのセクションへスクロール
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navLink = document.querySelector(`#survey-nav a[href="#${sectionId}"]`);
    
    if (section && navLink) {
      smoothScrollTo(section);
      updateActiveNavLink(navLink);
    }
  }

  // 現在のアクティブセクションに基づいてナビゲーションを更新
  function updateNavigationBasedOnScroll() {
    const sections = document.querySelectorAll('.survey-section');
    let currentSectionId = null;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // 画面の中央付近に表示されているセクションをアクティブとする
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });
    
    if (currentSectionId) {
      const activeLink = document.querySelector(`#survey-nav a[href="#${currentSectionId}"]`);
      if (activeLink) {
        updateActiveNavLink(activeLink);
      }
    }
  }

  // 初期化
  window.addEventListener('DOMContentLoaded', initNavigation);
  
  // グローバル関数としてエクスポート
  window.SurveyNavigation = {
    scrollToSection: scrollToSection,
    updateActiveNavLink: updateActiveNavLink,
    updateNavigationBasedOnScroll: updateNavigationBasedOnScroll
  };
})();
