import hashlib


def sha256_hex(value: str) -> str:
    """SHA-256 hash as lowercase hex."""
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()


def normalize_ma_phone_local(phone: str) -> str:
    """Validate and normalize 06/07 Moroccan mobile number."""
    digits = "".join(ch for ch in phone if ch.isdigit())
    if len(digits) != 10 or not digits.startswith(("06", "07")):
        raise ValueError("Invalid Moroccan mobile phone number")
    return digits


def normalize_phone_meta_snap(phone: str) -> str:
    """212xxxxxxxxx format for Meta and Snapchat CAPI."""
    local = normalize_ma_phone_local(phone)
    return "212" + local[1:]  # remove leading 0, add 212


def normalize_phone_tiktok(phone: str) -> str:
    """+212xxxxxxxxx format for TikTok Events API."""
    return "+" + normalize_phone_meta_snap(phone)


def hash_phone_meta_snap(phone: str) -> str:
    """Normalized and hashed phone for Meta/Snap CAPI."""
    return sha256_hex(normalize_phone_meta_snap(phone))


def hash_phone_tiktok(phone: str) -> str:
    """Normalized and hashed phone for TikTok Events API."""
    return sha256_hex(normalize_phone_tiktok(phone))


def hash_name_field(name: str) -> str:
    """Hash first name for Meta user_data.fn."""
    first = name.strip().split()[0] if name.strip() else ""
    return sha256_hex(first) if first else ""


def hash_city(city: str) -> str:
    """Hash city in lowercase no punctuation for Meta."""
    normalized = "".join(c for c in city.lower() if c.isalnum() or c.isspace()).strip()
    return sha256_hex(normalized) if normalized else ""


def hash_country() -> str:
    """Hash 'ma' for Morocco."""
    return sha256_hex("ma")
