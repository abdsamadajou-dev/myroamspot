"""
Domain candidates for eSIM SaaS brand.
Organized by style category.
"""

STYLE_A_MODERN_TECH = [
    "velora", "novara", "olyra", "velio", "velano", "veluna", "velori",
    "velyr", "velixo", "veltra", "novalo", "novani", "novaro", "novaly",
    "novano", "zorva", "zolva", "zavra", "zolara", "kavel", "kavio",
    "kavara", "talvo", "talvi", "talora", "rivan", "rivara", "pexia",
    "pexara", "melara", "melio", "zorex", "zorven", "zalvo", "zalva",
    "zevra", "zenora", "zonara", "zilara", "zivara", "zylara", "xylon",
    "xyron", "qyber", "qyron",
]

STYLE_B_TRAVEL_FREEDOM = [
    "novia", "novan", "novino", "novita", "roama", "roamit", "roamy",
    "roamara", "voyia", "voyara", "voyana", "voyano", "passia", "passara",
    "passly", "wavia", "wavio", "wavara", "swifta", "netara", "netio",
    "netly", "netia", "flyara", "flyra", "orbina", "orbita", "linkia",
    "linko", "linkra", "spota", "govia", "goara", "airly", "airara",
    "simara", "simia", "simly", "nomara", "nomado", "hubio", "hubly",
    "connio", "netra",
]

STYLE_C_SPEED_ACTION = [
    "swifo", "swiftio", "passio", "spotly", "spotio", "flyon", "goario",
    "govio", "hubara", "connexa", "airio",
]

ALL_CANDIDATES = (
    STYLE_A_MODERN_TECH + STYLE_B_TRAVEL_FREEDOM + STYLE_C_SPEED_ACTION
)

# Categories for final output
CATEGORIES = {
    "A_modern_tech": STYLE_A_MODERN_TECH,
    "B_travel_freedom": STYLE_B_TRAVEL_FREEDOM,
    "C_speed_action": STYLE_C_SPEED_ACTION,
}
