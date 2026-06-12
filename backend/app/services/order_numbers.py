from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text


async def generate_order_number(db: AsyncSession) -> str:
    """Generate HNINA-YYYYMMDD-XXXX format order number."""
    today = datetime.utcnow().strftime("%Y%m%d")
    prefix = f"HNINA-{today}-"

    result = await db.execute(
        text(
            "SELECT COUNT(*) FROM orders WHERE order_number LIKE :prefix"
        ),
        {"prefix": f"{prefix}%"},
    )
    count = result.scalar() or 0
    sequence = count + 1

    return f"{prefix}{sequence:04d}"
