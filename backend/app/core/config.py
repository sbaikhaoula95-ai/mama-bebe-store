from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "hnina-api"
    app_env: str = "production"
    debug: bool = False

    public_frontend_url: str = "https://hnina.shop"
    api_base_url: str = "https://api.hnina.shop"
    allowed_origins: str = "https://hnina.shop,https://www.hnina.shop"

    database_url: str = "postgresql+asyncpg://hnina:CHANGE_ME@localhost:5432/hnina"

    webhook_shared_secret: str = "CHANGE_ME"
    order_lookup_secret: str = "CHANGE_ME"

    sheet_webhook_url: str = ""
    sheet_webhook_secret: str = ""

    meta_pixel_id: str = ""
    meta_access_token: str = ""
    meta_test_event_code: str = ""
    meta_api_version: str = "v20.0"

    tiktok_pixel_code: str = ""
    tiktok_access_token: str = ""
    tiktok_test_event_code: str = ""

    snap_pixel_id: str = ""
    snap_access_token: str = ""

    order_rate_limit_per_ip_hour: int = 10
    order_rate_limit_per_phone_day: int = 3

    maxmind_enabled: bool = False
    maxmind_account_id: str = ""
    maxmind_license_key: str = ""
    maxmind_risk_score_threshold: float = 25.0
    maxmind_whitelisted_phones: str = "0610000000"

    @property
    def cors_origins(self) -> List[str]:
        origins = [o.strip() for o in self.allowed_origins.split(",") if o.strip()]
        if self.app_env != "production":
            origins.append("http://localhost:3000")
            origins.append("http://127.0.0.1:3000")
        return origins

    @property
    def maxmind_phone_whitelist(self) -> set[str]:
        return {
            phone.strip()
            for phone in self.maxmind_whitelisted_phones.split(",")
            if phone.strip()
        }


settings = Settings()
