import pc from "picocolors";

export interface Logger {
    debug: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
}

const isServer = typeof window === 'undefined';

class ConsoleLogger implements Logger {
    debug(...args: unknown[]): void {
        if (process.env.NODE_ENV === 'development') {
            if (isServer) {
                console.log(pc.blue(pc.bold('[DEBUG]')), ...args);
            } else {
                console.log('%c[DEBUG]', 'color: #3B82F6; font-weight: bold', ...args);
            }
        }
    }

    info(...args: unknown[]): void {
        if (isServer) {
            console.log(pc.green(pc.bold('[INFO]')), ...args);
        } else {
            console.log('%c[INFO]', 'color: #11D128; font-weight: bold', ...args);
        }
    }

    warn(...args: unknown[]): void {
        if (isServer) {
            console.log(pc.yellow(pc.bold('[WARN]')), ...args);
        } else {
            console.log('%c[WARN]', 'color: #F59E0B; font-weight: bold', ...args);
        }
    }

    error(...args: unknown[]): void {
        if (isServer) {
            console.error(pc.red(pc.bold('[ERROR]')), ...args);
        } else {
            console.log('%c[ERROR]', 'color: #CC0E0E; font-weight: bold', ...args);
        }
    }
}

export const logger: Logger = new ConsoleLogger();