<template>
  <div class="bg-gray-100">
    <div class="h-screen flex items-center justify-center">
      <form @submit.prevent="onSubmit" class="bg-white p-8 rounded shadow">
        <h2 class="text-2xl mb-4">CRM Login</h2>
        <input
          v-model="username"
          placeholder="Username"
          required
          class="w-full mb-2 p-2 border rounded"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
        <div class="mt-2">
          <p>可使用帳號manager & agent登入</p>
          <p>密碼皆為123456</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const auth = useAuthStore();
    const router = useRouter();

    async function onSubmit() {
      await auth.login(username.value, password.value);
      router.push({ name: "Dashboard" });
    }

    return { username, password, onSubmit };
  },
};
</script>
