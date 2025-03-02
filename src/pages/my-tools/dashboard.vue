<template>
  <div>
    <div class="flex p-10 w-full">
      <div class="flex flex-col">
        <div class="text-3xl font-bold">My Dashboard</div>
        <div class="text-sm">
          This is where you can see what services are available from Tortuga.
        </div>
      </div>
      <div class="p-2 ml-auto text-sm">
        <nuxt-link to="/profile">My Profile</nuxt-link> |
        <button @click="logOut" class="cursor-pointer">Sign Out</button>
      </div>
    </div>
    <div class="m-auto px-6">
      <div class="flex flex-row w-full">
        <div class="p-4 m-4 bg-slate-200 text-2xl rounded font-semibold w-1/3">
          <div class="text-center text-8xl mb-3">
            <font-awesome-icon :icon="['fas', 'eye']" />
          </div>
          <div class="text-center">Personal Watchlist</div>
        </div>
        <div class="p-4 m-4 bg-slate-200 text-2xl font-semibold rounded w-1/3">
          <div class="text-center text-8xl mb-3">
            <font-awesome-icon :icon="['fas', 'bullseye']" />
          </div>
          <div class="text-center">
            Course Sniper <span class="text-xs"> (coming soon) </span>
          </div>
        </div>
        <div class="p-4 m-4 bg-slate-200 text-2xl font-semibold rounded w-1/3">
          <div class="text-center text-8xl mb-3">
            <font-awesome-icon :icon="['fas', 'book']" />
          </div>
          <div class="text-center">
            Degree Assistant <span class="text-xs"> (coming soon) </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

export default {
  methods: {
    async logOut() {
      await axios.post("/api/auth/sign-out", {}, { withCredentials: true });

      const token = useCookie("auth_token");
      token.value = null;

      return navigateTo("/auth/sign-in");
    },
  },
};
</script>
