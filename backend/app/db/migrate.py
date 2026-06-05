import subprocess
import sys
from app.core.logging import logger


def run_migrations() -> None:
    """Run Alembic migrations synchronously on startup."""
    logger.info("Running database migrations...")
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            check=True,
        )
        logger.info("Migrations completed successfully.")
        if result.stdout:
            logger.info(result.stdout)
    except subprocess.CalledProcessError as e:
        logger.error(f"Migration failed: {e.stderr}")
        sys.exit(1)
