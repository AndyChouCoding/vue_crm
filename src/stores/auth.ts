import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id:string; name:string; role:'agent'|'manager'; photo?:string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string|null>( localStorage.getItem('token') )
  const user  = ref<User|null>( JSON.parse(localStorage.getItem('user')||'null') )

  async function login(username:string, password:string) {
    const res = await fetch('/api/auth/login', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ username,password })
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  async function loadMe() {
    if (token.value && !user.value) {
      const res = await fetch('/api/auth/me', {
        headers:{ Authorization:`Bearer ${token.value}` }
      })
      if (res.ok) {
        const { user:u } = await res.json()
        user.value = u
        localStorage.setItem('user', JSON.stringify(u))
      }
    }
  }

  function logout() {
    token.value = null; user.value = null
    localStorage.removeItem('token'); localStorage.removeItem('user')
  }

  return { token, user, login, loadMe, logout }
})
