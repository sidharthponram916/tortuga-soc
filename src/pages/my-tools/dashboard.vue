<template>
  <div>
    <div class="flex px-10 pt-10 w-full">
      <div class="flex flex-col">
        <div class="text-3xl font-bold">My Dashboard</div>
        <div class="text-sm pt-1">
          This is where you can see what services are available from Tortuga.
          Select a service to start using the product!
        </div>
      </div>
      <div class="p-2 ml-auto text-sm">
        <nuxt-link to="/profile">My Profile</nuxt-link> |
        <button @click="logOut" class="cursor-pointer">Sign Out</button>
      </div>
    </div>
    <div class="m-auto px-6">
      <div
        class="sm:flex w-full bg-slate-100 sm:bg-transparent p-1 sm:p-0 mt-3 sm:mt-0 rounded-[10px]"
      >
        <nuxt-link
          to="/my-tools/watchlist"
          class="p-4 m-4 sm:bg-slate-100 hover:bg-slate-200 text-2xl rounded font-semibold sm:w-1/3"
        >
          <div class="border-b-2 border-slate-300 sm:border-b-0">
            <div class="text-center text-8xl mb-3">
              <font-awesome-icon :icon="['fas', 'eye']" />
            </div>
            <div class="text-center">Course Watcher</div>
            <div class="text-center text-sm font-light mt-2 mb-5 sm:mb-0">
              Get periodic email or SMS updates on the seat status of your
              bookmarked sections.
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          to="/my-tools/slingshot"
          class="p-4 m-4 sm:bg-slate-100 hover:bg-slate-200 text-2xl rounded font-semibold sm:w-1/3"
        >
          <div class="border-b-2 border-slate-300 sm:border-b-0">
            <div class="text-center text-8xl mb-3">
              <font-awesome-icon :icon="['fas', 'crosshairs']" />
            </div>
            <div class="text-center">Section Slingshot</div>
            <div class="text-center text-sm font-light mt-2 mb-5 sm:mb-0">
              No more waitlist check-ins, be the first to be notified of any
              openings of desired closed courses.
            </div>
          </div>
        </nuxt-link>
        <div
          class="p-4 m-4 sm:bg-slate-300 text-2xl font-semibold rounded sm:w-1/3"
        >
          <div class="text-center text-8xl mb-3">
            <font-awesome-icon :icon="['fas', 'book']" />
          </div>
          <div class="text-center">Schedule Builder</div>
          <div class="text-center text-sm font-light mt-2">
            Autogenerate an effective schedule, catered to your needs.
            <span class="text-xs"> (coming soon) </span>
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

      useAuthStore().logOut();

      location.replace("/auth/sign-in");
    },
  },
};
</script>
