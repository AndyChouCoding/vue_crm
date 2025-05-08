<template>
    <div class="flex p-10">
      <!-- 左侧面板 -->
      <div class="w-[300px]">
        <!-- 用户卡片 -->
        <div class="w-full h-[200px] shadow-2xl rounded-xl mb-4">
          <div class="flex justify-around py-4 text-center">
            <img
              class="w-[60px] h-[60px] rounded-full mr-4"
              :src="auth.user?.photo || '/images/user/default.png'"
              alt="avatar"
            />
            <div>
              <div>{{ auth.user?.name }}</div>
              <div class="bg-purple-500 text-white p-1 rounded">
                {{ auth.user?.role }}
              </div>
            </div>
          </div>
          <div class="border-b-2"></div>
          <!-- manager -->
          <div v-if="auth.user?.role === 'manager'" class="p-1 ml-4">
            <ul>
              <li><a href="">負責帳號</a></li>
              <li><a href="">全部帳號</a></li>
              <li><a href="">負責標籤</a></li>
              <li><a href="">無參與分配</a></li>
            </ul>
          </div>
          <!-- agent -->
          <div v-else class="p-1 ml-4">
            <ul>
              <li><a href="">負責帳號</a></li>
              <li><a href="">負責標籤</a></li>
            </ul>
          </div>
        </div>
  
        <!-- 客户列表 -->
        <div>
          <ul>
            <li
              v-for="c in customers"
              :key="c.id"
              @click="selectCustomer(c)"
              :class="[
                'p-4 cursor-pointer rounded-2xl shadow-xl mb-4',
                selectedCustomer?.id === c.id ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              <div>
                <div class="flex items-center">
                  <img
                    class="w-[50px] h-[50px] rounded-full mr-4"
                    :src="c.photo || '/images/user/default.png'"
                    alt="cust avatar"
                  />
                  <div>
                    <div>{{ c.name }}</div>
                    <div class="text-gray-500 text-xs">您有新訊息</div>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <div class="p-1 m-2 border w-[170px] text-center">
                    Social Media
                  </div>
                  <!-- 这里新增按钮，点击后调用 openWindow -->
                  <div class="w-[30px] h-[30px] border rounded-full flex items-center justify-center">
                    <button @click.stop="openWindow" class=" relative">Btn</button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- 右侧聊天区 -->
      <div class="flex-1 ml-10">
        <!-- manager 可切换 agent -->
        <div v-if="auth.user?.role === 'manager'" class="mb-4">
          <ul class="flex">
            <li
              v-for="a in agents"
              :key="a.id"
              @click="selectAgent(a)"
              :class="[
                'cursor-pointer mb-2 mx-2 rounded-full',
                selectedAgent?.id === a.id ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              <img
                class="w-[50px] h-[50px] rounded-full object-cover"
                :src="a.photo || '/images/user/default.png'"
                alt="agent avatar"
              />
            </li>
          </ul>
        </div>
        <Chat :ticketId="selectedTicketId" />
      </div>
  
      <!-- Modal 窗口 -->
      <div
        v-if="showWindow"
        class=" absolute top-100 left-80  w-[500px] h-[450px] rounded-2xl bg-neutral-300 text-[#000] z-50 flex flex-col items-center justify-center"
      >
          <div class="my-2 text-center">
            <div class=" p-2 w-[450px] ">
                <h3 class="border-b-[2px] pb-2 text-[20px]">客服處理狀態</h3>
            </div>
            <div class="flex justify-around p-4 border rounded-2xl my-2 w-[450px]">
                <div class="border rounded-xl flex flex-col items-center justify-center w-[100px] h-[80px]">
                    <div class="w-[20px] h-[20px] border rounded-full flex "></div>
                    <p>接受</p>
                </div>
                <div class="border rounded-xl flex flex-col items-center justify-center w-[100px] h-[80px]">
                    <div class="w-[20px] h-[20px] border rounded-full flex"></div>
                    <p>拒絕</p>
                </div>
                <div class="border rounded-xl flex flex-col items-center justify-center w-[100px] h-[80px]">
                    <div class="w-[20px] h-[20px] border rounded-full flex"></div>
                    <p>轉交主管</p>
                </div>
            </div>
          </div>
          <div class="w-[450px] h-[100px] border rounded-2xl mb-4 text-center flex flex-col items-center justify-center">
            <p class="text-[20px]">系統已經分配給 <span>{{ auth.user?.name }}</span></p>
            <p class="text-[12px]">2025/12/25 12:00</p>
          </div>
          <div class="w-[450px] h-[100px] border rounded-2xl mb-4 text-center flex flex-col items-center justify-center">
            <p class="text-[20px]">主管標示為處理中</p>
            <p class="text-[12px]">2025/12/25 12:00</p>
          </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from "vue";
  import { useAuthStore } from "../stores/auth";
  import Chat from "./chat.vue";
  
  interface Agent { id: string; name: string; photo?: string }
  interface Customer { id: string; name: string; photo?: string }
  interface Ticket   { id: string; customerId: string; agentId: string }
  
  export default defineComponent({
    components: { Chat },
    setup() {
      const auth = useAuthStore();
  
      const agents = ref<Agent[]>([]);
      const selectedAgent = ref<Agent | null>(null);
  
      const customers = ref<Customer[]>([]);
      const selectedCustomer = ref<Customer | null>(null);
      const selectedTicketId = ref<string>("");
  
      // Modal 控制
      const showWindow = ref(false);
  
      onMounted(async () => {
        if (auth.user?.role === "manager") {
          const res = await fetch(`/api/users?role=agent`);
          const data = await res.json();
          agents.value = data.users;
          if (agents.value.length) selectedAgent.value = agents.value[0];
        } else if (auth.user) {
          selectedAgent.value = {
            id: auth.user.id,
            name: auth.user.name,
            photo: auth.user.photo,
          };
        }
      });
  
      watch(
        selectedAgent,
        async (agent) => {
          if (!agent) {
            customers.value = [];
            selectedCustomer.value = null;
            return;
          }
          const res = await fetch(`/api/customers?agentId=${agent.id}`);
          const data = await res.json();
          customers.value = data.customers;
          selectedCustomer.value = customers.value[0] || null;
        },
        { immediate: true }
      );
  
      watch(
        selectedCustomer,
        async (cust) => {
          if (!cust || !selectedAgent.value) {
            selectedTicketId.value = "";
            return;
          }
          const res = await fetch(
            `/api/tickets?agentId=${selectedAgent.value.id}`
          );
          const list: Ticket[] = (await res.json()).tickets;
          const t = list.find((x) => x.customerId === cust.id);
          selectedTicketId.value = t?.id || "";
        },
        { immediate: true }
      );
  
      function selectAgent(a: Agent) {
        selectedAgent.value = a;
      }
      function selectCustomer(c: Customer) {
        selectedCustomer.value = c;
      }
      function openWindow() {
        showWindow.value = true;
      }
  
      return {
        auth,
        agents,
        selectedAgent,
        customers,
        selectedCustomer,
        selectedTicketId,
        showWindow,
        selectAgent,
        selectCustomer,
        openWindow,
      };
    },
  });
  </script>
  