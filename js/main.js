/**
 * メインのJavaScript
 * アプリケーション全体の初期化と統合
 */

(function() {
  'use strict';

  // アプリケーション初期化
  function initApp() {
    console.log('QUARTERアンケートアプリ初期化');
    
    // 質問カード追跡の初期化
    initQuestionTracking();
    
    // その他のセットアップ
    setupFormBehavior();
  }
  
  // 質問追跡機能の初期化
  function initQuestionTracking() {
    const questionCards = document.querySelectorAll('.question-card');
    
    // 初期状態で回答済みのカードをマーク（フォーム再読み込み時など）
    questionCards.forEach(card => {
      const inputs = card.querySelectorAll('input, textarea');
      let isAnswered = false;
      
      inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
          if (input.checked) {
            isAnswered = true;
          }
        } else if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea') {
          if (input.value.trim() !== '') {
            isAnswered = true;
          }
        }
      });
      
      if (isAnswered) {
        card.classList.add('answered');
      }
    });
  }
  
  // フォーム動作のセットアップ
  function setupFormBehavior() {
    // 質問へのフォーカス時に現在の質問としてマーク
    const inputs = document.querySelectorAll('.question-card input, .question-card textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        const questionCard = this.closest('.question-card');
        if (questionCard) {
          // 他の「current」クラスを削除
          document.querySelectorAll('.question-card.current').forEach(card => {
            if (card !== questionCard) {
              card.classList.remove('current');
            }
          });
          
          // フォーカスされた質問カードに「current」クラスを追加
          questionCard.classList.add('current');
        }
      });
    });
  }
  
  // Google Apps Script でデータを処理するためのコード（参考）
  /*
  // GAS側のコード例
  function doPost(e) {
    try {
      // リクエストデータの取得
      const data = JSON.parse(e.postData.contents);
      
      // スプレッドシートへのデータ保存
      const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
      const sheet = ss.getSheetByName('回答一覧') || ss.insertSheet('回答一覧');
      
      // ヘッダーがなければ追加
      if (sheet.getLastRow() === 0) {
        const headers = [
          'タイムスタンプ', '店舗', '総合評価', 'お名前', '来店状況', '性別', '年齢',
          'サービス', '技術満足度', 'スタッフ対応', '待ち時間', '清潔感', '改善点', 'その他感想'
        ];
        sheet.appendRow(headers);
      }
      
      // データを整形して保存
      const servicesArray = Array.isArray(data.services) ? data.services.join(', ') : data.services || '';
      
      const rowData = [
        data.timestamp || new Date().toISOString(),
        data.store || '',
        data.rating || '',
        data.name || '',
        data.customer_type || '',
        data.gender || '',
        data.age || '',
        servicesArray,
        data.technical_satisfaction || '',
        data.staff_service || '',
        data.waiting_time || '',
        data.cleanliness || '',
        data.improvement || '',
        data.comments || ''
      ];
      
      sheet.appendRow(rowData);
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  */
  
  // ページ読み込み完了時に初期化
  window.addEventListener('DOMContentLoaded', initApp);
})();
