/**
 * Properti untuk komponen tampilan fallback error boundary.
 */
export interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}
