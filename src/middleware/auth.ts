import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/store.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Access the cookie value
  try {
    let { data, error } = await useFetch("/api/auth/verify", {
      credentials: "include",
    });


    if (
      error.value &&
      (to.path.startsWith("/my-tools") || to.path == "/profile")
    ) {
      return navigateTo("/auth/sign-in");
    } else if (!error.value) {
      let authStore = useAuthStore();
      authStore.logIn(data);

      console.log("logged in!"); 
      return;
    }

    return;
  } catch (e) {
    return navigateTo("/auth/sign-in");
  }
});
