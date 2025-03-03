<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mx-auto w-1/3 p-10 mt-16">
      <div class="text-center text-3xl font-bold text-slate-700 mb-5">Sign in to <span class = 'text-yellow-600'>Tortuga</span>.</div>
      <div class="text-center">
        <input
          type="email"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Terpmail"
          v-model="user.terpmail"
        />
      </div>
      <div class="text-center">
        <input
          type="password"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Password"
          v-model="user.password"
        />
      </div>
      <div class="text-center">
        <button
          @click="authenticate"
          class="p-2 m-2 bg-red-700 cursor-pointer font-semibold w-11/12 rounded text-white mt-5"
        >
          Sign In
        </button>
      </div>
      <div
        v-if="message != ''"
        class="text-red-500 px-4 text-sm pt-3 text-center"
      >
        {{ message }}
      </div>
      <div class="px-4 pt-5 text-sm text-center">
        Forgot your password? Click here for a
        <nuxt-link class="text-blue-600 font-semibold" to="/auth/password-reset"
          >password reset</nuxt-link
        >.
      </div>
      <div class="px-4 pt-3 text-sm text-center">
        Don't have an account? Click here to
        <nuxt-link class="text-blue-600 font-semibold" to="/auth/register"
          >sign up</nuxt-link
        >.
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "~/stores/store.js";

definePageMeta({
  middleware: ["sign-in"],
});

export default {
  data() {
    return {
      user: {
        username: "",
        terpmail: "",
        password: "",
      },
      message: "",
    };
  },
  mounted() {},
  methods: {
    async authenticate() {
      try {
        if (!this.user.terpmail || !this.user.password) {
          this.message = "Please fill out all fields.";
        } else {
          let user = await axios.post(`/api/auth/sign-in`, {
            terpmail: this.user.terpmail,
            password: this.user.password,
          });

          const authStore = useAuthStore();
          authStore.logIn(user);

          location.replace("/my-tools/dashboard");
        }
      } catch (e) {
        this.message = e.response?.data?.message;
      }
    },
  },
};
</script>
