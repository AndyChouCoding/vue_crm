<template>
    <div class="p-10">
      <!-- 第一行 -->
      <div class="grid grid-cols-3 gap-6 mb-10">
        <div
          class="p-4 h-[200px] bg-[#f5f3f9] border-0 rounded-xl cursor-pointer hover:bg-gray-100 transition"
          @click="goToMessage"
        >
          <div class="flex justify-between">
            <div >
                <img :src="auth.user?.photo ||'/images/user/default.png'" class="w-[60px] h-[60px] rounded-full " alt="avatar">
            </div>
            <div>
                <div><span>{{ auth.user?.name }}</span></div>
                <div><span class="py-1 px-2 bg-[#8a69f7] text-white rounded-md">{{  auth.user?.role }}</span></div>
            </div>
          </div>
          <div class="h-1 border-b-2 mb-1"></div>
          <!-- manager -->
          <div v-if="auth.user?.role ==='manager'" class="p-2">
            <ul>
                <li><a href="">負責帳號</a></li>
                <li><a href="">全部帳號</a></li>
                <li><a href="">負責標籤</a></li>
                <li><a href="">無參與分配</a></li>
            </ul>
          </div>
          <!-- agent -->
          <div v-else  class="p-2">
            <ul>
                <li><a href="">負責帳號</a></li>
                
                <li><a href="">負責標籤</a></li>
                
            </ul>
          </div>
        </div>
        <div class="p-4 h-[200px] text-center  rounded-xl bg-[#f5f3f9] border-0">
          代辦事項
        </div>
        <div class="p-4 h-[200px] text-center  rounded-xl bg-[#f5f3f9] border-0">
          今日個人服務人數
        </div>
      </div>
  
      <!-- 第二行 -->
      <div class="grid grid-cols-4 gap-6 mb-10">
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          本週客服趨勢
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          等待服務人數
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          處理中人數
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          今日團隊服務人數
        </div>
      </div>
  
      <!-- 第三行 -->
      <div v-if="auth.user?.role === 'manager'" class="grid grid-cols-4 gap-6">
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          配對失敗人數
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          客戶標籤
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          重新分配客服
        </div>
        <div class="p-4 h-[200px] text-center rounded-xl bg-[#f5f3f9] border-0">
          客服人員帳號管理
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  export default defineComponent({
    name: 'Dashboard',
    setup() {
      const router = useRouter();
      const auth = useAuthStore();

      function goToMessage() {
        router.push({ name: 'MessageCenter' });
      }

      return { goToMessage, auth, };
    }
  })
  </script>
  