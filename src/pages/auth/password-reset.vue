<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mx-auto w-1/3 p-10 mt-16">
      <div class="text-center text-3xl font-bold text-slate-700 mb-5">
        Recover Account.
      </div>
      <div class="text-center">
        <input
          type="email"
          v-model="user.terpmail"
          class="p-2 m-2 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Enter your terpmail..."
        />
      </div>

      <div class="text-center">
        <button
          @click="sendPasswordReset"
          class="p-2 m-2 bg-red-700 cursor-pointer font-semibold w-11/12 rounded text-white mt-5"
        >
          Send Reset Email
        </button>
        <a href="/auth/sign-in">
          <button
            class="p-2 m-2 bg-slate-700 cursor-pointer font-semibold w-11/12 rounded text-white"
          >
            Exit
          </button>
        </a>
      </div>
      <div
        v-if="this.message != ''"
        class="text-red-500 px-4 text-sm pt-3 text-center"
      >
        {{ this.message }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        terpmail: "",
      },
      message: "",
    };
  },
  methods: {
    async sendPasswordReset() {
      try {
        await axios.post("/api/auth/send-password-reset", this.user);
        location.replace("/auth/sign-in");
      } catch (e) {
        this.message = e.response?.data?.message;
      }
    },
  },
};
</script>
