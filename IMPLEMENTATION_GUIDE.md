# 🔧 Implementation Guide - Critical Fixes

## Urgent Actions Required

### 1. Form Validation Setup

#### Step 1: Install Dependencies
```bash
npm install zod @hookform/resolvers react-hot-toast
```

#### Step 2: Create Validation Schemas
**File:** `src/lib/schemas.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email harus valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email harus valid'),
  phone: z.string().regex(/^08\d{8,11}$/, 'Nomor HP tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Password tidak match',
  path: ['passwordConfirm'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

#### Step 3: Update Login Form
**File:** `src/routes/login.tsx`

```typescript
import { z } from 'zod';
import { loginSchema } from '@/lib/schemas';
import { toast } from 'sonner';

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('rina@patungin.id');
  const [password, setPassword] = useState('password');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate input
      const data = loginSchema.parse({ email, password });
      
      // TODO: Call actual API when ready
      // const result = await loginAPI(data);
      
      // For now, mock login
      const role = email.includes('anggota') ? 'anggota' : 'bendahara';
      auth.setSession(role, role === 'bendahara' ? 'Rina Andini' : 'Andi Pratama');
      
      toast.success('Login berhasil!');
      navigate({ to: '/home' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ''])
          )
        );
      } else {
        toast.error('Login gagal, coba lagi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="min-h-full px-6 py-8 gradient-soft">
        {/* ... Logo ... */}
        
        <div className="bg-card rounded-3xl card-shadow-lg p-6">
          <h2 className="text-xl font-extrabold text-foreground">Masuk</h2>
          <p className="text-xs text-muted-foreground mt-1">Lanjutkan ke akunmu</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  type="email"
                  className={`w-full h-12 pl-10 pr-3 rounded-xl border-[1.5px] ${
                    errors.email ? 'border-destructive' : 'border-border focus:border-primary'
                  } focus:outline-none text-sm bg-card`}
                  placeholder="email@kampus.ac.id"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[12px] font-semibold text-foreground">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  type={show ? 'text' : 'password'}
                  className={`w-full h-12 pl-10 pr-10 rounded-xl border-[1.5px] ${
                    errors.password ? 'border-destructive' : 'border-border focus:border-primary'
                  } focus:outline-none text-sm bg-card`}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShow(!show)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <a className="text-xs font-semibold text-primary">Lupa Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-13 py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </PhoneFrame>
  );
}
```

---

### 2. Auth Context Setup

**File:** `src/context/auth-context.tsx`

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Role } from '@/lib/mock';

interface AuthContextType {
  role: Role | null;
  name: string | null;
  isLoading: boolean;
  setSession: (role: Role, name: string) => void;
  clear: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('patungin_role') as Role | null;
      const savedName = localStorage.getItem('patungin_name');
      
      if (savedRole && savedName) {
        setRole(savedRole);
        setName(savedName);
      }
    } catch (e) {
      console.error('Failed to read auth from storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSession = (newRole: Role, newName: string) => {
    try {
      localStorage.setItem('patungin_role', newRole);
      localStorage.setItem('patungin_name', newName);
      setRole(newRole);
      setName(newName);
    } catch (e) {
      console.error('Failed to save auth to storage:', e);
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem('patungin_role');
      localStorage.removeItem('patungin_name');
      setRole(null);
      setName(null);
    } catch (e) {
      console.error('Failed to clear auth from storage:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ role, name, isLoading, setSession, clear }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### 3. LocalStorage Error Handling

**Update File:** `src/components/AppShell.tsx`

```typescript
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PhoneFrame } from './PhoneFrame';
import { BottomNav } from './BottomNav';
import { auth, Role } from '@/lib/mock';

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem('patungin_role') as Role | null;
      if (!r) {
        navigate({ to: '/login' });
        return;
      }
      setRole(r);
    } catch (e) {
      console.error('LocalStorage error:', e);
      setError('Gagal membaca session');
      navigate({ to: '/login' });
    }
  }, [navigate]);

  if (error) {
    return (
      <PhoneFrame>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-destructive font-bold">{error}</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (!role) return null;

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-4">{children}</div>
        {!hideNav && <BottomNav role={role} />}
      </div>
    </PhoneFrame>
  );
}

export function useRole(): Role {
  const [role, setRole] = useState<Role>('bendahara');
  useEffect(() => {
    try {
      const r = auth.getRole();
      setRole(r);
    } catch (e) {
      console.error('Failed to get role:', e);
      setRole('bendahara');
    }
  }, []);
  return role;
}
```

---

### 4. Copy to Clipboard Helper

**File:** `src/lib/clipboard.ts`

```typescript
import { toast } from 'sonner';

export async function copyToClipboard(text: string, message?: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message || 'Disalin ke clipboard!');
  } catch (error) {
    console.error('Failed to copy:', error);
    toast.error('Gagal copy ke clipboard');
  }
}
```

**Usage in Component:**

```typescript
import { copyToClipboard } from '@/lib/clipboard';

function GroupCodeButton() {
  return (
    <button 
      onClick={() => copyToClipboard(group.code, 'Kode grup disalin!')}
      className="w-9 h-9 rounded-xl bg-card border border-border grid place-items-center"
    >
      <Copy className="w-4 h-4 text-primary" />
    </button>
  );
}
```

---

### 5. Environment Variables

**Create File:** `.env.example`

```bash
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_MOCKS=true
VITE_DEBUG_MODE=false

# Environment
VITE_ENVIRONMENT=development
```

**Create File:** `.env.local`

```bash
# Development environment
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MOCKS=true
VITE_DEBUG_MODE=true
VITE_ENVIRONMENT=development
```

**Usage in Code:**

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';
```

---

## Quick Wins (Easy Fixes)

### 1. Fix Register Form Validation

```typescript
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Email tidak valid');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Password tidak match');
      return;
    }

    // Continue with registration
    auth.setSession('anggota', formData.name);
    navigate({ to: '/join-grup' });
  };

  return (
    // Form JSX with formData state binding
  );
}
```

---

## API Integration Template (For Future)

**File:** `src/lib/api-client.ts`

```typescript
import { API_URL } from '@/lib/config';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  // Add PUT, DELETE, PATCH methods...
}

export const apiClient = new APIClient(API_URL);
```

---

**Next:** Review AUDIT_REPORT.md for full details and implement fixes in priority order.
