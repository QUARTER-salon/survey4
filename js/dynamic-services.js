/**
 * 動的サービス機能
 * 動的なサービス選択機能を管理
 */

(function() {
  'use strict';

  // サービスのマッピング定義（店舗ごとに利用可能なサービス）
  const STORE_SERVICES = {
    'QUARTER': [
      { id: 'service1', value: 'カット', label: 'カット' },
      { id: 'service2', value: 'カラー', label: 'カラー' },
      { id: 'service3', value: 'パーマ', label: 'パーマ' },
      { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
      { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
      { id: 'service6', value: 'その他', label: 'その他（ネイル・着付け 等）' }
    ],
    'QUARTER RESORT': [
      { id: 'service1', value: 'カット', label: 'カット' },
      { id: 'service2', value: 'カラー', label: 'カラー' },
      { id: 'service3', value: 'パーマ', label: 'パーマ' },
      { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
      { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
      { id: 'service6', value: 'ヘッドスパ', label: 'ヘッドスパ' },
      { id: 'service7', value: 'その他', label: 'その他（ネイル・着付け 等）' }
    ],
    'QUARTER SEASONS': [
      { id: 'service1', value: 'カット', label: 'カット' },
      { id: 'service2', value: 'カラー', label: 'カラー' },
      { id: 'service3', value: 'パーマ', label: 'パーマ' },
      { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
      { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
      { id: 'service6', value: 'その他', label: 'その他（ネイル・着付け 等）' }
    ],
    'LINK': [
      { id: 'service1', value: 'カット', label: 'カット' },
      { id: 'service2', value: 'カラー', label: 'カラー' },
      { id: 'service3', value: 'パーマ', label: 'パーマ' },
      { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
      { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
      { id: 'service6', value: 'フェイシャル', label: 'フェイシャル' },
      { id: 'service7', value: 'その他', label: 'その他（ネイル・着付け 等）' }
    ],
    'iL': [
      { id: 'service1', value: 'カット', label: 'カット' },
      { id: 'service2', value: 'カラー', label: 'カラー' },
      { id: 'service3', value: 'パーマ', label: 'パーマ' },
      { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
      { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
      { id: 'service6', value: 'メイク', label: 'メイク' },
      { id: 'service7', value: 'ネイル', label: 'ネイル' },
      { id: 'service8', value: 'その他', label: 'その他（着付け 等）' }
    ]
  };

  // デフォルトのサービス（店舗未選択時）
  const DEFAULT_SERVICES = [
    { id: 'service1', value: 'カット', label: 'カット' },
    { id: 'service2', value: 'カラー', label: 'カラー' },
    { id: 'service3', value: 'パーマ', label: 'パーマ' },
    { id: 'service4', value: 'トリートメント', label: 'トリートメント' },
    { id: 'service5', value: 'スタイリング', label: 'スタイリング' },
    { id: 'service6', value: 'その他', label: 'その他（ネイル・着付け 等）' }
  ];

  // 初期化関数
  function initDynamicServices() {
    // 店舗選択のラジオボタン
    const storeRadios = document.querySelectorAll('[name="store"]');
    
    // 店舗選択時にサービス一覧を更新
    storeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const selectedStore = this.value;
        updateServiceOptions(selectedStore);
      });
    });
    
    // 初期状態でチェック済みの店舗があれば、そのサービスを表示
    const checkedStore = document.querySelector('[name="store"]:checked');
    if (checkedStore) {
      updateServiceOptions(checkedStore.value);
    }
  }
  
  // サービス選択肢を更新
  function updateServiceOptions(storeName) {
    const servicesContainer = document.querySelector('#Q7 .checkbox-options');
    const services = STORE_SERVICES[storeName] || DEFAULT_SERVICES;
    
    // 現在選択されているサービスの値を保存
    const selectedServices = Array.from(document.querySelectorAll('[name="services"]:checked'))
      .map(checkbox => checkbox.value);
    
    // 既存のサービス選択肢をクリア
    servicesContainer.innerHTML = '';
    
    // 新しいサービス選択肢を生成
    services.forEach(service => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = service.id;
      checkbox.name = 'services';
      checkbox.value = service.value;
      
      // 前回選択されていたサービスがあれば、チェック状態を保持
      if (selectedServices.includes(service.value)) {
        checkbox.checked = true;
      }
      
      const label = document.createElement('label');
      label.htmlFor = service.id;
      label.textContent = service.label;
      
      optionDiv.appendChild(checkbox);
      optionDiv.appendChild(label);
      servicesContainer.appendChild(optionDiv);
    });
    
    // チェックボックス状態変更イベントを設定（回答済み状態の管理）
    setupServiceCheckboxEvents();
  }
  
  // サービスチェックボックスのイベント設定
  function setupServiceCheckboxEvents() {
    const checkboxes = document.querySelectorAll('#Q7 [name="services"]');
    const questionCard = document.getElementById('Q7');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        if (anyChecked) {
          questionCard.classList.add('answered');
        } else {
          questionCard.classList.remove('answered');
        }
      });
    });
  }
  
  // 初期化
  window.addEventListener('DOMContentLoaded', initDynamicServices);
  
  // グローバル関数としてエクスポート
  window.DynamicServices = {
    updateServiceOptions: updateServiceOptions
  };
})();
