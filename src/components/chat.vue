<template>
    <div class=" shadow-2xl rounded-xl w-[820px] flex flex-col">
      <!-- 状态栏 -->
      <div class="h-[60px] border-b border-[black] flex items-center justify-center">
        <select v-model="localStatus" class="p-2  rounded border-0">
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
  
      <!-- 消息区 -->
      <div ref="chatContainer" class=" p-2 overflow-y-auto h-[500px] ">
        <div
          v-for="(m, idx) in localMessages"
          :key="idx"
          :class="[
            'max-w-[70%] p-2 rounded break-words flex flex-col ',
            m.from === 'user'
              ? 'self-start bg-gray-100 text-left'
              : 'self-end bg-blue-100 text-right'
          ]"
        >
          <div>{{ m.content }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ formatTime(m.timestamp) }}</div>
        </div>
      </div>
  
      <!-- 输入区 -->
      <div class="p-2 border-t">
        <textarea
          v-model="draft"
          @keydown.enter.prevent="onEnter"
          class="w-full h-[100px] border rounded p-2 resize-none overflow-y-auto"
          placeholder="輸入回覆（Shift+Enter 換行，Enter 送出）"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button @click="send" class="px-4 py-2 bg-blue-500 text-white rounded">
            送出
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue'
  type Status = '處理中' | '已完成' | '未處理'
  interface Message { content: string; timestamp: string; from: 'agent'|'user' }
  
  export default defineComponent({
    name: 'Chat',
    props: {
      ticketId:     { type: String, required: true },
      messages:     { type: Array as () => Message[], default: () => [] },
      initialStatus:{ type: String as () => Status, default: '處理中' }
    },
    emits: ['send', 'status-change'],
    setup(props, { emit }) {
      const statuses = ['處理中','已完成','未處理'] as Status[]
      const localStatus   = ref<Status>(props.initialStatus)
      const localMessages = ref<Message[]>([...props.messages])
      const draft         = ref<string>('')
      const chatContainer = ref<HTMLElement|null>(null)
  
      // 当父层 messages 变更，同步过来并滚到底
      watch(() => props.messages, newMsgs => {
        localMessages.value = [...newMsgs]
        nextTick(() => {
          if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        })
      }, { immediate: true })
  
      // 当父层 status 变更，同步
      watch(() => props.initialStatus, s => {
        localStatus.value = s as Status
      }, { immediate: true })
  
      // 本地状态改了，通知父层
      watch(localStatus, s => {
        emit('status-change', { ticketId: props.ticketId, status: s })
      })
  
      function send() {
        const txt = draft.value.trim()
        if (!txt) return
        emit('send', { ticketId: props.ticketId, content: txt })
        draft.value = ''
      }
      function onEnter(e: KeyboardEvent) {
        if (!e.shiftKey) send()
      }
  
      function formatTime(iso: string) {
        return new Date(iso).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        })
      }
  
      return {
        statuses,
        localStatus,
        localMessages,
        draft,
        send,
        onEnter,
        formatTime,
        chatContainer
      }
    }
  })
  </script>
  