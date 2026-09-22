from fastapi import FastAPI, APIRouter, Response, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import base64
import hashlib
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# --- Emergent managed email (Resend proxy) ---
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Project Ruang")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "")
FORUM_ADMIN_KEY = os.environ.get("FORUM_ADMIN_KEY", "")

# ElevenLabs (optional upgrade; falls back to OpenAI TTS when unset)
ELEVEN_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ELEVEN_VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


# --- Email templates (fixed server-side, bilingual) ---
LEVEL_TITLES = {
    "id": {
        "parent": {"warm": "Ruang yang Hangat", "fading": "Ruang yang Mulai Samar", "silent": "Ruang yang Sunyi"},
        "son": {"warm": "Suaramu Terdengar", "fading": "Ruang yang Meredup", "silent": "Kamu Tidak Sendirian"},
    },
    "en": {
        "parent": {"warm": "A Warm Space", "fading": "A Fading Space", "silent": "A Silent Room"},
        "son": {"warm": "Your Voice Is Heard", "fading": "A Dimming Space", "silent": "You Are Not Alone"},
    },
}
DIM_LABELS = {
    "id": {"warmth": "Kehangatan & Kasih Sayang", "hostility": "Permusuhan & Agresi",
           "indifference": "Ketidakpedulian", "rejection": "Penolakan Samar"},
    "en": {"warmth": "Warmth & Affection", "hostility": "Hostility & Aggression",
           "indifference": "Indifference & Neglect", "rejection": "Undifferentiated Rejection"},
}
MODE_LABELS = {
    "id": {"parent": "Orang Tua", "son": "Anak Laki-Laki"},
    "en": {"parent": "Parent", "son": "Son"},
}
LEVEL_COLORS = {"warm": "#5B8A64", "fading": "#B45309", "silent": "#B91C1C"}


def build_result_email(doc, locale):
    loc = locale if locale in LEVEL_TITLES else "id"
    mode = doc.get("mode", "parent")
    level = doc.get("level", "warm")
    title = LEVEL_TITLES[loc].get(mode, LEVEL_TITLES[loc]["parent"]).get(level, "")
    color = LEVEL_COLORS.get(level, "#B45309")
    rows = "".join(
        f'<tr><td style="padding:9px 0;color:#57534e;font-size:14px;border-bottom:1px solid #f0ede8">'
        f'{escape(DIM_LABELS[loc][d])}</td>'
        f'<td align="right" style="padding:9px 0;font-size:14px;font-weight:bold;color:#1c1917;'
        f'border-bottom:1px solid #f0ede8">{float(doc.get(d, 0)):.1f} / 4</td></tr>'
        for d in ("warmth", "hostility", "indifference", "rejection")
    )
    if loc == "id":
        heading = "Hasil Tes Refleksi Anda"
        mode_line = f"Mode: {MODE_LABELS[loc].get(mode, mode)}"
        note = ("Tes ini adalah alat refleksi dan edukasi — bukan diagnosis klinis. "
                "Bawa hasil ini ke psikolog atau konselor bila diperlukan.")
        cta = "Buka Project Ruang"
        subject = "Hasil Tes Refleksi Anda — Project Ruang"
    else:
        heading = "Your Reflection Test Result"
        mode_line = f"Mode: {MODE_LABELS[loc].get(mode, mode)}"
        note = ("This test is a reflective and educational tool — not a clinical diagnosis. "
                "Bring this result to a psychologist or counselor if needed.")
        cta = "Open Project Ruang"
        subject = "Your Reflection Test Result — Project Ruang"
    link_html = ""
    if FRONTEND_URL:
        link_html = (f'<p style="margin:26px 0 0"><a href="{escape(FRONTEND_URL)}/?to=tes" '
                     f'style="color:#b45309;font-size:14px">{cta}</a></p>')
    html = (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#faf7f2;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border:1px solid #efe9dd;border-radius:12px;padding:36px;'
        'font-family:Georgia,serif">'
        f'<tr><td><p style="margin:0;font-size:26px;color:#1c1917">Ruang<span style="color:#d97706">.</span></p>'
        f'<p style="margin:6px 0 0;font-size:11px;letter-spacing:3px;color:#b45309;font-family:Arial,sans-serif">'
        f'{heading.upper()}</p>'
        f'<p style="margin:22px 0 0;font-size:30px;font-style:italic;color:{color}">{escape(title)}</p>'
        f'<p style="margin:6px 0 0;font-size:12px;color:#a8a29e;font-family:Arial,sans-serif">{escape(mode_line)}</p>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;'
        f'font-family:Arial,sans-serif">{rows}</table>'
        f'<p style="margin:24px 0 0;font-size:12px;color:#a8a29e;line-height:1.6;font-family:Arial,sans-serif">'
        f'{escape(note)}</p>{link_html}'
        f'<p style="margin:28px 0 0;font-size:11px;color:#c3bcb2;font-family:Arial,sans-serif">'
        f'Sent by {escape(EMAIL_FROM_NAME)} · LIDM 2026</p>'
        '</td></tr></table></td></tr></table>'
    )
    return subject, html


