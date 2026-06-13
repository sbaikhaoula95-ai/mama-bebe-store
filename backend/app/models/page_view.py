import uuid
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class PageView(Base):
    """
    One row per visitor page-view.
    `is_valid_visit` is set to TRUE only when the IP resolves to a country in the
    Moroccan whitelist AND the IP is NOT flagged as VPN / proxy / Tor / hosting / datacenter.
    The admin dashboard COUNTS ONLY rows with `is_valid_visit = TRUE` as clicks/visits.
    """

    __tablename__ = "page_views"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Client-side persistent session id (random 32-char string in localStorage).
    session_id = Column(String(64), nullable=True, index=True)
    path = Column(Text, nullable=False)
    referrer = Column(Text, nullable=True)
    user_agent = Column(Text, nullable=True)
    client_ip = Column(String(64), nullable=True, index=True)

    # Attribution
    utm_source = Column(String(120), nullable=True, index=True)
    utm_medium = Column(String(120), nullable=True)
    utm_campaign = Column(String(120), nullable=True)
    utm_content = Column(String(120), nullable=True)
    utm_term = Column(String(120), nullable=True)
    fbclid = Column(String(255), nullable=True)
    ttclid = Column(String(255), nullable=True)

    # IP enrichment (filled at insert time from cache or async lookup)
    country_iso = Column(String(2), nullable=True, index=True)
    is_vpn = Column(Boolean, nullable=False, default=False)
    is_proxy = Column(Boolean, nullable=False, default=False)
    is_hosting = Column(Boolean, nullable=False, default=False)
    is_tor = Column(Boolean, nullable=False, default=False)
    risk_score = Column(Numeric(5, 2), nullable=True)

    # The single boolean the admin queries on. TRUE = clean Moroccan visit.
    is_valid_visit = Column(Boolean, nullable=False, default=False, index=True)
    block_reason = Column(String(64), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=func.now(),
        index=True,
    )


class IpLookup(Base):
    """
    Cache for MaxMind / IP-enrichment results so we don't hit the API on every page view.
    TTL is enforced via `expires_at` — expired rows are refreshed on next lookup.
    """

    __tablename__ = "ip_lookups"

    ip = Column(String(64), primary_key=True)

    country_iso = Column(String(2), nullable=True)
    is_vpn = Column(Boolean, nullable=False, default=False)
    is_proxy = Column(Boolean, nullable=False, default=False)
    is_hosting = Column(Boolean, nullable=False, default=False)
    is_tor = Column(Boolean, nullable=False, default=False)
    is_anonymous = Column(Boolean, nullable=False, default=False)
    risk_score = Column(Numeric(5, 2), nullable=True)

    # Pre-computed once: would this IP be counted as a valid Moroccan visit?
    is_valid_morocco = Column(Boolean, nullable=False, default=False)
    block_reason = Column(String(64), nullable=True)

    # Source of the lookup ("maxmind", "manual", "local-private", ...).
    source = Column(String(20), nullable=False, default="maxmind")

    looked_up_at = Column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
