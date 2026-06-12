from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.cors import add_cors
from app.core.logging import setup_logging, logger
from app.api.routes import health, orders, contact

# Import models to ensure they are registered with SQLAlchemy
import app.models.order  # noqa: F401
import app.models.tracking_event  # noqa: F401
import app.models.contact_message  # noqa: F401


def create_app() -> FastAPI:
    setup_logging()
    sheet_webhook_url = settings.sheet_webhook_url.strip()
    if not sheet_webhook_url:
        logger.warning("SHEET_WEBHOOK_URL is not configured; orders will not reach Google Sheets.")
    elif not (
        sheet_webhook_url.startswith("https://script.google.com/macros/s/")
        and sheet_webhook_url.endswith("/exec")
    ):
        logger.warning("SHEET_WEBHOOK_URL does not look like a Google Apps Script /exec URL.")

    app = FastAPI(
        title="Hnina API",
        description="Backend API for hnina.shop — Morocco COD DTC store",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
    )

    add_cors(app)

    # Routes
    app.include_router(health.router, tags=["health"])
    app.include_router(orders.router, prefix="/api", tags=["orders"])
    app.include_router(contact.router, prefix="/api", tags=["contact"])

    # Global error handler
    @app.exception_handler(Exception)
    async def global_error_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "وقع مشكل داخلي، حاولي مرة أخرى."},
        )

    @app.exception_handler(422)
    async def validation_error_handler(request: Request, exc):
        return JSONResponse(
            status_code=422,
            content={"detail": "البيانات المدخلة غير صحيحة. تحققي من الحقول وحاولي مرة أخرى."},
        )

    return app


app = create_app()
