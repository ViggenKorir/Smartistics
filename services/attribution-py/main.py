from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI(title="Smartistics Attribution Service", version="0.1.0")


class Touchpoint(BaseModel):
    channel: str
    type: str
    timestamp: float


class UserPath(BaseModel):
    path: List[Touchpoint]


class AttributionRequest(BaseModel):
    tenant_id: str
    user_paths: List[UserPath]


@app.get("/healthz")
async def healthz() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/score/attribution")
async def score_attribution(req: AttributionRequest) -> Dict[str, Any]:
    decay_weights = {"impression": 0.2, "click": 0.6, "whatsapp": 0.8}
    channel_credit: Dict[str, float] = {}

    for user_path in req.user_paths:
        steps = user_path.path
        for idx, step in enumerate(steps):
            base = decay_weights.get(step.type, 0.3)
            decay = 0.85 ** (len(steps) - 1 - idx)
            channel_credit[step.channel] = channel_credit.get(step.channel, 0.0) + base * decay

    # normalize to sum=1 for a demo output
    total = sum(channel_credit.values()) or 1.0
    normalized = {k: v / total for k, v in channel_credit.items()}

    return {
        "tenant_id": req.tenant_id,
        "channels": normalized,
        "method": "rules:last-touch-decayed",
    } 