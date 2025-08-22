import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface IAuthState {
    user: User | null;
    setUser: (user: User | null) => void;
}

const useAuthStore = create<IAuthState>()(set => ({
    user: null,
    setUser: user =>
        set(state => ({
            ...state,
            user
        }))
}));

export default useAuthStore;
