import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    platform = Column(String, nullable=False)  # meta, tiktok, snapchat
    event_name = Column(String, nullable=False)
    event_id = Column(String, nullable=False)
    payload_summary = Column(JSONB, nullable=True)
    status = Column(String, nullable=False)  # success, failed, skipped
    response_code = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=func.now())

    order = relationship("Order", back_populates="tracking_events")
