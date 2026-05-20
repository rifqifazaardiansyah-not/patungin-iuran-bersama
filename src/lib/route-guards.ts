import { redirect } from "@tanstack/react-router";

/**
 * Route guard untuk melindungi routes yang memerlukan autentikasi
 * Pastikan AuthProvider sudah di-setup di root route
 */
export function createProtectedRouteGuard() {
  return async () => {
    try {
      const role = localStorage.getItem("patungin_role");
      const name = localStorage.getItem("patungin_name");

      if (!role || !name) {
        throw redirect({ to: "/login" });
      }

      // Validate role
      if (role !== "bendahara" && role !== "anggota") {
        localStorage.removeItem("patungin_role");
        localStorage.removeItem("patungin_name");
        throw redirect({ to: "/login" });
      }

      return { role, name };
    } catch (error) {
      if (error instanceof redirect) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  };
}

/**
 * Route guard untuk melindungi routes khusus bendahara
 */
export function createBendaharaOnlyGuard() {
  return async () => {
    try {
      const role = localStorage.getItem("patungin_role");
      const name = localStorage.getItem("patungin_name");

      if (!role || !name) {
        throw redirect({ to: "/login" });
      }

      if (role !== "bendahara") {
        throw redirect({ to: "/home" });
      }

      return { role, name };
    } catch (error) {
      if (error instanceof redirect) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  };
}

/**
 * Route guard untuk melindungi routes khusus anggota
 */
export function createAnggotaOnlyGuard() {
  return async () => {
    try {
      const role = localStorage.getItem("patungin_role");
      const name = localStorage.getItem("patungin_name");

      if (!role || !name) {
        throw redirect({ to: "/login" });
      }

      if (role !== "anggota") {
        throw redirect({ to: "/home" });
      }

      return { role, name };
    } catch (error) {
      if (error instanceof redirect) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  };
}

/**
 * Route guard untuk memastikan user tidak login, redirect ke home jika sudah login
 */
export function createPublicOnlyGuard() {
  return async () => {
    try {
      const role = localStorage.getItem("patungin_role");
      const name = localStorage.getItem("patungin_name");

      if (role && name && (role === "bendahara" || role === "anggota")) {
        throw redirect({ to: "/home" });
      }

      return {};
    } catch (error) {
      if (error instanceof redirect) {
        throw error;
      }
      return {};
    }
  };
}
