//const s = "api_key46d80f58b7d041103529749aaab663cfmethodtrack.scrobbleartistChertrackBelievetimestamp1772725818196d1a3d4c91688926f24374356863dc" // 7de9a1caf5efa7784537d5866317ffb4
// method=track.scrobble&artist=cher&track=Believe&timestamp=1772725818&api_key=46d80f58b7d041103529749aaab663cf&api_sig=bc54183cd0139560041c9d059af2d24b&sk=6v9xRXzzVvrRvnM6CAIRol3ex6fHPIFL&format=json
import crypto from "crypto";

// bc54183cd0139560041c9d059af2d24b
const sig = [
    "api_key46d80f58b7d041103529749aaab663cf",
    "artistCher",
    "methodtrack.scrobble",
    "sk6v9xRXzzVvrRvnM6CAIRol3ex6fHPIFL",
    "timestamp1772725818",
    "trackBelieve",
    "196d1a3d4c91688926f24374356863dc"
].join('')
const hash = crypto.createHash('md5').update(sig).digest('hex')
console.log(hash)

const artists : string[] = ["Radiohead", "Prince", "Black Sabbath", "Metallica", "Deep Purple", "Iron Maiden", "Ozzy Osbourne", "Death", "Morbid Angel", "Bathory", "Obituary", "Ancient Death"]

const params = [
    ["api_key", "1234567890"],
    ["method", "auth.getSession"],
    ...artists.map((s, i) => [`artist[${i}]`, s]),
];

const data = {
    test: "valeur",
    ...Object.fromEntries(params)
}

console.log(data)
console.log(params)
console.log(buildSig(params, "secret"))


function buildSig(params: string[][], secret: string): string {
    const sig = params.sort()
        .map(([key, value]) => `${key}${value}`)
        .reduce((acc, curr) => `${acc}${curr}`, "") + secret;

    console.log(sig)
    return crypto.createHash('md5').update(sig).digest('hex');
}