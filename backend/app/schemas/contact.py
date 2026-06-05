import re
from pydantic import BaseModel, field_validator

MOROCCO_PHONE_RE = re.compile(r"^0[67]\d{8}$")


class ContactIn(BaseModel):
    name: str
    phone: str
    message: str
    source_page: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not MOROCCO_PHONE_RE.match(v):
            raise ValueError("رقم الهاتف يجب أن يكون رقما مغربيا صحيحا")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("الاسم مطلوب")
        return v.strip()

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 5:
            raise ValueError("الرسالة مطلوبة")
        return v.strip()


class ContactOut(BaseModel):
    success: bool
    message: str
