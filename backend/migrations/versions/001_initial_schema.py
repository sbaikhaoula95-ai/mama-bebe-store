"""Initial schema — orders, order_items, tracking_events, contact_messages

Revision ID: 001
Revises:
Create Date: 2026-06-05 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # orders table
    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_number", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="received"),
        sa.Column("customer_name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("phone_normalized", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("subtotal", sa.Numeric(10, 2), nullable=False),
        sa.Column("delivery_fee", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("total", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(), nullable=False, server_default="MAD"),
        sa.Column("upsell_shown", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("upsell_accepted", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("upsell_product_id", sa.String(), nullable=True),
        sa.Column("source_page", sa.Text(), nullable=True),
        sa.Column("landing_page", sa.Text(), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("utm_source", sa.String(), nullable=True),
        sa.Column("utm_medium", sa.String(), nullable=True),
        sa.Column("utm_campaign", sa.String(), nullable=True),
        sa.Column("utm_content", sa.String(), nullable=True),
        sa.Column("utm_term", sa.String(), nullable=True),
        sa.Column("event_id", sa.String(), nullable=False, server_default=""),
        sa.Column("fbp", sa.String(), nullable=True),
        sa.Column("fbc", sa.String(), nullable=True),
        sa.Column("ttp", sa.String(), nullable=True),
        sa.Column("scid", sa.String(), nullable=True),
        sa.Column("fbclid", sa.String(), nullable=True),
        sa.Column("ttclid", sa.String(), nullable=True),
        sa.Column("sc_click_id", sa.String(), nullable=True),
        sa.Column("client_ip", sa.String(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("sheet_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sheet_status", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_unique_constraint("uq_orders_order_number", "orders", ["order_number"])
    op.create_index("ix_orders_phone", "orders", ["phone"])
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_index("ix_orders_event_id", "orders", ["event_id"])
    op.create_index("ix_orders_order_number", "orders", ["order_number"])

    # order_items table
    op.create_table(
        "order_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("product_id", sa.String(), nullable=False),
        sa.Column("sku", sa.String(), nullable=False),
        sa.Column("name_ar", sa.Text(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("line_total", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_upsell", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            ondelete="CASCADE",
        ),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])

    # tracking_events table
    op.create_table(
        "tracking_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("platform", sa.String(), nullable=False),
        sa.Column("event_name", sa.String(), nullable=False),
        sa.Column("event_id", sa.String(), nullable=False),
        sa.Column("payload_summary", postgresql.JSONB(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("response_code", sa.Integer(), nullable=True),
        sa.Column("response_body", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            ondelete="SET NULL",
        ),
    )
    op.create_index("ix_tracking_events_order_id", "tracking_events", ["order_id"])

    # contact_messages table
    op.create_table(
        "contact_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("source_page", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )


def downgrade() -> None:
    op.drop_table("contact_messages")
    op.drop_table("tracking_events")
    op.drop_table("order_items")
    op.drop_table("orders")
