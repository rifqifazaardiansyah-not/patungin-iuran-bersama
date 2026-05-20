import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .min(1, "Password harus diisi"),
});

export const registerSchema = z
  .object({
    role: z.enum(["bendahara", "anggota"], {
      errorMap: () => ({ message: "Peran harus dipilih" }),
    }),
    name: z
      .string()
      .min(1, "Nama harus diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    email: z
      .string()
      .min(1, "Email harus diisi")
      .email("Format email tidak valid")
      .transform((val) => val.toLowerCase()),
    phone: z
      .string()
      .min(1, "Nomor HP harus diisi")
      .regex(/^(\+62|0)[0-9]{9,12}$/, "Format nomor HP tidak valid"),
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(6, "Password minimal 6 karakter"),
    passwordConfirm: z
      .string()
      .min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password tidak cocok",
    path: ["passwordConfirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export function validateForm<T>(schema: z.Schema<T>, data: unknown) {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, data: null, errors };
    }
    return {
      success: false,
      data: null,
      errors: { general: "Validasi gagal" },
    };
  }
}
