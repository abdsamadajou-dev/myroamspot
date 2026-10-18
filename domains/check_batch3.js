/**
 * Batch 3: Brandable names with less common suffixes (-ify, -ster, -opia, -aroo, -elle)
 * These are popular in modern brands but may have some availability.
 */

const { execSync } = require("child_process");
const fs = require("fs");

const ROOTS = [
  "roam", "voya", "pass", "wave", "swift", "net", "fly", "orbit",
  "nova", "link", "connect", "spot", "hub", "go", "air", "sim", "nomad",
];

const SUFFIXES = ["ify", "ster", "opia", "aroo", "elle", "ette", "illa", "unga"];

const ALL = [];
const CATEGORY_MAP = {};

// Generate Style A (Modern Tech) - using -ify, -ster
for (const root of ROOTS) {
  const a1 = root + "ify";
  const a2 = root + "ster";
  if (a1.length <= 12) { ALL.push(a1); CATEGORY_MAP[a1] = "A"; }
  if (a2.length <= 12) { ALL.push(a2); CATEGORY_MAP[a2] = "A"; }
}

// Generate Style B (Travel Freedom) - using -opia, -aroo
for (const root of ROOTS) {
  const b1 = root + "opia";
  const b2 = root + "aroo";
  if (b1.length <= 12) { ALL.push(b1); CATEGORY_MAP[b1] = "B"; }
  if (b2.length <= 12) { ALL.push(b2); CATEGORY_MAP[b2] = "B"; }
}

// Generate Style C (Speed Action) - using -elle, -ette, -illa
for (const root of ROOTS) {
  const c1 = root + "elle";
  const c2 = root + "ette";
  if (c1.length <= 12) { ALL.push(c1); CATEGORY_MAP[c1] = "C"; }
  if (c2.length <= 12) { ALL.push(c2); CATEGORY_MAP[c2] = "C"; }
}

// Also add some unique creative ones
const EXTRA = [
  "roamify", "voyify", "passify", "waveify", "swiftify", "netify",
  "flyify", "orbitify", "novify", "linkify", "spotify", "hubify",
  "roamster", "voyaster", "passster", "wavster", "swiftster",
  "netster", "flyster", "orbitster", "novaster", "linkster",
  "spotster", "hubster", "roamopia", "voyopia", "passopia",
  "waveopia", "swiftopia", "netopia", "flyopia", "orbitopia",
  "novopia", "linkopia", "spotopia", "hubopia", "roamaroo",
  "voyaroo", "passaroo", "waveroo", "swiftroo", "netroo", "flyroo",
  "orbitroo", "novaroo", "linkroo", "spotroo", "hubroo",
  "roamelle", "voyelle", "passelle", "waveelle", "swiftelle",
  "netelle", "flyelle", "orbitelle", "novielle", "linkelle",
  "spotelle", "hubelle", "roamette", "voyette", "passette",
  "waveette", "swiftette", "netette", "flyette", "orbitette",
  "noviette", "linkette", "spotette", "hubette",
];

for (const d of EXTRA) {
  if (!ALL.includes(d)) {
    ALL.push(d);
    if (!CATEGORY_MAP[d]) CATEGORY_MAP[d] = "A";
  }
}

// Remove duplicates and sort by category
const UNIQUE = [...new Set(ALL)].filter(d => d.length >= 5 && d.length <= 12);

console.log(`Generated ${UNIQUE.length} unique candidates for batch 3`);

function checkDNS(domain) {
  try {
    const output = execSync(
      `nslookup -type=A ${domain}.com 2>&1`,
      { timeout: 5000, encoding: "utf8" }
    );
    if (output.includes("Addresses:") || output.includes("Address:")) {
      return { hasDNS: true, detail: "has_a_record" };
    }
    if (
      output.includes("Non-existent domain") ||
      output.includes("NXDOMAIN") ||
      output.includes("can't find")
    ) {
      return { hasDNS: false, detail: "nxdomain" };
    }
    if (output.includes("CNAME") || output.includes("canonical name")) {
      return { hasDNS: true, detail: "has_cname" };
    }
    return { hasDNS: true, detail: "unknown_but_responded" };
  } catch (e) {
    if (e.status === 1) {
      const errOut = (e.stderr || "") + (e.stdout || "");
      if (
        errOut.includes("Non-existent domain") ||
        errOut.includes("NXDOMAIN") ||
        errOut.includes("can't find")
      ) {
        return { hasDNS: false, detail: "nxdomain" };
      }
    }
    return { hasDNS: false, detail: "lookup_error" };
  }
}

