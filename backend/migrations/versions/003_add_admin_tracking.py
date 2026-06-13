"""Add page_views, ip_lookups tables for admin dashboard analytics.

Revision ID: 003
Revises: 002
Create Date: 2026-06-13 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ─── page_views ───
    op.create_table(
        "page_views",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("session_id", sa.String(length=64), nullable=True),
        sa.Column("path", sa.Text(), nullable=False),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("client_ip", sa.String(length=64), nullable=True),
        sa.Column("utm_source", sa.String(length=120), nullable=True),
        sa.Column("utm_medium", sa.String(length=120), nullable=True),
        sa.Column("utm_campaign", sa.String(length=120), nullable=True),
        sa.Column("utm_content", sa.String(length=120), nullable=True),
        sa.Column("utm_term", sa.String(length=120), nullable=True),
        sa.Column("fbclid", sa.String(length=255), nullable=True),
        sa.Column("ttclid", sa.String(length=255), nullable=True),
        sa.Column("country_iso", sa.String(length=2), nullable=True),
        sa.Column("is_vpn", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_proxy", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_hosting", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_tor", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("risk_score", sa.Numeric(5, 2), nullable=True),
        sa.Column(
            "is_valid_visit",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("block_reason", sa.String(length=64), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("ix_page_views_session_id", "page_views", ["session_id"])
    op.create_index("ix_page_views_client_ip", "page_views", ["client_ip"])
    op.create_index("ix_page_views_country_iso", "page_views", ["country_iso"])
    op.create_index("ix_page_views_utm_source", "page_views", ["utm_source"])
    op.create_index("ix_page_views_created_at", "page_views", ["created_at"])
    op.create_index(
        "ix_page_views_valid_created",
        "page_views",
        ["is_valid_visit", "created_at"],
    )

    # ─── ip_lookups ───
    op.create_table(
        "ip_lookups",
        sa.Column("ip", sa.String(length=64), primary_key=True),
        sa.Column("country_iso", sa.String(length=2), nullable=True),
        sa.Column("is_vpn", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_proxy", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_hosting", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_tor", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "is_anonymous",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("risk_score", sa.Numeric(5, 2), nullable=True),
        sa.Column(
            "is_valid_morocco",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("block_reason", sa.String(length=64), nullable=True),
        sa.Column("source", sa.String(length=20), nullable=False, server_default="maxmind"),
        sa.Column(
            "looked_up_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_ip_lookups_expires_at", "ip_lookups", ["expires_at"])

    # ─── helpful indexes on existing tables (admin queries) ───
    op.create_index(
        "ix_orders_status_created_at", "orders", ["status", "created_at"]
    )
    op.create_index("ix_orders_city", "orders", ["city"])
    op.create_index("ix_orders_utm_source", "orders", ["utm_source"])


def downgrade() -> None:
    op.drop_index("ix_orders_utm_source", table_name="orders")
    op.drop_index("ix_orders_city", table_name="orders")
    op.drop_index("ix_orders_status_created_at", table_name="orders")

    op.drop_index("ix_ip_lookups_expires_at", table_name="ip_lookups")
    op.drop_table("ip_lookups")

    op.drop_index("ix_page_views_valid_created", table_name="page_views")
    op.drop_index("ix_page_views_created_at", table_name="page_views")
    op.drop_index("ix_page_views_utm_source", table_name="page_views")
    op.drop_index("ix_page_views_country_iso", table_name="page_views")
    op.drop_index("ix_page_views_client_ip", table_name="page_views")
    op.drop_index("ix_page_views_session_id", table_name="page_views")
    op.drop_table("page_views")
