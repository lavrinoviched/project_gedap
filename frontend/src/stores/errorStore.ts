import { defineStore } from 'pinia';

type ErrorDetails = 
  | Record<string, unknown>
  | unknown[]
  | string
  | Error
  | null
  | undefined; // Добавлен undefined как допустимый тип

interface ErrorState {
  title: string | null;
  message: string | null;
  details: ErrorDetails;
  timestamp: number | null;
  code: string | null;
  isCritical: boolean;
}

interface SetErrorOptions {
  title: string;
  message: string;
  details?: ErrorDetails;
  code?: string;
  isCritical?: boolean;
}

export const useErrorStore = defineStore('error', {
  state: (): ErrorState => ({
    title: null,
    message: null,
    details: null,
    timestamp: null,
    code: null,
    isCritical: false
  }),

  getters: {
    fullMessage(state): string {
      const parts = [];
      if (state.title) parts.push(state.title);
      if (state.message) parts.push(state.message);
      if (state.code) parts.push(`(Код: ${state.code})`);
      return parts.join(': ');
    },
    hasError(state): boolean {
      return !!state.title || !!state.message;
    },
    formattedDate(state): string | null {
      return state.timestamp 
        ? new Date(state.timestamp).toLocaleString() 
        : null;
    }
  },

  actions: {
    setError(options: SetErrorOptions): void {
      this.title = options.title;
      this.message = options.message;
      this.details = options.details ?? null;
      this.code = options.code ?? null;
      this.isCritical = options.isCritical ?? false;
      this.timestamp = Date.now();
      this._logError();
    },

    setErrorFromError(error: Error, title = 'Произошла ошибка'): void {
      this.setError({
        title,
        message: error.message,
        details: error.stack || error,
        isCritical: true
      });
    },

    handleError(error: unknown, defaultMessage = 'Произошла неизвестная ошибка'): string {
      if (error instanceof Error) {
        this.setErrorFromError(error);
        return error.message;
      }

      if (typeof error === 'string') {
        this.setError({
          title: 'Ошибка',
          message: error,
          isCritical: false
        });
        return error;
      }

      // Явное преобразование типа
      const details: ErrorDetails = (() => {
        if (error === undefined || error === null) return null;
        if (typeof error === 'object' || Array.isArray(error)) return error as Record<string, unknown> | unknown[];
        return String(error);
      })();

      this.setError({
        title: 'Ошибка',
        message: defaultMessage,
        details,
        isCritical: false
      });
      
      return defaultMessage;
    },

    _logError(): void {
      console.error(`[${this.isCritical ? 'CRITICAL' : 'ERROR'}] ${this.fullMessage}`, {
        details: this.details,
        timestamp: this.formattedDate,
        code: this.code
      });
    },

    clearError(): void {
      this.$reset();
    }
  }
});

export type ErrorStore = ReturnType<typeof useErrorStore>;