<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mx-auto w-1/3 p-10 mt-16">
      <div class="text-center text-3xl font-bold text-slate-700 mb-5">
        Recover Account.
      </div>
      <div class="text-center">
        <input
          type="password"
          v-model="user.old_password"
          class="p-2 m-2 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Old Password"
        />
      </div>
      <div class="text-center">
        <input
          type="password"
          v-model="user.new_password"
          class="p-2 m-2 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="New Password"
        />
      </div>
      <div class="text-center">
        <input
          type="password"
          v-model="user.new_password_confirm"
          class="p-2 m-2 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Confirm New Password"
        />
      </div>

      <div class="text-center">
        <button
          @click="changePassword"
          class="p-2 m-2 bg-red-700 cursor-pointer font-semibold w-11/12 rounded text-white mt-5"
        >
          Change Password
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
        old_password: "",
        id: useRoute().params.id,
        token: useRoute().params.token,
        new_password: "",
        new_password_confirm: "",
      },
      message: "",
    };
  },
  methods: {
    async changePassword() {
      try {
        if (this.user.new_password == this.user.new_password_confirm) {
          await axios.post("/api/auth/change-password", this.user);
          location.replace("/auth/sign-in");
        } else {
          this.message = "Passwords do not match.";
        }
      } catch (e) {
        this.message = e.response?.data?.message;
      }
    },
  },
};
</script>
