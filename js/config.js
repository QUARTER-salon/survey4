/**
 * QUARTER アンケート設定ファイル
 * アプリケーション全体で使用する設定値を定義
 */

window.CONFIG = {
  // Google Apps Script WebアプリケーションのURL
  APPS_SCRIPT_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbxA-xuRc_F0Ih1KE9r9YXfOJ5WJqF0vUZvm3Eb_aQ9coqBjJzoA3nNoRuxNmajK06Xceg/exec',
  
  // 各店舗のGoogleマップレビューURL
  STORE_REVIEW_URLS: {
    'QUARTER': 'https://g.page/r/CfiWzYV0WLCdEBE/review',
    'QUARTER RESORT': 'https://g.page/r/CUpu9_cAhdaGEBE/review',
    'QUARTER SEASONS': 'https://g.page/r/CWAu_dLl0DJmEBE/review',
    'LINK': 'https://g.page/r/CYLblbqgWXsREBE/review',
    'iL': 'https://g.page/r/CemPjkInZSpLEBE/review'
  },
  
  // 高評価と見なす星の数（この値以上で口コミ誘導）
  HIGH_RATING_THRESHOLD: 4,
  
  // バリデーション関連
  VALIDATION: {
    REQUIRED_FIELDS: ['store', 'rating'],
    ERROR_MESSAGES: {
      store: '店舗を選択してください',
      rating: '評価を選択してください'
    }
  },
  
  // アニメーション関連
  ANIMATION: {
    SCROLL_DURATION: 500,  // スクロールアニメーションの時間（ミリ秒）
    HIGHLIGHT_DURATION: 2000  // ハイライト表示の時間（ミリ秒）
  }
};
