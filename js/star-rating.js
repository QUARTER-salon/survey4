/**
 * 星評価機能
 * 星評価の機能と視覚的フィードバックを管理
 */

(function() {
  'use strict';

  // 低評価確認モーダルのHTML（動的に作成するため）
  const lowRatingModalHtml = `
    <div id="low-rating-modal" class="modal">
      <div class="modal-content">
        <h3>評価の確認</h3>
        <p>星<span id="selected-rating"></span>での評価を送信します。<br>何か改善すべき点がございましたら、ぜひご意見をお聞かせください。</p>
        <div class="modal-buttons">
          <button id="confirm-rating" class="primary-button">評価を確定する</button>
          <button id="cancel-rating" class="secondary-button">戻る</button>
        </div>
      </div>
    </div>
  `;

  // 初期化関数
  function initStarRating() {
    const starInputs = document.querySelectorAll('.stars input[type="radio"]');
    const ratingValue = document.getElementById('rating-value');
    
    // 星評価のクリックイベント
    starInputs.forEach(input => {
      input.addEventListener('change', function() {
        const value = parseInt(this.value);
        ratingValue.textContent = value;
        ratingValue.classList.add('rating-changed');
        
        setTimeout(() => {
          ratingValue.classList.remove('rating-changed');
        }, 300);
        
        // 質問カードを回答済みとしてマーク
        const questionCard = document.getElementById('Q2');
        questionCard.classList.add('answered');
        questionCard.classList.remove('error');
        
        // エラーメッセージを非表示
        document.getElementById('rating-error').style.display = 'none';
        
        // 低評価の場合は確認モーダルを表示
        if (value <= 2) {
          showLowRatingConfirmation(value);
        }
      });
    });
    
    // 初期状態で選択されている場合は値を表示
    const checkedStar = document.querySelector('.stars input[type="radio"]:checked');
    if (checkedStar) {
      ratingValue.textContent = checkedStar.value;
    }
    
    // 低評価確認モーダルを準備
    prepareLowRatingModal();
  }
  
  // 低評価確認モーダルを準備
  function prepareLowRatingModal() {
    // モーダルがまだ存在しない場合のみ追加
    if (!document.getElementById('low-rating-modal')) {
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = lowRatingModalHtml;
      document.body.appendChild(modalContainer.firstElementChild);
      
      // モーダルイベントリスナーを設定
      document.getElementById('confirm-rating').addEventListener('click', () => {
        document.getElementById('low-rating-modal').style.display = 'none';
      });
      
      document.getElementById('cancel-rating').addEventListener('click', () => {
        document.getElementById('low-rating-modal').style.display = 'none';
        // 評価を星3(普通)にリセット
        document.getElementById('star3').checked = true;
        document.getElementById('rating-value').textContent = '3';
      });
    }
  }
  
  // 低評価確認モーダルを表示
  function showLowRatingConfirmation(value) {
    const modal = document.getElementById('low-rating-modal');
    document.getElementById('selected-rating').textContent = value;
    modal.style.display = 'flex';
  }
  
  // 星評価の値を取得
  function getRatingValue() {
    const checkedStar = document.querySelector('.stars input[type="radio"]:checked');
    return checkedStar ? parseInt(checkedStar.value) : 0;
  }
  
  // 初期化
  window.addEventListener('DOMContentLoaded', initStarRating);
  
  // スタイルシートを動的に追加（モーダル用）
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    
    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 0;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .modal-content h3 {
      color: var(--primary-color);
      margin-bottom: 15px;
    }
    
    .modal-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .primary-button, .secondary-button {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
    }
    
    .primary-button {
      background-color: var(--primary-color);
      color: white;
    }
    
    .secondary-button {
      background-color: #f1f1f1;
      color: var(--text-color);
    }
    
    @media (max-width: 480px) {
      .modal-buttons {
        flex-direction: column;
        gap: 10px;
      }
      
      .primary-button, .secondary-button {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
  
  // グローバル関数としてエクスポート
  window.StarRating = {
    getRatingValue: getRatingValue
  };
})();