# --- TTS narration (fixed server-side texts) ---
LEAF_TEXTS = {
    "id": [
        "Aku tidak butuh dinasihati. Aku hanya ingin didengar.",
        "Aku menangis bukan karena lemah. Aku menangis karena akhirnya merasa aman.",
        "Gambar-gambarku adalah surat yang tak pernah berani kuberikan.",
        "Ayah, aku lebih takut mengecewakanmu daripada menghadapi dunia.",
        "Sekali saja, tanyakan kamu baik-baik saja, tanpa menunggu aku berbuat salah.",
    ],
    "en": [
        "I don't need advice. I just want to be heard.",
        "I cry not because I'm weak. I cry because I finally feel safe.",
        "My drawings are letters I never dared to hand over.",
        "Dad, I'm more afraid of disappointing you than of facing the world.",
        "Just once, ask are you okay, without waiting for me to mess up.",
    ],
}
TTS_VOICE = "sage"
TTS_MODEL = "tts-1-hd"


def _check_admin(request: Request):
    if not FORUM_ADMIN_KEY or request.headers.get("X-Admin-Key") != FORUM_ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# --- Reflection results ---
class ReflectionResultCreate(BaseModel):
    warmth: float
    hostility: float
    indifference: float
    rejection: float
    level: str
    locale: str = "id"
    mode: str = "parent"


@api_router.post("/reflection-results")
async def create_reflection_result(input: ReflectionResultCreate):
    doc = input.model_dump()
    doc["rid"] = str(uuid.uuid4())
    doc["timestamp"] = datetime.now(timezone.utc).isoformat()
    await db.reflection_results.insert_one(doc)
    return {"ok": True, "id": doc["rid"]}


@api_router.get("/reflection-stats")
async def get_reflection_stats():
    docs = await db.reflection_results.find({}, {"_id": 0}).to_list(10000)
    dims = ["warmth", "hostility", "indifference", "rejection"]

    def averages(subset):
        if not subset:
            return {d: 0 for d in dims}
        return {d: round(sum(x.get(d, 0) for x in subset) / len(subset), 2) for d in dims}

    parents = [d for d in docs if d.get("mode", "parent") == "parent"]
    sons = [d for d in docs if d.get("mode") == "son"]
    levels = {"warm": 0, "fading": 0, "silent": 0}
    for d in docs:
        lvl = d.get("level", "warm")
        levels[lvl] = levels.get(lvl, 0) + 1

    today = datetime.now(timezone.utc).date()
    by_day = []
    for i in range(6, -1, -1):
        day = (today - timedelta(days=i)).isoformat()
        by_day.append({
            "date": day,
            "count": sum(1 for d in docs if str(d.get("timestamp", ""))[:10] == day),
        })

    return {
        "count": len(docs),
        "levels": levels,
        "averages": averages(docs),
        "parentAverages": averages(parents),
        "sonAverages": averages(sons),
        "modes": {"parent": len(parents), "son": len(sons)},
        "byDay": by_day,
    }


