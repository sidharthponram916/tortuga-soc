<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mx-auto w-1/3 p-5 mt-10">
      <div class="text-center text-3xl font-bold text-slate-700 mb-5">
        Fill your user profile.
        <span class="text-sm font-medium"> (optional)</span>
      </div>
      <div class="text-center">
        <input
          type="text"
          class="p-2 m-2 bg-slate-200 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Username"
          v-model="user.username"
          disabled
        />
      </div>
      <div class="text-center">
        <input
          type="email"
          class="p-2 m-2 bg-slate-200 w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Terpmail"
          v-model="user.terpmail"
          disabled
        />
      </div>

      <div class="text-center">
        <input
          type="text"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Academic Major"
          v-model="user.major"
        />
      </div>
      <div class="text-center">
        <select
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          v-model="user.standing"
        >
          <option value="2024">Enter Graduation Year</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>
      <div class="text-center mt-1">
        <div class="text-left px-4">
          Registration Date and Time<br />
          <span class="text-xs">
            get an email notification on the day of your registration.
          </span>
        </div>
        <input
          type="date"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Academic Major"
          v-model="user.registration_date"
        />
      </div>
      <div class="text-center">
        <input
          type="time"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none border-2 border-slate-400 focus:border-2 focus:border-yellow-500"
          placeholder="Academic Major"
          v-model="user.registration_time"
        />
      </div>
      <div class="text-center">
        <button
          @click="updateProfile"
          class="p-2 m-2 bg-red-700 cursor-pointer font-semibold w-11/12 rounded text-white mt-5"
        >
          Update Profile
        </button>
        <nuxt-link to="/my-tools/dashboard">
          <button
            class="p-2 m-2 bg-slate-700 cursor-pointer font-semibold w-11/12 rounded text-white"
          >
            Exit
          </button>
        </nuxt-link>
      </div>
      <div
        v-if="message != ''"
        class="text-red-500 px-4 text-sm pt-3 text-center"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "~/stores/store.js";

definePageMeta({
  middleware: ["auth"],
});

export default {
  data() {
    return {
      user: {
        username: "",
        terpmail: "",
        password: "",
        registration_date: "",
        registration_time: "",
        major: "",
        standing: "2024",
      },
      message: "",
    };
  },
  mounted() {
    const authStore = useAuthStore();

    if (authStore.user && authStore.user.user) {
      this.user = { ...authStore.user.user };
      if (this.user.major === "Not Set") {
        this.user.major = "";
      }
    } else {
      console.error("authStore.user.user is undefined!");
    }
  },
  methods: {
    async updateProfile() {
      try {
        await axios.put("/api/auth/update", this.user);
        location.replace("/my-tools/dashboard");
      } catch (e) {
        console.log(e.message);
        this.message =
          e.response?.data?.message ||
          "An error occurred while updating your profile.";
      }
    },
  },
};
</script>