async function main() {
  console.log(`=== PHASE 1: DNS Resolution Check (Batch 3) ===`);
  console.log(`Checking ${UNIQUE.length} domains...`);
  console.log("");

  const noDNS = [];
  const hasDNS = [];

  for (let i = 0; i < UNIQUE.length; i++) {
    const domain = UNIQUE[i];
    const result = checkDNS(domain);
    const status = result.hasDNS ? "HAS DNS" : "NO DNS  ";
    console.log(
      `  [${i + 1}/${UNIQUE.length}] ${status}  ${domain}.com (${result.detail})`
    );
    if (result.hasDNS) {
      hasDNS.push({ domain, ...result });
    } else {
      noDNS.push({ domain, ...result });
    }
  }

  console.log(`\nPhase 1 Results:`);
  console.log(`  Has DNS (likely registered): ${hasDNS.length}`);
  console.log(`  No DNS (potentially available): ${noDNS.length}`);

  if (noDNS.length === 0) {
    console.log(`\nAll domains have DNS records. Generating more candidates...`);
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        total: UNIQUE.length,
        confirmedAvailable: 0,
        registeredViaDNS: hasDNS.length,
        registeredViaRDAP: 0,
      },
      confirmedAvailable: [],
      registeredViaDNS: hasDNS.map((d) => d.domain + ".com"),
    };
    fs.writeFileSync("availability_results_batch3.json", JSON.stringify(output, null, 2));
    return;
  }

  console.log(`\n=== PHASE 2: Slow RDAP Verification ===`);
  const confirmed = [];
  const stillTaken = [];

  for (let i = 0; i < noDNS.length; i++) {
    const { domain } = noDNS[i];
    console.log(`  [${i + 1}/${noDNS.length}] Checking ${domain}.com via RDAP...`);

    try {
      const url = `https://rdap.org/domain/${domain}.com`;
      const resp = await fetch(url, {
        headers: { "User-Agent": "DomainAvailabilityChecker/1.0" },
      });
      if (resp.status === 404) {
        confirmed.push(domain);
        console.log(`         -> AVAILABLE`);
      } else if (resp.status === 200) {
        stillTaken.push(domain);
        console.log(`         -> REGISTERED`);
      } else {
        console.log(`         -> ${resp.status}`);
      }
    } catch (e) {
      console.log(`         -> ERROR: ${e.message}`);
    }

    if (i < noDNS.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("FINAL RESULTS (Batch 3)");
  console.log("=".repeat(60));
  console.log(`Total: ${UNIQUE.length}`);
  console.log(`Available: ${confirmed.length}`);
  console.log(`Registered (DNS): ${hasDNS.length}`);
  console.log(`Registered (RDAP): ${stillTaken.length}`);

  const output = {
    timestamp: new Date().toISOString(),
    summary: {
      total: UNIQUE.length,
      confirmedAvailable: confirmed.length,
      registeredViaDNS: hasDNS.length,
      registeredViaRDAP: stillTaken.length,
    },
    confirmedAvailable: confirmed.map((d) => ({
      domain: `${d}.com`,
      root: d,
      category: CATEGORY_MAP[d] || "?",
    })),
    registeredViaDNS: hasDNS.map((d) => d.domain + ".com"),
    registeredViaRDAP: stillTaken.map((d) => d.domain + ".com"),
  };

  fs.writeFileSync("availability_results_batch3.json", JSON.stringify(output, null, 2));

  if (confirmed.length > 0) {
    console.log(`\n${"-".repeat(60)}`);
    console.log("CONFIRMED AVAILABLE DOMAINS");
    console.log("-".repeat(60));
    for (const [cat, label] of [
      ["A", "Style A: Modern Tech"],
      ["B", "Style B: Travel Freedom"],
      ["C", "Style C: Speed Action"],
    ]) {
      const catDomains = confirmed.filter((d) => CATEGORY_MAP[d] === cat);
      if (catDomains.length > 0) {
        console.log(`\n${label}:`);
        for (const d of catDomains) {
          console.log(`  + ${d}.com`);
        }
      }
    }
  }
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
