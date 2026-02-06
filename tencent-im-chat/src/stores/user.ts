import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const loginConfig = ref<{
    SDKAppID: number;
    userID: string;
    userSig: string;
  } | null>(null);

  function setUser(user: User) {
    currentUser.value = user;
  }

  function setLoginConfig(config: {
    SDKAppID: number;
    userID: string;
    userSig: string;
  }) {
    loginConfig.value = config;
  }

  function clearUser() {
    currentUser.value = null;
    loginConfig.value = null;
  }

  return {
    currentUser,
    loginConfig,
    setUser,
    setLoginConfig,
    clearUser,
  };
});
