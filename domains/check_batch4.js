/**
 * Batch 4: Longer, more distinctive names (8-12 chars) with unusual patterns.
 * Using consonant clusters, less common vowel patterns, and distinctive endings.
 */

const { execSync } = require("child_process");
const fs = require("fs");

// Style A: Modern Tech - distinctive neologisms
const STYLE_A4 = [
  "thorva", "thrino", "thryza", "phloxo", "phrena", "chryso",
  "shyro", "shyra", "shylo", "bryzo", "bryza", "brylo",
  "dryno", "dryza", "fryno", "fryza", "grypho", "gryza",
  "hylo", "hyra", "hylo", "kryno", "kryza", "krylo",
  "lyrio", "lyra", "lyrio", "myrio", "myra", "myrio",
  "nyxio", "nyra", "nyxio", "pyrio", "pyra", "pyrio",
  "ryzio", "ryza", "ryzio", "syrio", "syra", "syrio",
  "tyrio", "tyra", "tyrio", "wyrio", "wyra", "wyrio",
  "xyrio", "xyra", "xyrio", "zyrio", "zyra", "zyrio",
];

// Style B: Travel Freedom - longer distinctive names
const STYLE_B4 = [
  "roambar", "roamfyr", "roamkyr", "roamphy", "roamtho",
  "voyabar", "voyafyr", "voyakyr", "voyaphy", "voyatho",
  "passbar", "passfyr", "passkyr", "passphy", "passtho",
  "wavebar", "wavefyr", "wavekyr", "wavephy", "wavetho",
  "swiftbar", "swiftfyr", "swiftkyr", "swiftphy", "swifttho",
  "netbar", "netfyr", "netkyr", "netphy", "nettho",
  "flybar", "flyfyr", "flykyr", "flyphy", "flytho",
  "orbitbar", "orbitfyr", "orbitkyr", "orbitphy", "orbittho",
  "novabar", "novafyr", "novakyr", "novaphy", "novatho",
  "linkbar", "linkfyr", "linkkyr", "linkphy", "linktho",
  "spotbar", "spotfyr", "spotkyr", "spotphy", "spottho",
  "hubbar", "hubfyr", "hubkyr", "hubphy", "hubtho",
  "gobar", "gofyr", "gokyr", "gophy", "gotho",
  "airbar", "airfyr", "airkyr", "airphy", "airtho",
  "simbar", "simfyr", "simkyr", "simphy", "simtho",
  "nomadbar", "nomadfyr", "nomadkyr", "nomadphy", "nomadtho",
];

// Style C: Speed Action - longer distinctive names
const STYLE_C4 = [
  "swiftbar", "swiftfyr", "swiftkyr", "swiftphy", "swifttho",
  "flashbar", "flashfyr", "flashkyr", "flashphy", "flashtho",
  "zoombar", "zoomfyr", "zoomkyr", "zoomphy", "zoomtho",
  "quickbar", "quickfyr", "quickkyr", "quickphy", "quicktho",
  "rapidbar", "rapidfyr", "rapidkyr", "rapidphy", "rapidtho",
  "velobar", "velofyr", "velokyr", "velophy", "velotho",
  "vitbar", "vitfyr", "vitkyr", "vitphy", "vittho",
  "blitzbar", "blitzfyr", "blitzkyr", "blitzphy", "blitztho",
  "boltbar", "boltfyr", "boltkyr", "boltphy", "bolttho",
  "dartbar", "dartfyr", "dartkyr", "dartphy", "darttho",
  "rushbar", "rushfyr", "rushkyr", "rushphy", "rushtHo",
  "dashbar", "dashfyr", "dashkyr", "dashphy", "dashtho",
];

const ALL = [...STYLE_A4, ...STYLE_B4, ...STYLE_C4];
const CATEGORY_MAP = {};
for (const d of STYLE_A4) CATEGORY_MAP[d] = "A";
for (const d of STYLE_B4) CATEGORY_MAP[d] = "B";
for (const d of STYLE_C4) CATEGORY_MAP[d] = "C";

const UNIQUE = [...new Set(ALL)].filter(d => d.length >= 5 && d.length <= 12);

console.log(`Generated ${UNIQUE.length} unique candidates for batch 4`);

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
  console.log(`=== PHASE 1: DNS Resolution Check (Batch 4) ===`);
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
    console.log(`\nAll domains have DNS records.`);
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        total: UNIQUE.length,
        confirmedAvailable: 0,
        registeredViaDNS: hasDNS.length,
      },
      confirmedAvailable: [],
      registeredViaDNS: hasDNS.map((d) => d.domain + ".com"),
    };
    fs.writeFileSync("availability_results_batch4.json", JSON.stringify(output, null, 2));
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
  console.log("FINAL RESULTS (Batch 4)");
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

  fs.writeFileSync("availability_results_batch4.json", JSON.stringify(output, null, 2));

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
