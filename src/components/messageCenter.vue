<template>
    <div class="flex p-10">
      <!-- 左侧面板 -->
      <div class="w-[300px]">
        <!-- 用户卡片 -->
        <div class="p-2 w-full h-[200px] border rounded-xl flex items-center mb-4">
          <img
            class="w-[60px] h-[60px] rounded-full mr-4"
            :src="auth.user?.photo || '/images/user/default.png'"
            alt="avatar"
          />
          <div>
            <div>{{ auth.user?.name }}</div>
            <div class="bg-purple-500 text-white p-1 rounded">{{ auth.user?.role }}</div>
          </div>
        </div>
  
        <!-- 客户列表 -->
        <div>
          <h4 class="font-bold mb-2">客戶列表</h4>
          <ul>
            <li
              v-for="c in customers"
              :key="c.id"
              @click="selectCustomer(c)"
              :class="['p-2 cursor-pointer rounded mb-2', selectedCustomer?.id === c.id ? 'bg-gray-200' : 'bg-white']"
            >
              <div class="flex items-center">
                <img class="w-[50px] h-[50px] rounded-full mr-4"
                     :src="c.photo||'/images/user/default.png'" alt="cust avatar"/>
                <div>
                  <div>{{ c.name }}</div>
                  <div class="text-gray-500 text-xs">您有新訊息</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- 右侧聊天区 -->
      <div class="flex-1 ml-10">
        <Chat :ticketId="selectedTicketId" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import Chat from './chat.vue'
  
  interface Customer { id:string; name:string; photo?:string }
  interface Ticket   { id:string; customerId:string; agentId:string }
  
  export default defineComponent({
    components: { Chat },
    setup() {
      const auth = useAuthStore()
      const customers = ref<Customer[]>([])
      const selectedCustomer = ref<Customer|null>(null)
      const selectedTicketId = ref<string>('')
  
      // 拉客户列表
      onMounted(async () => {
        if (!auth.user) return
        const res = await fetch(`/api/customers?agentId=${auth.user.id}`)
        const data = await res.json()
        customers.value = data.customers
        selectedCustomer.value = customers.value[0] || null
      })
  
      watch(selectedCustomer, async cust => {
        if (!cust || !auth.user) { selectedTicketId.value = ''; return }
        const res = await fetch(`/api/tickets?agentId=${auth.user.id}`)
        const list:Ticket[] = (await res.json()).tickets
        const t = list.find(x=>x.customerId===cust.id)
        selectedTicketId.value = t?.id || ''
      }, { immediate:true })
  
      function selectCustomer(c:Customer) {
        selectedCustomer.value = c
      }
  
      return { auth, customers, selectedCustomer, selectedTicketId, selectCustomer }
    }
  })
  </script>
  