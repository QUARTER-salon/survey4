/**
 * フォームのバリデーション
 * フォームの入力検証と視覚的フィードバックを管理
 */

(function() {
  'use strict';

  // 初期化関数
  function initValidation() {
    // フォーム要素を取得
    const surveyForm = document.getElementById('survey-form');
    
    // フォーム送信イベントを処理
    surveyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        // バリデーション成功時はデータを送信
        submitFormData();
      }
    });
    
    // 入力項目変更時のリアルタイムバリデーション
    setupRealtimeValidation();
  }
  
  // フォームのバリデーション
  function validateForm() {
    const requiredFields = CONFIG.VALIDATION.REQUIRED_FIELDS;
    let isValid = true;
    let firstErrorElement = null;
    
    // 必須項目のチェック
    requiredFields.forEach(fieldName => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      const errorElement = document.getElementById(`${fieldName}-error`);
      const questionCard = document.getElementById(`Q${getQuestionNumber(fieldName)}`);
      
      // ラジオボタンの場合
      if (field && field.type === 'radio') {
        const checkedRadio = document.querySelector(`[name="${fieldName}"]:checked`);
        
        if (!checkedRadio) {
          isValid = false;
          showError(questionCard, errorElement);
          
          if (!firstErrorElement) {
            firstErrorElement = questionCard;
          }
        } else {
          hideError(questionCard, errorElement);
        }
      } 
      // その他のフィールドタイプの場合は必要に応じて追加
    });
    
    // 最初のエラー項目にスクロール
    if (firstErrorElement) {
      window.SurveyNavigation.scrollToSection(firstErrorElement.closest('.survey-section').id);
      highlightElement(firstErrorElement);
    }
    
    return isValid;
  }
  
  // エラーを表示
  function showError(questionCard, errorElement) {
    if (questionCard) {
      questionCard.classList.add('error');
    }
    
    if (errorElement) {
      errorElement.style.display = 'block';
    }
  }
  
  // エラーを非表示
  function hideError(questionCard, errorElement) {
    if (questionCard) {
      questionCard.classList.remove('error');
    }
    
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
  
  // 要素をハイライト表示
  function highlightElement(element) {
    element.classList.add('highlight');
    
    setTimeout(() => {
      element.classList.remove('highlight');
    }, CONFIG.ANIMATION.HIGHLIGHT_DURATION);
  }
  
  // フィールド名に対応する質問番号を取得
  function getQuestionNumber(fieldName) {
    const questionMap = {
      'store': 1,
      'rating': 2,
      'name': 3,
      'customer_type': 4,
      'gender': 5,
      'age': 6,
      'services': 7,
      'technical_satisfaction': 8,
      'staff_service': 9,
      'waiting_time': 10,
      'cleanliness': 11,
      'improvement': 12,
      'comments': 13
    };
    
    return questionMap[fieldName] || '';
  }
  
  // リアルタイムバリデーションのセットアップ
  function setupRealtimeValidation() {
    // 店舗選択のリアルタイムバリデーション
    const storeRadios = document.querySelectorAll('[name="store"]');
    storeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const questionCard = document.getElementById('Q1');
        const errorElement = document.getElementById('store-error');
        
        questionCard.classList.add('answered');
        hideError(questionCard, errorElement);
      });
    });
    
    // その他の入力項目のリアルタイムバリデーション設定
    setupAnsweredStateTracking();
  }
  
  // 質問回答状態の追跡をセットアップ
  function setupAnsweredStateTracking() {
    // ラジオボタン
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
      input.addEventListener('change', function() {
        const questionCard = this.closest('.question-card');
        if (questionCard) {
          questionCard.classList.add('answered');
        }
      });
    });
    
    // チェックボックス
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(input => {
      input.addEventListener('change', function() {
        const questionCard = this.closest('.question-card');
        if (questionCard) {
          questionCard.classList.add('answered');
        }
      });
    });
    
    // テキスト入力
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
      ['input', 'change'].forEach(eventType => {
        input.addEventListener(eventType, function() {
          const questionCard = this.closest('.question-card');
          if (questionCard && this.value.trim() !== '') {
            questionCard.classList.add('answered');
          } else if (questionCard && this.value.trim() === '') {
            questionCard.classList.remove('answered');
          }
        });
      });
    });
  }
  
  // フォームデータの送信
  function submitFormData() {
    const form = document.getElementById('survey-form');
    const formData = new FormData(form);
    const rating = StarRating.getRatingValue();
    
    // 送信ボタンを無効化して多重送信を防止
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    // フォームデータをオブジェクトに変換
    const data = {};
    formData.forEach((value, key) => {
      // 複数値（チェックボックス）の場合は配列として格納
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });
    
    // タイムスタンプを追加
    data.timestamp = new Date().toISOString();
    
    // データを送信
    fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(() => {
      // 送信成功時
      form.style.display = 'none';
      document.getElementById('survey-nav').style.display = 'none';
      
      // 評価に応じたサンキュー画面を表示
      if (rating >= CONFIG.HIGH_RATING_THRESHOLD) {
        showHighRatingThankYou(data);
      } else {
        showLowRatingThankYou();
      }
    })
    .catch(error => {
      console.error('送信エラー:', error);
      alert('送信中にエラーが発生しました。もう一度お試しください。');
    })
    .finally(() => {
      // 送信ボタンを再有効化
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    });
  }
  
  // 高評価時のサンキュー画面表示
  function showHighRatingThankYou(data) {
    const highRatingScreen = document.getElementById('thank-you-high');
    const ratingText = document.getElementById('thank-you-rating');
    const reviewButton = document.getElementById('review-button');
    const reviewComment = document.getElementById('review-comment');
    const copyButton = document.getElementById('copy-button');
    const selectedStore = data.store;
    
    // 評価に応じたテキスト表示
    ratingText.textContent = `星${data.rating}ありがとうございます！`;
    
    // 口コミコメントを生成
    let commentText = '';
    
    if (data.improvement && data.improvement.trim() !== '') {
      commentText += data.improvement + '\n\n';
    }
    
    if (data.comments && data.comments.trim() !== '') {
      commentText += data.comments;
    }
    
    // コメントがない場合はデフォルトテキスト
    if (commentText.trim() === '') {
      commentText = '素晴らしいサービスと技術に満足しています。スタッフの方々の対応も丁寧で、とても気持ちよく過ごせました。';
    }
    
    reviewComment.textContent = commentText;
    
    // コピーボタンの設定
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(commentText)
        .then(() => {
          copyButton.textContent = 'コピーしました！';
          setTimeout(() => {
            copyButton.textContent = 'コメントをコピー';
          }, 2000);
        })
        .catch(err => {
          console.error('コピーに失敗しました:', err);
          copyButton.textContent = 'コピーに失敗しました';
        });
    });
    
    // 投稿ボタンのURLを設定
    if (selectedStore && CONFIG.STORE_REVIEW_URLS[selectedStore]) {
      reviewButton.addEventListener('click', () => {
        window.open(CONFIG.STORE_REVIEW_URLS[selectedStore], '_blank');
      });
    }
    
    // 画面を表示
    highRatingScreen.style.display = 'block';
    
    // 画面上部にスクロール
    window.scrollTo(0, 0);
  }
  
  // 低評価時のサンキュー画面表示
  function showLowRatingThankYou() {
    const lowRatingScreen = document.getElementById('thank-you-low');
    lowRatingScreen.style.display = 'block';
    
    // 画面上部にスクロール
    window.scrollTo(0, 0);
  }
  
  // 初期化
  window.addEventListener('DOMContentLoaded', initValidation);
  
  // グローバル関数としてエクスポート
  window.SurveyValidation = {
    validateForm: validateForm,
    submitFormData: submitFormData
  };
})();
