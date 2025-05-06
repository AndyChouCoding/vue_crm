<template>
    <div class="p-10">
      <!-- 第一行 -->
      <div class="grid grid-cols-3 gap-6 mb-10">
        <div class="p-4 h-[200px] text-center border rounded-xl">
          User
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          代辦事項
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          今日個人服務人數
        </div>
      </div>
  
      <!-- 第二行 -->
      <div class="grid grid-cols-4 gap-6 mb-10">
        <div class="p-4 h-[200px] text-center border rounded-xl">
          本週客服趨勢
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          等待服務人數
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          處理中人數
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          今日團隊服務人數
        </div>
      </div>
  
      <!-- 第三行 -->
      <div class="grid grid-cols-4 gap-6">
        <div class="p-4 h-[200px] text-center border rounded-xl">
          配對失敗人數
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          客戶標籤
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          重新分配客服
        </div>
        <div class="p-4 h-[200px] text-center border rounded-xl">
          客服人員帳號管理
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'Dashboard'
  })
  </script>
  