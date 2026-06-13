from __future__ import annotations
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


class _CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
    )


class PageViewIn(_CamelModel):
    session_id: Optional[str] = Field(default=None, max_length=64)
    path: str = Field(min_length=1, max_length=2048)
    referrer: Optional[str] = Field(default=None, max_length=2048)
    utm_source: Optional[str] = Field(default=None, max_length=120)
    utm_medium: Optional[str] = Field(default=None, max_length=120)
    utm_campaign: Optional[str] = Field(default=None, max_length=120)
    utm_content: Optional[str] = Field(default=None, max_length=120)
    utm_term: Optional[str] = Field(default=None, max_length=120)
    fbclid: Optional[str] = Field(default=None, max_length=255)
    ttclid: Optional[str] = Field(default=None, max_length=255)


class PageViewOut(_CamelModel):
    ok: bool
    counted: bool
    reason: Optional[str] = None


class TrackingEventOut(BaseModel):
    """Kept for backward compatibility (CAPI event summaries)."""

    platform: str
    event_name: str
    status: str
    response_code: Optional[int] = None
