
<template>
    <div>
      <!-- Header -->
      <div class="bg-[#f8bf43] py-4">
        <div class="mx-auto my-[0] w-[1200px] flex justify-between items-center">
          <div class="text-xl font-bold text-[#8a69f7] " @click="onDashboard">CRM</div>
          <div></div>
          <div v-if="auth.user" class="flex items-center space-x-4">
            <span>已登入時長: {{ elapsedTime }}</span>
            <button @click="onLogout" class="text-red-600">Logout</button>
          </div>
        </div>
      </div>
      <!-- Main Content -->
      <div class="mx-auto bg-[#fbf8f6] min-h-[calc(100vh-4rem)] p-4">
        <div class=" w-[1200px] mx-auto my-[0]">
            <router-view/>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  
  export default defineComponent({
    setup() {
      const auth = useAuthStore()
      const router = useRouter()
  
      const loginTs = ref<number>(Date.now())
      const elapsedTime = ref<string>('00:00:00')
      let timer: number
  
      onMounted(() => {
        if (auth.user) {
          loginTs.value = Date.now()
          timer = window.setInterval(() => {
            const diff = Date.now() - loginTs.value
            const h = Math.floor(diff / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            const s = Math.floor((diff % 60000) / 1000)
            elapsedTime.value = 
              String(h).padStart(2,'0')+':' +
              String(m).padStart(2,'0')+':' +
              String(s).padStart(2,'0')
          }, 1000)
        }
      })
  
      onBeforeUnmount(() => {
        clearInterval(timer)
      })
  
      function onLogout() {
        auth.logout()
        router.push('/login')
      }
      function onDashboard () {
        router.push('/dashboard')
      }
  
      return { auth, elapsedTime, onLogout,onDashboard }
    }
  })
  </script>
  