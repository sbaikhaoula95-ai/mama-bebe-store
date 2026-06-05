from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.contact import ContactIn, ContactOut
from app.models.contact_message import ContactMessage
from app.core.logging import logger

router = APIRouter()


@router.post("/contact", response_model=ContactOut)
async def submit_contact(
    payload: ContactIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    message = ContactMessage(
        name=payload.name,
        phone=payload.phone,
        message=payload.message,
        source_page=payload.source_page,
    )
    db.add(message)
    await db.commit()

    logger.info(f"Contact message received from {payload.name} ({payload.phone})")

    return ContactOut(success=True, message="تم استقبال رسالتك بنجاح")
