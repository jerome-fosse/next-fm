import {logger} from "@/app/lib/utils/logger";

export function secondsToDisplayTime(seconds: number): string {
    return new Date(seconds * 1000).toISOString()
        .slice(11, 19)
        .split(':')
        .filter((s, i) => !(s === '00' && i === 0))
        .join(':');
}

export function displayTimeToSeconds(time: string): number {
    try {
        return time.split(':')
            .reverse()
            .map((s, i) => parseInt(s) * (60 ** i))
            .reduce((a, b) => a + b);
    } catch {
        logger.error(`Erreur de conversion. ${time} n'est pas un temps valide.`);
        return 0;
    }
}
