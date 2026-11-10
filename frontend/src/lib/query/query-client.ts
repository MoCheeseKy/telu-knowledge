import {
  QueryClient,
  QueryCache,
  MutationCache,
  isServer,
} from "@tanstack/react-query";
import { isApiError } from "@/lib/api/errors";
import { PUBLIC_AUTH_PATHS } from "@/lib/constants";

function handleUnauthorized(): void {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  const isAuthPage = PUBLIC_AUTH_PATHS.some((path) =>
    currentPath.startsWith(path)
  );

  if (!isAuthPage) {
    const nextParam = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/login?next=${nextParam}`;
  }
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.skipAuthRedirect) {
          return;
        }
        if (isApiError(error) && error.statusCode === 401) {
          handleUnauthorized();
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.skipAuthRedirect) {
          return;
        }
        if (isApiError(error) && error.statusCode === 401) {
          handleUnauthorized();
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 detik
        retry: (failureCount, error) => {
          // Jangan retry untuk error HTTP 4xx
          if (
            isApiError(error) &&
            error.statusCode >= 400 &&
            error.statusCode < 500
          ) {
            return false;
          }
          // Maksimal 2 kali retry untuk error lainnya
          return failureCount < 2;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          if (
            isApiError(error) &&
            error.statusCode >= 400 &&
            error.statusCode < 500
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: selalu buat instance baru per request
    return makeQueryClient();
  }

  // Browser: singleton instance
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
