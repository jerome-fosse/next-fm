export interface Logger {
    debug: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
}

class ConsoleLogger implements Logger {
    debug(...args: unknown[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.log('%c[DEBUG]', 'color: #3B82F6; font-weight: bold', ...args);
        }
    }

    info(...args: unknown[]): void {
        console.log('%c[INFO]', 'color: #11D128; font-weight: bold', ...args);
    }

    warn(...args: unknown[]): void {
        console.log('%c[WARN]', 'color: #F59E0B; font-weight: bold', ...args);
    }

    error(...args: unknown[]): void {
        console.log('%c[ERROR]', 'color: #CC0E0E; font-weight: bold', ...args);
    }
}

export const logger: Logger = new ConsoleLogger();