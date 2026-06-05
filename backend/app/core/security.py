import re

MOROCCO_PHONE_RE = re.compile(r"^0[67]\d{8}$")


def is_valid_moroccan_phone(phone: str) -> bool:
    return bool(MOROCCO_PHONE_RE.match(phone.strip()))
