/**
 * Two-phase domain availability checker for batch 2:
 * Phase 1: DNS lookup (fast) - filter out registered domains
 * Phase 2: Slow RDAP verification for domains with no DNS records
 */

const { execSync } = require("child_process");
const fs = require("fs");

const STYLE_A2 = [
  "xentro", "xelvo", "xovra", "xelara", "xomio", "xelyra", "xovio",
  "xantro", "xelio", "xovara", "xenio", "xelvo", "xoryn", "xelto",
  "zentra", "zelvo", "zovra", "zelara", "zomio", "zelyra", "zovio",
  "zantro", "zelio", "zovara", "zenio", "zoryn", "zelto", "zenvio",
  "quentra", "qelvo", "qovra", "qelara", "qomio", "qelyra", "qovio",
  "qantro", "qelio", "qovara", "qenio", "qoryn", "qelto", "qenvio",
  "kentro", "kelvo", "kovra", "kelara", "komio", "kelyra", "kovio",
  "kantro", "kelio", "kovara", "kenio", "koryn", "kelto", "kenvio",
  "ventra", "velvo", "vovra", "velara", "vomio", "velyra", "vovio",
  "vantro", "velio", "vovara", "venio", "voryn", "velto", "venvio",
  "jentro", "jelvo", "jovra", "jelara", "jomio", "jelyra", "jovio",
  "jantro", "jelio", "jovara", "jenio", "joryn", "jelto", "jenvio",
  "zyntra", "zelvo", "zovra", "zelara", "zomio", "zelyra", "zovio",
  "zyxel", "zyvra", "zyara", "zyvio", "zyxor", "zynto", "zyrex",
];

const STYLE_B2 = [
  "roamex", "roamox", "roamux", "roamix", "roamax",
  "voyexo", "voyox", "voyux", "voyix", "voyax",
  "wavexo", "waveox", "waveux", "waveix", "waveax",
  "nomexo", "nomox", "nomux", "nomix", "nomax",
  "passexo", "passox", "passux", "passix", "passax",
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
  "swiftexo", "swiftox", "swiftux", "swiftix", "swiftax",
  "flashexo", "flashox", "flashux", "flashix", "flashax",
  "zoomexo", "zoomox", "zoomux", "zoomix", "zoomax",
  "quicexo", "quicox", "quicux", "quicix", "quicax",
  "blitzo", "blitzexo", "blitzox", "blitzux", "blitzix", "blitzax",
  "rapido", "rapidxo", "rapidox", "rapidux", "rapidix", "rapidax",
  "veloce", "veloceo", "velocox", "velocux", "velocix", "velocax",
  "viteo", "vitexo", "vitox", "vitux", "vitix", "vitax",
];

const ALL_DOMAINS = [...STYLE_A2, ...STYLE_B2, ...STYLE_C2];

const CATEGORY_MAP = {};
for (const d of STYLE_A2) CATEGORY_MAP[d] = "A";
for (const d of STYLE_B2) CATEGORY_MAP[d] = "B";
for (const d of STYLE_C2) CATEGORY_MAP[d] = "C";

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

