import {LastFmScrobbleResponse} from "@/app/lib/data/http/lastfm";
import {ScrobbleReport} from "@/app/types/scrobble";

export function lastfmScrobbleResponseToScrobbleReport(lfmsr: LastFmScrobbleResponse): ScrobbleReport {
    return {
        accepted: lfmsr.lfm.scrobbles.accepted,
        ignored: lfmsr.lfm.scrobbles.ignored,
        scrobbles: lfmsr.lfm.scrobbles.scrobble
            //.filter(s => s.ignoredMessage.code !== 0)
            .map(scrobble => ({
                track: scrobble.track["#text"],
                artist: scrobble.artist["#text"],
                code: scrobble.ignoredMessage.code,
                message: ignoredReasonMessage(scrobble.ignoredMessage.code),
            }))
    };
}

function ignoredReasonMessage(code: number) {
    switch (code) {
        case 0:
            return "OK";
        case 1:
            return "Artist was ignored";
        case 2:
            return "Track was ignored";
        case 3:
            return "Timestamp was too old";
        case 4:
            return "Timestamp was too new";
        case 5:
            return "Daily scrobble limit exceeded";
        default:
            return "Unknown reason";
    }
}
