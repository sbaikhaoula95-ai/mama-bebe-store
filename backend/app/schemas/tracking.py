from typing import Optional
from pydantic import BaseModel


class TrackingEventOut(BaseModel):
    platform: str
    event_name: str
    status: str
    response_code: Optional[int] = None
