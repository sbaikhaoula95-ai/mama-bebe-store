from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health():
    sheet_webhook_url = settings.sheet_webhook_url.strip()
    return {
        "status": "ok",
        "service": "hnina-api",
        "integrations": {
            "googleSheets": {
                "configured": bool(sheet_webhook_url),
                "looksLikeAppsScriptExecUrl": sheet_webhook_url.startswith(
                    "https://script.google.com/macros/s/"
                )
                and sheet_webhook_url.endswith("/exec"),
            }
        },
    }
