"""
RDAP Domain Availability Checker for .com domains.

Uses https://rdap.org/domain/{domain} to check registration status.
- HTTP 404 -> Domain is AVAILABLE (unregistered)
- HTTP 200 -> Domain is TAKEN (registered)
- Other/Error -> Unknown status

Outputs results to availability_results.json for further curation.
"""

import json
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# Domain candidates by category
STYLE_A = [
    "velora", "novara", "olyra", "velio", "velano", "veluna", "velori",
    "velyr", "velixo", "veltra", "novalo", "novani", "novaro", "novaly",
    "novano", "zorva", "zolva", "zavra", "zolara", "kavel", "kavio",
    "kavara", "talvo", "talvi", "talora", "rivan", "rivara", "pexia",
    "pexara", "melara", "melio", "zorex", "zorven", "zalvo", "zalva",
    "zevra", "zenora", "zonara", "zilara", "zivara", "zylara", "xylon",
    "xyron", "qyber", "qyron",
]

STYLE_B = [
    "novia", "novan", "novino", "novita", "roama", "roamit", "roamy",
    "roamara", "voyia", "voyara", "voyana", "voyano", "passia", "passara",
    "passly", "wavia", "wavio", "wavara", "swifta", "netara", "netio",
    "netly", "netia", "flyara", "flyra", "orbina", "orbita", "linkia",
    "linko", "linkra", "spota", "govia", "goara", "airly", "airara",
    "simara", "simia", "simly", "nomara", "nomado", "hubio", "hubly",
    "connio", "netra",
]

STYLE_C = [
    "swifo", "swiftio", "passio", "spotly", "spotio", "flyon", "goario",
    "govio", "hubara", "connexa", "airio",
]

ALL_DOMAINS = STYLE_A + STYLE_B + STYLE_C

CATEGORY_MAP = {}
for d in STYLE_A:
    CATEGORY_MAP[d] = "A"
for d in STYLE_B:
    CATEGORY_MAP[d] = "B"
for d in STYLE_C:
    CATEGORY_MAP[d] = "C"

RDAP_BASE = "https://rdap.org/domain/"

def check_domain(domain: str) -> dict:
    """Check a single domain via RDAP. Returns status dict."""
    url = f"{RDAP_BASE}{domain}.com"
    result = {
        "domain": f"{domain}.com",
        "root": domain,
        "category": CATEGORY_MAP.get(domain, "?"),
        "status": "unknown",
        "available": False,
        "error": None,
        "timestamp": datetime.utcnow().isoformat(),
    }

    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "DomainAvailabilityChecker/1.0",
                "Accept": "application/rdap+json",
            },
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            status_code = resp.getcode()
            if status_code == 200:
                result["status"] = "registered"
                result["available"] = False
            elif status_code == 404:
                result["status"] = "available"
                result["available"] = True
            else:
                result["status"] = f"http_{status_code}"
                result["available"] = False
    except urllib.error.HTTPError as e:
        if e.code == 404:
            result["status"] = "available"
            result["available"] = True
        elif e.code == 429:
            result["status"] = "rate_limited"
            result["available"] = False
            result["error"] = "Rate limited by RDAP server"
        else:
            result["status"] = f"http_{e.code}"
            result["available"] = False
            result["error"] = str(e)
    except Exception as e:
        result["status"] = "error"
        result["available"] = False
        result["error"] = str(e)

    return result


def main():
    print(f"Checking {len(ALL_DOMAINS)} domain candidates via RDAP...")
    print(f"Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC")
    print("-" * 60)

    results = []
    available = []
    taken = []
    errors = []

    # Use ThreadPoolExecutor for concurrent checks (max 5 workers to be polite)
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_domain = {
            executor.submit(check_domain, domain): domain
            for domain in ALL_DOMAINS
        }

        for i, future in enumerate(as_completed(future_to_domain), 1):
            domain = future_to_domain[future]
            try:
                result = future.result()
                results.append(result)

                if result["available"]:
                    available.append(result)
                    print(f"  [{i}/{len(ALL_DOMAINS)}] AVAILABLE: {result['domain']}")
                elif result["status"] == "registered":
                    taken.append(result)
                    print(f"  [{i}/{len(ALL_DOMAINS)}] taken:     {result['domain']}")
                else:
                    errors.append(result)
                    print(f"  [{i}/{len(ALL_DOMAINS)}] ERROR:     {result['domain']} ({result['status']})")

            except Exception as e:
                print(f"  [{i}/{len(ALL_DOMAINS)}] FAILED:    {domain} - {e}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total checked: {len(ALL_DOMAINS)}")
    print(f"Available:     {len(available)}")
    print(f"Registered:    {len(taken)}")
    print(f"Errors:        {len(errors)}")

    # Category breakdown
    for cat, label in [("A", "Modern Tech"), ("B", "Travel Freedom"), ("C", "Speed Action")]:
        cat_avail = [r for r in available if r["category"] == cat]
        cat_total = sum(1 for d in ALL_DOMAINS if CATEGORY_MAP[d] == cat)
        print(f"  Style {cat} ({label}): {len(cat_avail)}/{cat_total} available")

    # Save full results
    output = {
        "timestamp": datetime.utcnow().isoformat(),
        "total": len(ALL_DOMAINS),
        "available_count": len(available),
        "taken_count": len(taken),
        "error_count": len(errors),
        "results": results,
        "available_domains": [r["domain"] for r in available],
    }

    output_path = "availability_results.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nFull results saved to: {output_path}")

    # Print available domains by category
    print("\n" + "-" * 60)
    print("AVAILABLE DOMAINS BY CATEGORY")
    print("-" * 60)
    for cat, label in [("A", "Style A: Modern & Short Tech Brand"),
                        ("B", "Style B: Travel & Freedom Identity"),
                        ("C", "Style C: Speed & Direct Action")]:
        cat_avail = [r for r in available if r["category"] == cat]
        if cat_avail:
            print(f"\n{label}:")
            for r in cat_avail:
                print(f"  + {r['domain']}")


if __name__ == "__main__":
    main()
