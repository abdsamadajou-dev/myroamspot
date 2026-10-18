/**
 * Two-phase domain availability checker:
 * Phase 1: DNS lookup (fast, no rate limits) - filter out registered domains
 * Phase 2: Slow RDAP verification for domains with no DNS records
 */

const { execSync } = require("child_process");
const fs = require("fs");

const STYLE_A = [
  "velora", "novara", "olyra", "velio", "velano", "veluna", "velori",
  "velyr", "velixo", "veltra", "novalo", "novani", "novaro", "novaly",
  "novano", "zorva", "zolva", "zavra", "zolara", "kavel", "kavio",
  "kavara", "talvo", "talvi", "talora", "rivan", "rivara", "pexia",
  "pexara", "melara", "melio", "zorex", "zorven", "zalvo", "zalva",
  "zevra", "zenora", "zonara", "zilara", "zivara", "zylara", "xylon",
  "xyron", "qyber", "qyron",
];

const STYLE_B = [
  "novia", "novan", "novino", "novita", "roama", "roamit", "roamy",
  "roamara", "voyia", "voyara", "voyana", "voyano", "passia", "passara",
  "passly", "wavia", "wavio", "wavara", "swifta", "netara", "netio",
  "netly", "netia", "flyara", "flyra", "orbina", "orbita", "linkia",
  "linko", "linkra", "spota", "govia", "goara", "airly", "airara",
  "simara", "simia", "simly", "nomara", "nomado", "hubio", "hubly",
  "connio", "netra",
];

const STYLE_C = [
  "swifo", "swiftio", "passio", "spotly", "spotio", "flyon", "goario",
  "govio", "hubara", "connexa", "airio",
];

const ALL_DOMAINS = [...STYLE_A, ...STYLE_B, ...STYLE_C];

const CATEGORY_MAP = {};
for (const d of STYLE_A) CATEGORY_MAP[d] = "A";
for (const d of STYLE_B) CATEGORY_MAP[d] = "B";
for (const d of STYLE_C) CATEGORY_MAP[d] = "C";

// Phase 1: DNS check using nslookup
function checkDNS(domain) {
  try {
    // Use nslookup with short timeout
    const output = execSync(
      `nslookup -type=A ${domain}.com 2>&1`,
      { timeout: 5000, encoding: "utf8" }
    );
    // If we get DNS answer section, domain is registered
    if (output.includes("Addresses:") || output.includes("Address:")) {
      return { hasDNS: true, detail: "has_a_record" };
    }
    // If we get "Non-existent domain" or "NXDOMAIN"
    if (
      output.includes("Non-existent domain") ||
      output.includes("NXDOMAIN") ||
      output.includes("can't find")
    ) {
      return { hasDNS: false, detail: "nxdomain" };
    }
    // Check for CNAME or other records
    if (output.includes("CNAME") || output.includes("canonical name")) {
      return { hasDNS: true, detail: "has_cname" };
    }
    return { hasDNS: true, detail: "unknown_but_responded" };
  } catch (e) {
    // nslookup returns non-zero exit code for non-existent domains
    if (e.status === 1) {
      // Check stderr for clues
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

// Phase 2: RDAP check (slow, one at a time)
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
  console.log(`=== PHASE 1: DNS Resolution Check ===`);
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

    // 3 second delay between requests
    if (i < noDNS.length - 1) {
      await sleep(3000);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("FINAL RESULTS");
  console.log("=".repeat(60));
  console.log(`Total candidates: ${ALL_DOMAINS.length}`);
  console.log(`Confirmed available (no DNS + RDAP 404): ${confirmed.length}`);
  console.log(`Registered (has DNS): ${hasDNS.length}`);
  console.log(`Registered (RDAP confirmed): ${stillTaken.length}`);
  console.log(`RDAP errors/timeouts: ${rdapErrors.length}`);

  // Save results
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
    "availability_results.json",
    JSON.stringify(output, null, 2)
  );
  console.log(`\nResults saved to: availability_results.json`);

  // Print confirmed available by category
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
