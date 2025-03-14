/**
 * スクロール監視機能
 * ページスクロールに応じたUIの更新を管理
 */

(function() {
  'use strict';

  // スクロール監視の初期化
  function initScrollMonitor() {
    let scrollTimeout;
    
    // スクロールイベントのリスナー
    window.addEventListener('scroll', function() {
      // スクロール中は連続実行を避けるためにデバウンス処理
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    });
    
    // ページ読み込み時に一度実行
    handleScroll();
  }
  
  // スクロールハンドラー
  function handleScroll() {
    updateCurrentQuestionCard();
    updateNavigationBasedOnScroll();
  }
  
  // 現在表示中の質問カードを更新
  function updateCurrentQuestionCard() {
    const questionCards = document.querySelectorAll('.question-card');
    const viewportHeight = window.innerHeight;
    
    questionCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      
      // カードが画面の中央付近にある場合は「現在の質問」としてマーク
      if (rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2) {
        // すでに回答済みの場合は「current」クラスを付けない
        if (!card.classList.contains('answered')) {
          card.classList.add('current');
        }
      } else {
        card.classList.remove('current');
      }
    });
  }
  
  // スクロール位置に応じてナビゲーションを更新
  function updateNavigationBasedOnScroll() {
    // navigation.jsで定義されている関数を使用
    if (window.SurveyNavigation && typeof window.SurveyNavigation.updateNavigationBasedOnScroll === 'function') {
      window.SurveyNavigation.updateNavigationBasedOnScroll();
    }
  }
  
  // 指定された要素へのスクロールアニメーション
  function scrollToElement(element, offset = 0) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const targetPosition = rect.top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  // 初期化
  window.addEventListener('DOMContentLoaded', initScrollMonitor);
  
  // グローバル関数としてエクスポート
  window.ScrollMonitor = {
    scrollToElement: scrollToElement
  };
})();
