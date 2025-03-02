import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from '~/stores/store.js'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Access the cookie value
  try {
    let { data, error } = await useFetch("/api/auth/verify", {
      credentials: "include",
    });

    if (error.value) {
      return navigateTo("/auth/sign-in");
    }

    let authStore = useAuthStore(); 

    authStore.logIn(data); 
    return;
  } catch (e) {
    return navigateTo("/auth/sign-in");
  }
});