async function checkRDAP(domain) {
  const url = `https://rdap.org/domain/${domain}.com`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch(url, {
      headers: {
        "User-Agent": "DomainAvailabilityChecker/1.0",
        Accept: "application/rdap+json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (resp.status === 200) {
      return { status: "registered", available: false };
    } else if (resp.status === 404) {
      return { status: "available", available: true };
    } else if (resp.status === 429) {
      return { status: "rate_limited", available: false };
    }
    return { status: `http_${resp.status}`, available: false };
  } catch (e) {
    return { status: "error", available: false, error: e.message };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`=== PHASE 1: DNS Resolution Check (Batch 2) ===`);
  console.log(`Checking ${ALL_DOMAINS.length} domains for existing DNS records...`);
  console.log("");

  const noDNS = [];
  const hasDNS = [];

  for (let i = 0; i < ALL_DOMAINS.length; i++) {
    const domain = ALL_DOMAINS[i];
    const result = checkDNS(domain);
    const status = result.hasDNS ? "HAS DNS" : "NO DNS  ";
    console.log(
      `  [${i + 1}/${ALL_DOMAINS.length}] ${status}  ${domain}.com (${result.detail})`
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
    console.log(`\nAll domains have DNS records. No further verification needed.`);
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        total: ALL_DOMAINS.length,
        confirmedAvailable: 0,
        registeredViaDNS: hasDNS.length,
        registeredViaRDAP: 0,
        rdapErrors: 0,
      },
      confirmedAvailable: [],
      registeredViaDNS: hasDNS.map((d) => d.domain + ".com"),
      registeredViaRDAP: [],
      rdapErrors: [],
    };
    fs.writeFileSync(
      "availability_results_batch2.json",
      JSON.stringify(output, null, 2)
    );
    console.log(`Results saved to: availability_results_batch2.json`);
    return;
  }

  console.log(`\n=== PHASE 2: Slow RDAP Verification ===`);
  console.log(`Verifying ${noDNS.length} domains with 3s delay between requests...`);
  console.log("");

  const confirmed = [];
  const stillTaken = [];
  const rdapErrors = [];

  for (let i = 0; i < noDNS.length; i++) {
    const { domain } = noDNS[i];
    console.log(
      `  [${i + 1}/${noDNS.length}] Checking ${domain}.com via RDAP...`
    );

    const result = await checkRDAP(domain);
    console.log(
      `         -> ${result.status.toUpperCase()}${
        result.error ? " (" + result.error + ")" : ""
      }`
    );

    if (result.available) {
      confirmed.push(domain);
    } else if (result.status === "registered") {
      stillTaken.push(domain);
    } else {
      rdapErrors.push({ domain, ...result });
    }

    if (i < noDNS.length - 1) {
      await sleep(3000);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("FINAL RESULTS (Batch 2)");
  console.log("=".repeat(60));
  console.log(`Total candidates: ${ALL_DOMAINS.length}`);
  console.log(`Confirmed available (no DNS + RDAP 404): ${confirmed.length}`);
  console.log(`Registered (has DNS): ${hasDNS.length}`);
  console.log(`Registered (RDAP confirmed): ${stillTaken.length}`);
  console.log(`RDAP errors/timeouts: ${rdapErrors.length}`);

  const output = {
    timestamp: new Date().toISOString(),
    summary: {
      total: ALL_DOMAINS.length,
      confirmedAvailable: confirmed.length,
      registeredViaDNS: hasDNS.length,
      registeredViaRDAP: stillTaken.length,
      rdapErrors: rdapErrors.length,
    },
    confirmedAvailable: confirmed.map((d) => ({
      domain: `${d}.com`,
      root: d,
      category: CATEGORY_MAP[d] || "?",
    })),
    registeredViaDNS: hasDNS.map((d) => d.domain + ".com"),
    registeredViaRDAP: stillTaken.map((d) => d.domain + ".com"),
    rdapErrors: rdapErrors.map((d) => d.domain + ".com"),
  };

  fs.writeFileSync(
    "availability_results_batch2.json",
    JSON.stringify(output, null, 2)
  );
  console.log(`\nResults saved to: availability_results_batch2.json`);

  if (confirmed.length > 0) {
    console.log(`\n${"-".repeat(60)}`);
    console.log("CONFIRMED AVAILABLE DOMAINS");
    console.log("-".repeat(60));
    for (const [cat, label] of [
      ["A", "Style A: Modern & Short Tech Brand"],
      ["B", "Style B: Travel & Freedom Identity"],
      ["C", "Style C: Speed & Direct Action"],
    ]) {
      const catDomains = confirmed.filter(
        (d) => CATEGORY_MAP[d] === cat
      );
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
