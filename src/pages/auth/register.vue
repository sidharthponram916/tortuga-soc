<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mx-auto w-1/3 p-10 mt-16">
      <div class="text-center text-3xl font-bold text-slate-700 mb-5">
        Join <span class="text-yellow-600">Tortuga</span> today.
      </div>
      <div class="text-center">
        <input
          type="text"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Username"
          v-model="user.username"
        />
      </div>
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
          @click="register"
          class="p-2 m-2 bg-red-700 cursor-pointer font-semibold w-11/12 rounded text-white mt-5"
        >
          Sign Up
        </button>
      </div>
      <div
        v-if="this.message != ''"
        class="text-red-500 px-4 text-sm pt-3 text-center"
      >
        {{ this.message }}
      </div>
      <div class="px-4 pt-5 text-sm text-center">
        By making an account, you confirm that you have read our
        <nuxt-link class="text-blue-600 font-semibold" to="/auth/password-reset"
          >privacy policy</nuxt-link
        >.
      </div>
      <div class="px-4 pt-3 text-sm text-center">
        Already have an account? Click here to
        <nuxt-link class="text-blue-600 font-semibold" to="/auth/sign-in"
          >sign in</nuxt-link
        >.
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "~/stores/store.js";

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
    async register() {
      try {
        if (this.user.username && this.user.terpmail && this.user.password) {
          if (!this.user.terpmail.endsWith("umd.edu")) {
            this.message = "Please choose a valid UMD email address.";
          } else {
            let { data } = await axios.post(`/api/auth/create`, {
              username: this.user.username,
              terpmail: this.user.terpmail,
              password: this.user.password,
            });

            if (data.message) {
              this.message = data.message;
            } else {
              const authStore = useAuthStore();
              authStore.logIn(data);

              location.replace("/profile");
            }
          }
        } else {
          this.message = "Please fill out all fields.";
        }
      } catch (e) {
        this.message = e.response?.data?.message;
      }
    },
  },
};
</script>
