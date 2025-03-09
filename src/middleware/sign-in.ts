import { useAuthStore } from "~/stores/store.js";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth_token");

  if (token.value) {
    return navigateTo("/my-tools/dashboard");
  }
});
