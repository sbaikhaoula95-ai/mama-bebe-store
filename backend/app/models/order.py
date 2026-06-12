import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, Numeric, DateTime, ForeignKey, Integer, Text, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, nullable=False, default="received", index=True)

    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    phone_normalized = Column(String, nullable=True)
    city = Column(String, nullable=False)
    address = Column(Text, nullable=False)

    subtotal = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=0)
    total = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, nullable=False, default="MAD")

    upsell_shown = Column(Boolean, nullable=False, default=False)
    upsell_accepted = Column(Boolean, nullable=False, default=False)
    upsell_product_id = Column(String, nullable=True)

    source_page = Column(Text, nullable=True)
    landing_page = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)
    utm_source = Column(String, nullable=True)
    utm_medium = Column(String, nullable=True)
    utm_campaign = Column(String, nullable=True)
    utm_content = Column(String, nullable=True)
    utm_term = Column(String, nullable=True)

    event_id = Column(String, nullable=False, index=True)
    fbp = Column(String, nullable=True)
    fbc = Column(String, nullable=True)
    ttp = Column(String, nullable=True)
    scid = Column(String, nullable=True)
    fbclid = Column(String, nullable=True)
    ttclid = Column(String, nullable=True)
    sc_click_id = Column(String, nullable=True)

    client_ip = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)

    sheet_sent_at = Column(DateTime(timezone=True), nullable=True)
    sheet_status = Column(String, nullable=True)
    sheet_last_error = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True), nullable=False, default=func.now(), index=True
    )
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now()
    )

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    tracking_events = relationship("TrackingEvent", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    product_id = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    name_ar = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    line_total = Column(Numeric(10, 2), nullable=False)
    is_upsell = Column(Boolean, nullable=False, default=False)
    source = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=func.now())

    order = relationship("Order", back_populates="items")
