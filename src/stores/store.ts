import { defineStore } from "pinia";

interface User {
  username: string;
  terpmail: string;
  telephone: string;
  standing: string;
  major: string;
  saved_courses: Array<Object>;
  profile_complete: boolean;
}

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: {} as any,
    loggedIn: false,
  }),
  actions: {
    logIn(user: any) {
      this.loggedIn = true;
      this.user = user; 
    },
    logOut() {
      this.loggedIn = false;
      this.user = {} as User;
    },
  },
});
