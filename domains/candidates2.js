/**
 * Second batch of domain candidates - more creative and unusual combinations.
 * Focus on less common letters (x, z, q, j, k, v), unusual vowel patterns,
 * and distinctive neologisms less likely to be registered.
 */

const STYLE_A2 = [
  // X-heavy names
  "xentro", "xelvo", "xovra", "xelara", "xomio", "xelyra", "xovio",
  "xantro", "xelio", "xovara", "xenio", "xelvo", "xoryn", "xelto",
  // Z-heavy names
  "zentra", "zelvo", "zovra", "zelara", "zomio", "zelyra", "zovio",
  "zantro", "zelio", "zovara", "zenio", "zoryn", "zelto", "zenvio",
  // Q-heavy names
  "quentra", "qelvo", "qovra", "qelara", "qomio", "qelyra", "qovio",
  "qantro", "qelio", "qovara", "qenio", "qoryn", "qelto", "qenvio",
  // K-heavy names
  "kentro", "kelvo", "kovra", "kelara", "komio", "kelyra", "kovio",
  "kantro", "kelio", "kovara", "kenio", "koryn", "kelto", "kenvio",
  // V-heavy names
  "ventra", "velvo", "vovra", "velara", "vomio", "velyra", "vovio",
  "vantro", "velio", "vovara", "venio", "voryn", "velto", "venvio",
  // J-heavy names
  "jentro", "jelvo", "jovra", "jelara", "jomio", "jelyra", "jovio",
  "jantro", "jelio", "jovara", "jenio", "joryn", "jelto", "jenvio",
  // Mixed unusual
  "zyntra", "zelvo", "zovra", "zelara", "zomio", "zelyra", "zovio",
  "zyxel", "zyvra", "zyara", "zyvio", "zyxor", "zynto", "zyrex",
];

const STYLE_B2 = [
  // Travel freedom with unusual letters
  "roamex", "roamox", "roamux", "roamix", "roamax", "roamex",
  "voyexo", "voyox", "voyux", "voyix", "voyax",
  "wavexo", "waveox", "waveux", "waveix", "waveax",
  "nomado", "nomexo", "nomox", "nomux", "nomix", "nomax",
  "passio", "passexo", "passox", "passux", "passix", "passax",
  "flyexo", "flyox", "flyux", "flyix", "flyax",
  "netexo", "netox", "netux", "netix", "netax",
  "linkexo", "linkox", "linkux", "linkix", "linkax",
  "hubexo", "hubox", "hubux", "hubix", "hubax",
  "goexo", "goox", "goux", "goix", "goax",
  "airexo", "airox", "airux", "airix", "airax",
  "simexo", "simox", "simux", "simix", "simax",
  "spotexo", "spotox", "spotux", "spotix", "spotax",
];

const STYLE_C2 = [
  // Speed action with unusual letters
  "swiftexo", "swiftox", "swiftux", "swiftix", "swiftax",
  "flashexo", "flashox", "flashux", "flashix", "flashax",
  "zoomexo", "zoomox", "zoomux", "zoomix", "zoomax",
  "quicexo", "quicox", "quicux", "quicix", "quicax",
  "blitzo", "blitzexo", "blitzox", "blitzux", "blitzix", "blitzax",
  "rapido", "rapidxo", "rapidox", "rapidux", "rapidix", "rapidaX",
  "veloce", "veloceo", "velocox", "velocux", "velocix", "velocax",
  "viteo", "vitexo", "vitox", "vitux", "vitix", "vitax",
];

const ALL_DOMAINS2 = [...STYLE_A2, ...STYLE_B2, ...STYLE_C2];

const CATEGORY_MAP2 = {};
for (const d of STYLE_A2) CATEGORY_MAP2[d] = "A";
for (const d of STYLE_B2) CATEGORY_MAP2[d] = "B";
for (const d of STYLE_C2) CATEGORY_MAP2[d] = "C";

module.exports = { ALL_DOMAINS2, CATEGORY_MAP2, STYLE_A2, STYLE_B2, STYLE_C2 };
