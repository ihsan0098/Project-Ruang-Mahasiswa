from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


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


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

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
    doc["timestamp"] = datetime.now(timezone.utc).isoformat()
    await db.reflection_results.insert_one(doc)
    return {"ok": True}

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

    return {
        "count": len(docs),
        "levels": levels,
        "averages": averages(docs),
        "parentAverages": averages(parents),
        "sonAverages": averages(sons),
        "modes": {"parent": len(parents), "son": len(sons)},
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()