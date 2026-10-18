/**
 * RDAP Domain Availability Checker for .com domains (Node.js).
 *
 * Uses https://rdap.org/domain/{domain} to check registration status.
 * - HTTP 404 -> Domain is AVAILABLE (unregistered)
 * - HTTP 200 -> Domain is TAKEN (registered)
 * - Other/Error -> Unknown status
 */

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

const RDAP_BASE = "https://rdap.org/domain/";
const CONCURRENCY = 5;

async function checkDomain(domain) {
  const url = `${RDAP_BASE}${domain}.com`;
  const result = {
    domain: `${domain}.com`,
    root: domain,
    category: CATEGORY_MAP[domain] || "?",
    status: "unknown",
    available: false,
    error: null,
    timestamp: new Date().toISOString(),
  };

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
      result.status = "registered";
      result.available = false;
    } else if (resp.status === 404) {
      result.status = "available";
      result.available = true;
    } else if (resp.status === 429) {
      result.status = "rate_limited";
      result.available = false;
      result.error = "Rate limited by RDAP server";
    } else {
      result.status = `http_${resp.status}`;
      result.available = false;
    }
  } catch (e) {
    result.status = "error";
    result.available = false;
    result.error = e.message;
  }

  return result;
}

async function runWithConcurrency(domains, concurrency) {
  const results = [];
  let index = 0;
  let completed = 0;
  const total = domains.length;

  async function worker() {
    while (index < domains.length) {
      const currentIndex = index++;
      const domain = domains[currentIndex];
      const result = await checkDomain(domain);
      results.push(result);
      completed++;

      if (result.available) {
        console.log(`  [${completed}/${total}] AVAILABLE: ${result.domain}`);
      } else if (result.status === "registered") {
        console.log(`  [${completed}/${total}] taken:     ${result.domain}`);
      } else {
        console.log(`  [${completed}/${total}] ERROR:     ${result.domain} (${result.status})`);
      }

      // Small delay between requests from same worker
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  return results;
}

async function main() {
  console.log(`Checking ${ALL_DOMAINS.length} domain candidates via RDAP...`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("-".repeat(60));

  const results = await runWithConcurrency(ALL_DOMAINS, CONCURRENCY);

  const available = results.filter((r) => r.available);
  const taken = results.filter((r) => r.status === "registered");
  const errors = results.filter((r) => !r.available && r.status !== "registered");

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total checked: ${ALL_DOMAINS.length}`);
  console.log(`Available:     ${available.length}`);
  console.log(`Registered:    ${taken.length}`);
  console.log(`Errors:        ${errors.length}`);

  for (const [cat, label] of [
    ["A", "Modern Tech"],
    ["B", "Travel Freedom"],
    ["C", "Speed Action"],
  ]) {
    const catAvail = available.filter((r) => r.category === cat);
    const catTotal = ALL_DOMAINS.filter((d) => CATEGORY_MAP[d] === cat).length;
    console.log(`  Style ${cat} (${label}): ${catAvail.length}/${catTotal} available`);
  }

  // Save full results
  const output = {
    timestamp: new Date().toISOString(),
    total: ALL_DOMAINS.length,
    availableCount: available.length,
    takenCount: taken.length,
    errorCount: errors.length,
    results,
    availableDomains: available.map((r) => r.domain),
  };

  const fs = await import("fs");
  const outputPath = "availability_results.json";
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nFull results saved to: ${outputPath}`);

  // Print available domains by category
  console.log("\n" + "-".repeat(60));
  console.log("AVAILABLE DOMAINS BY CATEGORY");
  console.log("-".repeat(60));
  for (const [cat, label] of [
    ["A", "Style A: Modern & Short Tech Brand"],
    ["B", "Style B: Travel & Freedom Identity"],
    ["C", "Style C: Speed & Direct Action"],
  ]) {
    const catAvail = available.filter((r) => r.category === cat);
    if (catAvail.length > 0) {
      console.log(`\n${label}:`);
      for (const r of catAvail) {
        console.log(`  + ${r.domain}`);
      }
    }
  }
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
