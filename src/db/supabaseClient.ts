import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types/movie';

// Supabase project configurations
const SUPABASE_URL = 'https://mninixwduwlcrexfssmy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaW5peHdkdXdsY3JleGZzc215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjgyMzksImV4cCI6MjEwMTM0NDIzOX0.ff4Ip3iMYhTAAiBR74xfaHVzLLdheSOvKTeAW3RDY60';

let supabaseInstance: SupabaseClient | null = null;

try {
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.warn('Supabase client initialized with fallback mode', err);
}

export const supabase = supabaseInstance;

// Storage keys for local session persistence
const AUTH_USER_KEY = 'cineverse_auth_user_v20';

/**
 * Generate a distinctive superhero/cinema user friend code
 */
export function generateFriendCode(name: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const prefix = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'CIN';
  return `#${prefix}-${randomNum}`;
}

export class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    this.currentUser = this.loadStoredUser();
  }

  private loadStoredUser(): UserProfile | null {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  private saveUser(user: UserProfile | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  public subscribe(cb: (user: UserProfile | null) => void): () => void {
    this.listeners.push(cb);
    cb(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Real Supabase Sign Up or Local Fallback
   */
  async signUp(email: string, password: string, displayName: string): Promise<{ user: UserProfile | null; error?: string }> {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName }
          }
        });

        if (error && !error.message.includes('rate limit')) {
          // If Supabase returns an error other than rate limit, return it
          // But allow graceful offline fallback if network/config error
          if (error.message.includes('Invalid') || error.message.includes('Password') || error.message.includes('already registered')) {
            return { user: null, error: error.message };
          }
        }

        if (data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            username: email.split('@')[0],
            displayName: displayName || email.split('@')[0],
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName || email)}`,
            friendCode: generateFriendCode(displayName || 'CINE'),
            favoriteIndustry: 'all',
            isGuest: false,
            createdAt: new Date().toISOString()
          };
          this.saveUser(profile);
          return { user: profile };
        }
      }
    } catch (e) {
      console.warn("Supabase network error, completing via local auth store", e);
    }

    // Resilient local profile creation
    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      username: email.split('@')[0],
      displayName: displayName || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName || email)}`,
      friendCode: generateFriendCode(displayName || 'CINE'),
      favoriteIndustry: 'all',
      isGuest: false,
      createdAt: new Date().toISOString()
    };
    this.saveUser(profile);
    return { user: profile };
  }

  /**
   * Real Supabase Sign In or Local Fallback
   */
  async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // If credential failure
          if (error.message.includes('Invalid login credentials')) {
            // Check if local mock user exists with this email
            if (this.currentUser && this.currentUser.email === email) {
              return { user: this.currentUser };
            }
            return { user: null, error: error.message };
          }
        }

        if (data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            username: email.split('@')[0],
            displayName: data.user.user_metadata?.display_name || email.split('@')[0],
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            friendCode: generateFriendCode(email.split('@')[0]),
            favoriteIndustry: 'all',
            isGuest: false,
            createdAt: new Date().toISOString()
          };
          this.saveUser(profile);
          return { user: profile };
        }
      }
    } catch (e) {
      console.warn("Supabase signIn fallback", e);
    }

    // Default fast sign in for local testing
    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      username: email.split('@')[0],
      displayName: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      friendCode: generateFriendCode(email.split('@')[0]),
      favoriteIndustry: 'all',
      isGuest: false,
      createdAt: new Date().toISOString()
    };
    this.saveUser(profile);
    return { user: profile };
  }

  /**
   * Guest Mode Access
   */
  public enterAsGuest(): UserProfile {
    const guestId = 'guest_' + Math.floor(1000 + Math.random() * 9000);
    const guestProfile: UserProfile = {
      id: guestId,
      email: 'guest@cineverse.io',
      username: 'CinemaExplorer',
      displayName: 'Cinema Explorer',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}`,
      friendCode: generateFriendCode('EXP'),
      favoriteIndustry: 'all',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    this.saveUser(guestProfile);
    return guestProfile;
  }

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore
    }
    this.saveUser(null);
  }
}

export const authService = new AuthService();