@api_router.get("/reflection-export")
async def export_reflection_csv():
    docs = await db.reflection_results.find({}, {"_id": 0}).to_list(10000)
    fields = ["timestamp", "mode", "locale", "warmth", "hostility", "indifference", "rejection", "level"]
    lines = [",".join(fields)]
    for d in docs:
        row = [str(d.get(f, "")) for f in fields]
        row[1] = row[1] or "parent"
        lines.append(",".join(row))
    return Response(
        content="\n".join(lines),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ruang-data-refleksi.csv"},
    )


class EmailRequest(BaseModel):
    email: str
    locale: str = "id"


@api_router.post("/reflection-results/{rid}/email")
async def email_reflection_result(rid: str, input: EmailRequest):
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", input.email):
        raise HTTPException(status_code=400, detail="Invalid email")
    doc = await db.reflection_results.find_one({"rid": rid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Result not found")
    since = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    sent = await db.email_log.count_documents({"email": input.email, "timestamp": {"$gte": since}})
    if sent >= 3:
        raise HTTPException(status_code=429, detail="Too many emails")
    subject, html = build_result_email(doc, input.locale)
    email_id = await send_email(to=input.email, subject=subject, html=html)
    await db.email_log.insert_one(
        {"email": input.email, "timestamp": datetime.now(timezone.utc).isoformat()}
    )
    return {"ok": True, "email_id": email_id}


# --- Community forum (moderated) ---
class ForumPostCreate(BaseModel):
    name: str = ""
    message: str
    locale: str = "id"


def _clean(text: str) -> str:
    return re.sub(r"<[^>]*>", "", text).strip()


@api_router.post("/forum-posts")
async def create_forum_post(input: ForumPostCreate):
    name = _clean(input.name)[:40]
    message = _clean(input.message)
    if len(message) < 5 or len(message) > 500:
        raise HTTPException(status_code=400, detail="Message must be 5-500 characters")
    doc = {
        "pid": str(uuid.uuid4()),
        "name": name,
        "message": message,
        "locale": input.locale if input.locale in ("id", "en") else "id",
        "hugs": 0,
        "reports": 0,
        "status": "pending",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.forum_posts.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "post": doc}


@api_router.get("/forum-posts")
async def list_forum_posts():
    docs = await db.forum_posts.find(
        {"$or": [{"status": "approved"}, {"status": {"$exists": False}}]},
        {"_id": 0},
    ).sort("timestamp", -1).to_list(60)
    for d in docs:
        if not d.get("name"):
            d["name"] = "Orang Tua Anonim" if d.get("locale") == "id" else "Anonymous Parent"
    return {"posts": docs}


@api_router.post("/forum-posts/{pid}/hug")
async def hug_forum_post(pid: str):
    await db.forum_posts.update_one({"pid": pid}, {"$inc": {"hugs": 1}})
    return {"ok": True}


@api_router.post("/forum-posts/{pid}/report")
async def report_forum_post(pid: str):
    await db.forum_posts.update_one({"pid": pid}, {"$inc": {"reports": 1}})
    doc = await db.forum_posts.find_one({"pid": pid})
    if doc and doc.get("reports", 0) >= 3:
        await db.forum_posts.update_one({"pid": pid}, {"$set": {"status": "flagged"}})
    return {"ok": True}


@api_router.get("/forum-admin/overview")
async def forum_admin_overview(request: Request):
    _check_admin(request)
    posts = await db.forum_posts.find({}, {"_id": 0}).sort("timestamp", -1).to_list(200)
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(200)
    bookings = await db.counseling_bookings.find({}, {"_id": 0}).sort("timestamp", -1).to_list(200)
    return {"posts": posts, "messages": messages, "bookings": bookings}


@api_router.post("/forum-admin/posts/{pid}/{action}")
async def forum_admin_action(pid: str, action: str, request: Request):
    _check_admin(request)
    if action not in ("approve", "reject"):
        raise HTTPException(status_code=400, detail="Invalid action")
    await db.forum_posts.update_one(
        {"pid": pid}, {"$set": {"status": "approved" if action == "approve" else "rejected"}}
    )
    return {"ok": True}


# --- Contact messages (narahubung) ---
class ContactMessageCreate(BaseModel):
    name: str
    contact: str = ""
    message: str
    locale: str = "id"


@api_router.post("/contact-messages")
async def create_contact_message(input: ContactMessageCreate):
    name = _clean(input.name)[:60]
    contact = _clean(input.contact)[:80]
    message = _clean(input.message)
    if len(name) < 2 or len(message) < 10 or len(message) > 1000:
        raise HTTPException(status_code=400, detail="Invalid message")
    doc = {
        "cid": str(uuid.uuid4()),
        "name": name,
        "contact": contact,
        "message": message,
        "locale": input.locale if input.locale in ("id", "en") else "id",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)
    return {"ok": True}


# --- Leaf narration (TTS with Mongo cache; ElevenLabs when key present) ---
@api_router.get("/leaf-narration/{locale}/{index}.mp3")
async def leaf_narration(locale: str, index: int):
    if locale not in LEAF_TEXTS or not (0 <= index < len(LEAF_TEXTS[locale])):
        raise HTTPException(status_code=404, detail="Not found")
    text = LEAF_TEXTS[locale][index]
    provider = "elevenlabs" if ELEVEN_KEY else "openai"
    voice = ELEVEN_VOICE if ELEVEN_KEY else TTS_VOICE
    key = hashlib.sha256(f"{text}|{provider}|{voice}|{TTS_MODEL}|mp3".encode()).hexdigest()
    cached = await db.leaf_audio.find_one({"key": key})
    if cached:
        return Response(
            content=base64.b64decode(cached["audio"]),
            media_type="audio/mpeg",
            headers={"Cache-Control": "public, max-age=31536000"},
        )
    try:
        if ELEVEN_KEY:
            from elevenlabs.client import AsyncElevenLabs
            el = AsyncElevenLabs(api_key=ELEVEN_KEY)
            audio_stream = await el.text_to_speech.convert(
                text=text,
                voice_id=ELEVEN_VOICE,
                model_id="eleven_multilingual_v2",
            )
            audio = b""
            async for chunk in audio_stream:
                audio += chunk
        else:
            from emergentintegrations.llm.openai import OpenAITextToSpeech
            tts = OpenAITextToSpeech(api_key=os.environ["EMERGENT_LLM_KEY"])
            audio = await tts.generate_speech(text=text, model=TTS_MODEL, voice=TTS_VOICE)
    except Exception as e:
        logger.error(f"TTS generation failed: {e}")
        raise HTTPException(status_code=502, detail="TTS generation failed")
    await db.leaf_audio.insert_one({"key": key, "audio": base64.b64encode(audio).decode()})
    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


# --- Counseling bookings ---
class BookingCreate(BaseModel):
    rid: str = ""
    name: str
    contact: str
    date: str = ""
    time: str = ""
    note: str = ""
    locale: str = "id"


@api_router.post("/counseling-bookings")
async def create_booking(input: BookingCreate):
    name = _clean(input.name)[:60]
    contact = _clean(input.contact)[:80]
    note = _clean(input.note)[:500]
    if len(name) < 2 or len(contact) < 5:
        raise HTTPException(status_code=400, detail="Name and contact are required")
    doc = {
        "bid": str(uuid.uuid4()),
        "rid": input.rid,
        "name": name,
        "contact": contact,
        "date": input.date[:20],
        "time": input.time[:20],
        "note": note,
        "locale": input.locale if input.locale in ("id", "en") else "id",
        "status": "baru",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.counseling_bookings.insert_one(doc)
    return {"ok": True}


# --- Official PDF report for psychologists ---
@api_router.get("/reflection-results/{rid}/report.pdf")
async def reflection_report_pdf(rid: str):
    doc = await db.reflection_results.find_one({"rid": rid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Result not found")

    import io
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas as rl_canvas
    from reportlab.lib.colors import HexColor

    loc = doc.get("locale", "id")
    if loc not in ("id", "en"):
        loc = "id"
    mode = doc.get("mode", "parent")
    level = doc.get("level", "warm")
    dims = ["warmth", "hostility", "indifference", "rejection"]
    scores = {d: float(doc.get(d, 0)) for d in dims}
    connection = scores["warmth"] + (5 - scores["hostility"]) + (5 - scores["indifference"]) + (5 - scores["rejection"])

    T = {
        "id": {
            "title": "LAPORAN HASIL TES REFLEKSI",
            "platform": "Project Ruang - Instrumen Refleksi Keluarga (LIDM 2026)",
            "meta_mode": "Mode Responden",
            "meta_date": "Tanggal Tes",
            "meta_id": "ID Laporan (anonim)",
            "level_title": "Tingkat Koneksi",
            "dim_title": "Skor per Dimensi IPARTheory (skala 1-4)",
            "interp": "Interpretasi",
            "high": "Tinggi",
            "low": "Rendah",
            "guide_title": "PANDUAN INTERPRETASI UNTUK PSIKOLOG",
            "guide": [
                "Skor koneksi = Kehangatan + (5 - Permusuhan) + (5 - Ketidakpedulian) + (5 - Penolakan).",
                "Tingkat: >= 13 Ruang Hangat | 10-12,9 Ruang Samar | < 10 Ruang Sunyi. Skor Anda: %.1f." % connection,
                "Kehangatan < 2,5 atau dimensi negatif >= 2,5 menandakan area yang perlu dieksplorasi.",
                "Instrumen ini bersifat reflektif-edukatif (bukan diagnosis klinis) dan sedang dalam",
                "proses validasi psikometri. Gunakan sebagai bahan pembuka eksplorasi dalam sesi.",
            ],
            "note_title": "Catatan Dimensi yang Perlu Perhatian",
            "healthy": "Seluruh dimensi berada pada rentang sehat.",
            "disclaimer": "Dokumen ini dihasilkan otomatis oleh platform Project Ruang dan bukan diagnosis klinis.",
            "anon": "Seluruh data responden bersifat anonim; laporan ini tidak memuat identitas pribadi.",
        },
        "en": {
            "title": "REFLECTION TEST RESULT REPORT",
            "platform": "Project Ruang - Family Reflection Instrument (LIDM 2026)",
            "meta_mode": "Respondent Mode",
            "meta_date": "Test Date",
            "meta_id": "Report ID (anonymous)",
            "level_title": "Connection Level",
            "dim_title": "IPARTheory Dimension Scores (1-4 scale)",
            "interp": "Interpretation",
            "high": "High",
            "low": "Low",
            "guide_title": "INTERPRETATION GUIDE FOR PSYCHOLOGISTS",
            "guide": [
                "Connection score = Warmth + (5 - Hostility) + (5 - Indifference) + (5 - Rejection).",
                "Levels: >= 13 Warm Space | 10-12.9 Fading Space | < 10 Silent Room. Score: %.1f." % connection,
                "Warmth < 2.5 or any negative dimension >= 2.5 marks an area worth exploring.",
                "This instrument is reflective-educational (not a clinical diagnosis) and is currently",
                "undergoing psychometric validation. Use it as an opening frame within sessions.",
            ],
            "note_title": "Dimensions Needing Attention",
            "healthy": "All dimensions are within the healthy range.",
            "disclaimer": "This document is automatically generated by the Project Ruang platform and is not a clinical diagnosis.",
            "anon": "All respondent data is anonymous; this report contains no personal identity.",
        },
    }[loc]

    buf = io.BytesIO()
    c = rl_canvas.Canvas(buf, pagesize=A4)
    W, H = A4
    ink = HexColor("#1C1917")
    amber = HexColor("#B45309")
    gray = HexColor("#57534E")
    light = HexColor("#A8A29E")
    sage = HexColor("#5B8A64")
    red = HexColor("#B91C1C")
    level_color = {"warm": sage, "fading": amber, "silent": red}.get(level, amber)

    c.setFillColor(HexColor("#FAF7F2"))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ink)
    c.setFont("Times-Bold", 22)
    c.drawString(50, H - 60, "Ruang.")
    c.setFillColor(amber)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, H - 78, T["title"])
    c.setFillColor(gray)
    c.setFont("Helvetica", 9)
    c.drawString(50, H - 92, T["platform"])
    c.setStrokeColor(HexColor("#E7E0D4"))
    c.line(50, H - 102, W - 50, H - 102)

    y = H - 128
    c.setFont("Helvetica", 9)
    c.setFillColor(light)
    c.drawString(50, y, T["meta_mode"])
    c.drawString(220, y, T["meta_date"])
    c.drawString(390, y, T["meta_id"])
    c.setFillColor(ink)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y - 14, MODE_LABELS[loc].get(mode, mode))
    c.drawString(220, y - 14, str(doc.get("timestamp", ""))[:10])
    c.drawString(390, y - 14, rid[:8])

    y -= 52
    c.setFillColor(light)
    c.setFont("Helvetica", 9)
    c.drawString(50, y, T["level_title"].upper())
    c.setFillColor(level_color)
    c.setFont("Times-Bold", 20)
    c.drawString(50, y - 24, LEVEL_TITLES[loc].get(mode, LEVEL_TITLES[loc]["parent"]).get(level, ""))

    y -= 62
    c.setFillColor(ink)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, T["dim_title"])
    y -= 20
    c.setFont("Helvetica", 9)
    for d in dims:
        v = scores[d]
        concerning = v < 2.5 if d == "warmth" else v >= 2.5
        c.setFillColor(ink)
        c.drawString(50, y, DIM_LABELS[loc][d])
        c.setFillColor(red if concerning else sage)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(320, y, "%.2f / 4" % v)
        c.setFillColor(red if concerning else gray)
        c.setFont("Helvetica", 9)
        c.drawString(390, y, "%s: %s" % (T["interp"], (T["high"] if concerning and d != "warmth" else T["low"]) if concerning else (T["high"] if d == "warmth" else T["low"])))
        c.setStrokeColor(HexColor("#F0EDE8"))
        c.line(50, y - 6, W - 50, y - 6)
        y -= 22

    y -= 14
    c.setFillColor(ink)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, T["note_title"])
    y -= 18
    c.setFont("Helvetica", 9)
    concerning_dims = [d for d in dims if (scores[d] < 2.5 if d == "warmth" else scores[d] >= 2.5)]
    if concerning_dims:
        for d in concerning_dims:
            c.setFillColor(red)
            c.drawString(58, y, "- %s (%.2f/4)" % (DIM_LABELS[loc][d], scores[d]))
            y -= 15
    else:
        c.setFillColor(sage)
        c.drawString(58, y, T["healthy"])
        y -= 15

    y -= 24
    c.setFillColor(HexColor("#F5EFE4"))
    box_h = 24 + 16 * len(T["guide"])
    c.roundRect(50, y - box_h + 14, W - 100, box_h, 8, stroke=0, fill=1)
    c.setFillColor(amber)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(62, y - 6, T["guide_title"])
    c.setFillColor(gray)
    c.setFont("Helvetica", 8.5)
    yy = y - 22
    for line in T["guide"]:
        c.drawString(62, yy, line)
        yy -= 16

    c.setFillColor(light)
    c.setFont("Helvetica", 7.5)
    c.drawString(50, 56, T["disclaimer"])
    c.drawString(50, 44, T["anon"])
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(50, 30, "Project Ruang - LIDM 2026")
    c.save()

    return Response(
        content=buf.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ruang-laporan-{rid[:8]}.pdf"},
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
