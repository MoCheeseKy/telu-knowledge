import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/errors";
import { authApi } from "./auth.api";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
} from "./auth.types";

export const authKeys = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

/**
 * Hook query data user saat ini (GET /proxy/auth/me).
 * Jika unauthenticated (401), mengembalikan null tanpa melempar error ataupun memicu redirect login.
 * Memiliki staleTime 5 menit.
 */
export function useMe() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.me,
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        const res = await authApi.me();
        return res?.data?.user ?? null;
      } catch (error) {
        if (isApiError(error) && error.statusCode === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (isApiError(error) && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
    meta: {
      skipAuthRedirect: true,
    },
  });
}

/**
 * Hook mutasi login (BFF /api/auth/login).
 * Pada sukses, mengupdate query cache authKeys.me dengan data user.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      if (res?.data?.user) {
        queryClient.setQueryData(authKeys.me, res.data.user);
      }
    },
  });
}

/**
 * Hook mutasi register (BFF /api/auth/register).
 */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });
}

/**
 * Hook mutasi logout (BFF /api/auth/logout).
 * Membersihkan seluruh TanStack Query cache pada onSettled (berhasil maupun gagal).
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      queryClient.clear();
    },
  });
}

/**
 * Hook mutasi permintaan lupa kata sandi (BFF /api/auth/forgot-password).
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}

/**
 * Hook mutasi kirim ulang email verifikasi (BFF /api/auth/resend-verification).
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      authApi.resendVerification(payload),
  });
}

/**
 * Hook mutasi reset kata sandi dengan recovery token (BFF /api/auth/reset-password).
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
}
