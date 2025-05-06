<template>
    <div class="border rounded-xl w-[820px] flex flex-col">
      <!-- 状态栏 -->
      <div class="h-[60px] border-b flex items-center justify-center">
        <select v-model="status" class="p-2 border rounded">
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
  
      <!-- 消息区 -->
      <div class="flex-1 p-2 overflow-y-auto flex flex-col">
        <div
          v-for="(m, idx) in messages"
          :key="idx"
          :class="[
            'max-w-[70%] p-2 rounded my-1 break-words flex flex-col',
            m.from==='user' ? 'self-start bg-gray-100 text-left' : 'self-end bg-blue-100 text-right'
          ]"
        >
          <div>{{ m.content }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ formatTime(m.timestamp) }}</div>
        </div>
      </div>
  
      <!-- 输入区 -->
      <div class="p-2 border-t">
        <textarea
          v-model="input"
          @keydown.enter.prevent="onEnter"
          class="w-full h-[100px] border rounded p-2 resize-none overflow-y-auto"
          placeholder="輸入回覆（Shift+Enter 換行，Enter 送出）"
        />
        <div class="flex justify-end mt-2">
          <button @click="sendMessage" class="px-4 py-2 bg-blue-500 text-white rounded">
            送出
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, onMounted } from 'vue'
  
  type Status = '處理中'|'已完成'|'未處理'
  type From   = 'agent'|'user'
  
  interface Message {
    content:string; timestamp:string; from:From
  }
  
  export default defineComponent({
    props: { ticketId: { type:String, required:true } },
    setup(props) {
      const statuses = ['處理中','已完成','未處理'] as Status[]
      const status = ref<Status>('處理中')
      const messages = ref<Message[]>([])
      const input = ref('')
  
      async function load() {
        if (!props.ticketId) return
        const res1 = await fetch(`/api/tickets/${props.ticketId}`)
        status.value = (await res1.json()).status as Status
  
        const res2 = await fetch(`/api/tickets/${props.ticketId}/messages`)
        const data = await res2.json()
        const loaded = data.messages.map((m:any):Message=>({
          content:m.content,
          timestamp:m.timestamp,
          from: m.platform==='line' ? 'user' : 'agent'
        }))
        messages.value = loaded.length ? loaded : [{ content:'您好，請問需要什麼協助？', timestamp:new Date().toISOString(), from:'user' }]
      }
  
      watch(() => props.ticketId, load, { immediate:true })
  
      watch(status, async s => {
        if (!props.ticketId) return
        await fetch(`/api/tickets/${props.ticketId}`, {
          method:'PATCH',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ status:s })
        })
      })
  
      function formatTime(iso:string) {
        const d = new Date(iso)
        return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      }
  
      async function sendMessage() {
        const txt = input.value.trim()
        if (!txt || !props.ticketId) return
        const msg:Message = { content:txt, timestamp:new Date().toISOString(), from:'agent' }
        messages.value.push(msg)
        input.value = ''
        await fetch(`/api/tickets/${props.ticketId}/messages`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ content:msg.content, platform:'fb', timestamp:msg.timestamp })
        })
      }
  
      function onEnter(e:KeyboardEvent) {
        if (!e.shiftKey) {
          sendMessage()
        }
      }
  
      return { statuses, status, messages, input, formatTime, sendMessage, onEnter }
    }
  })
  </script>
  