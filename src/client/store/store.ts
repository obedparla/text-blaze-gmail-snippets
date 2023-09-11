import { create } from "zustand";

interface UserStore {
  email: string | null;
  name: string | null;
  isLoggedIn: boolean;
}

const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  email: null,
  name: null,
}));
