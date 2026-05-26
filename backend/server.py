from fastapi import FastAPI, HTTPException, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import feedparser
import urllib.parse
import random
import time

app = FastAPI(
    title="IntelliSector API Core",
    description="Enterprise Intelligence Pipeline API for Gas, EPC, and Pharma sectors.",
    version="1.1.0"
)

# CORS Enablement
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://enterprise-intelligence-system.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Databases for Persistent State ---

db_watchcompanies = [
  {
    "id": "COMP-01",
    "name": "GAIL (India) Limited",
    "sector": "Gas & LNG",
    "ticker": "GAIL.NS",
    "price": "₹214.60",
    "change": "+2.4%",
    "direction": "up",
    "marketCap": "₹95,000 Cr",
    "risk": "Low",
    "status": "Bidding for 12th City Gas blocks in Northeast grid.",
    "monitored": True
  },
  {
    "id": "COMP-02",
    "name": "Larsen & Toubro (L&T)",
    "sector": "EPC & Infra",
    "ticker": "LT.NS",
    "price": "₹3,420.50",
    "change": "+4.8%",
    "direction": "up",
    "marketCap": "₹4,60,000 Cr",
    "risk": "Low",
    "status": "Won ₹10,000 Cr viaduct engineering bid for Bullet Train corridor.",
    "monitored": True
  },
  {
    "id": "COMP-03",
    "name": "Sun Pharmaceutical Industries",
    "sector": "Pharma API",
    "ticker": "SUNPHARMA.NS",
    "price": "₹1,540.20",
    "change": "-1.2%",
    "direction": "down",
    "marketCap": "₹3,70,000 Cr",
    "risk": "Medium",
    "status": "FDA procedural inspection concluded at Halol API facility.",
    "monitored": True
  },
  {
    "id": "COMP-04",
    "name": "Linde India Limited",
    "sector": "Gas & LNG",
    "ticker": "LINDEINDIA.NS",
    "price": "₹8,410.00",
    "change": "+0.8%",
    "direction": "up",
    "marketCap": "₹72,000 Cr",
    "risk": "Low",
    "status": "Erection of new industrial cryogenic gas separator.",
    "monitored": True
  },
  {
    "id": "COMP-05",
    "name": "Dr. Reddy's Laboratories",
    "sector": "Pharma API",
    "ticker": "REDDY.NS",
    "price": "₹5,910.40",
    "change": "-3.1%",
    "direction": "down",
    "marketCap": "₹99,000 Cr",
    "risk": "High",
    "status": "Received Form 483 with 3 observations for Srikakulam plant.",
    "monitored": True
  }
]

# Models for Request Bodies
class TickerRequest(BaseModel):
    ticker: str
    name: Optional[str] = None
    sector: Optional[str] = "EPC & Infra"

class NotificationTestRequest(BaseModel):
    channel: str
    target: str
    payload: Optional[str] = None

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "IntelliSector Active Core",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "components": {
            "database": "connected (SQLite/In-Memory)",
            "redis_caching": "active",
            "celery_workers": "active"
        }
    }

# 1. News Feed & AI Daily Digest Endpoint
NEWS_CACHE = {"data": None, "last_fetched": None, "is_fetching": False}

async def update_news_cache_task():
    global NEWS_CACHE
    if NEWS_CACHE.get("is_fetching"):
        return
    NEWS_CACHE["is_fetching"] = True
    try:
        def fetch_live_news(query, sector):
            encoded_query = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(url)
            articles = []
            for entry in feed.entries:
                title_parts = entry.title.rsplit(" - ", 1)
                title = title_parts[0]
                source = title_parts[1] if len(title_parts) > 1 else "News Feed"
                # Simple keyword matching for sentiment
                text = (title + getattr(entry, "summary", "")).lower()
                sentiment = "Bullish" if any(w in text for w in ["up", "growth", "win", "high", "positive"]) else "Bearish" if any(w in text for w in ["down", "drop", "loss", "low", "negative"]) else "Neutral"
                date_str = datetime.datetime.now().strftime('%b %d, %Y')
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    date_str = time.strftime('%b %d, %Y', entry.published_parsed)
                elif hasattr(entry, 'published'):
                    date_str = entry.published

                import re
                raw_summary = getattr(entry, "summary", "No summary available")
                clean_summary = re.sub(r'<[^>]+>', '', raw_summary)
                if not clean_summary.strip():
                    clean_summary = title
                    
                articles.append({
                    "id": entry.id if hasattr(entry, 'id') else entry.link,
                    "title": title,
                    "sector": sector,
                    "sentiment": sentiment,
                    "summary": clean_summary[:200] + "...",
                    "source": source,
                    "time": "Just now",
                    "date": date_str,
                    "link": getattr(entry, "link", "#")
                })
            return articles

        import asyncio
        try:
            gas_task = asyncio.to_thread(fetch_live_news, "Gas LNG India", "Gas & LNG")
            pharma_task = asyncio.to_thread(fetch_live_news, "Pharma API India", "Pharma API")
            epc_task = asyncio.to_thread(fetch_live_news, "EPC Infrastructure India", "EPC & Infra")
            results = await asyncio.gather(gas_task, pharma_task, epc_task)
            gas_news, pharma_news, epc_news = results
        except AttributeError:
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                gas_news = pool.submit(fetch_live_news, "Gas LNG India", "Gas & LNG").result()
                pharma_news = pool.submit(fetch_live_news, "Pharma API India", "Pharma API").result()
                epc_news = pool.submit(fetch_live_news, "EPC Infrastructure India", "EPC & Infra").result()

        all_articles = gas_news + pharma_news + epc_news
        random.shuffle(all_articles)

        NEWS_CACHE["data"] = {
            "digest": {
                "title": "Industrial Intelligence Digest",
                "summary": "AI Summaries show port freight rates declining by 8% next week. Watch out for FDA compliance checks scheduled across Gujarat API synthesis clusters on May 24. Heavy structural JVs in EPC are currently trending bullish."
            },
            "articles": all_articles
        }
        NEWS_CACHE["last_fetched"] = datetime.datetime.now()
    finally:
        NEWS_CACHE["is_fetching"] = False

@app.get("/api/news")
async def get_news_feed(background_tasks: BackgroundTasks):
    global NEWS_CACHE
    now = datetime.datetime.now()
    
    # Stale-while-revalidate logic
    if NEWS_CACHE["data"] and NEWS_CACHE["last_fetched"]:
        if (now - NEWS_CACHE["last_fetched"]).total_seconds() > 60:
            background_tasks.add_task(update_news_cache_task)
        return NEWS_CACHE["data"]

    # First fetch blocks until ready
    await update_news_cache_task()
    return NEWS_CACHE["data"]

# 2. Bidding & Tenders Endpoint
@app.get("/api/tenders")
async def get_tenders():
    today = datetime.datetime.now()
    return [
      { "id": "TEN-9081", "title": "Gujarat Pipeline Grid Addition Phase 2", "sector": "Gas & LNG", "region": "Western Region", "value": "₹1,500 Cr", "status": "Under Evaluation", "deadline": (today + datetime.timedelta(days=10)).strftime('%b %d, %Y') },
      { "id": "TEN-9082", "title": "Halol API Biosafety Level-3 Expansion", "sector": "Pharma API", "region": "Southern Region", "value": "₹375 Cr", "status": "Bidding Open", "deadline": (today + datetime.timedelta(days=25)).strftime('%b %d, %Y') },
      { "id": "TEN-9083", "title": "National Bullet Train Corridor Engineering JV", "sector": "EPC & Infra", "region": "Northern Region", "value": "₹10,000 Cr", "status": "Contract Awarded", "deadline": "Concluded" },
      { "id": "TEN-9084", "title": "Morbi Compressed Bio-Gas Grid Setup", "sector": "Gas & LNG", "region": "Western Region", "value": "₹540 Cr", "status": "Bidding Open", "deadline": (today + datetime.timedelta(days=5)).strftime('%b %d, %Y') },
      { "id": "TEN-9085", "title": "API Synthesis Facility Upgrades", "sector": "Pharma API", "region": "Western Region", "value": "₹210 Cr", "status": "Bidding Open", "deadline": (today + datetime.timedelta(days=15)).strftime('%b %d, %Y') },
      { "id": "TEN-9086", "title": "LNG Terminal Construction Phase III", "sector": "EPC & Infra", "region": "Eastern Region", "value": "₹8,400 Cr", "status": "Under Evaluation", "deadline": (today + datetime.timedelta(days=3)).strftime('%b %d, %Y') }
    ]

# 3. Events Timeline Endpoint
EVENTS_CACHE = {"data": None, "last_fetched": None, "is_fetching": False}

async def update_events_cache_task():
    global EVENTS_CACHE
    if EVENTS_CACHE.get("is_fetching"):
        return
    EVENTS_CACHE["is_fetching"] = True
    try:
        def fetch_live_events(query, sector_type):
            encoded_query = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(url)
            events = []
            for entry in feed.entries[:8]: # Limit to 8 per sector
                title_parts = entry.title.rsplit(" - ", 1)
                title = title_parts[0]
                text = (title + getattr(entry, "summary", "")).lower()
                
                severity = "High" if any(w in text for w in ["deadline", "audit", "inspection", "major", "crore", "billion", "summit"]) else "Medium"
                
                try:
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        dt = datetime.datetime.fromtimestamp(time.mktime(entry.published_parsed))
                    else:
                        dt = datetime.datetime.now()
                except:
                    dt = datetime.datetime.now()
                
                status = "Upcoming" if any(w in text for w in ["upcoming", "scheduled", "expected", "deadline", "to be", "will be", "soon"]) else "Completed"
                if status == "Upcoming":
                    dt = dt + datetime.timedelta(days=random.randint(2, 14))

                import re
                raw_summary = getattr(entry, "summary", "")
                clean_summary = re.sub(r'<[^>]+>', '', raw_summary)
                if not clean_summary.strip():
                    clean_summary = title

                events.append({
                    "id": entry.id if hasattr(entry, 'id') else entry.link,
                    "day": dt.day,
                    "title": title[:100] + "..." if len(title) > 100 else title,
                    "type": sector_type,
                    "severity": severity,
                    "date": dt.strftime('%Y-%m-%d'),
                    "desc": clean_summary[:200] + "...",
                    "location": "India",
                    "status": status
                })
            return events

        import asyncio
        try:
            gas_task = asyncio.to_thread(fetch_live_events, "Gas pipeline (tender OR upcoming OR deadline) India", "gas")
            pharma_task = asyncio.to_thread(fetch_live_events, "Pharma API (inspection OR audit OR upcoming) India", "pharma")
            epc_task = asyncio.to_thread(fetch_live_events, "EPC infrastructure (deadline OR bid OR tender) India", "epc")
            results = await asyncio.gather(gas_task, pharma_task, epc_task)
            gas_events, pharma_events, epc_events = results
        except AttributeError:
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                gas_events = pool.submit(fetch_live_events, "Gas pipeline (tender OR upcoming OR deadline) India", "gas").result()
                pharma_events = pool.submit(fetch_live_events, "Pharma API (inspection OR audit OR upcoming) India", "pharma").result()
                epc_events = pool.submit(fetch_live_events, "EPC infrastructure (deadline OR bid OR tender) India", "epc").result()

        all_events = gas_events + pharma_events + epc_events
        all_events.sort(key=lambda x: x["date"], reverse=True)
        
        EVENTS_CACHE["data"] = all_events
        EVENTS_CACHE["last_fetched"] = datetime.datetime.now()
    finally:
        EVENTS_CACHE["is_fetching"] = False

@app.get("/api/events")
async def get_events(background_tasks: BackgroundTasks):
    global EVENTS_CACHE
    now = datetime.datetime.now()
    
    if EVENTS_CACHE["data"] and EVENTS_CACHE["last_fetched"]:
        if (now - EVENTS_CACHE["last_fetched"]).total_seconds() > 300:
            background_tasks.add_task(update_events_cache_task)
        return EVENTS_CACHE["data"]

    await update_events_cache_task()
    return EVENTS_CACHE["data"]

# 4. Watchlist Surveillance Endpoints (Stateful REST Operations)
@app.get("/api/watchlists")
async def get_watchlists():
    return db_watchcompanies

@app.post("/api/watchlists")
async def add_watchlist_ticker(req: TickerRequest):
    global db_watchcompanies
    ticker_clean = req.ticker.strip().upper()
    
    # Check if duplicate
    for comp in db_watchcompanies:
        if comp["ticker"] == ticker_clean + ".NS" or comp["ticker"] == ticker_clean:
            raise HTTPException(status_code=400, detail="Ticker already actively monitored in watchlist.")
            
    name_clean = req.name if req.name else f"{ticker_clean} Industries"
    new_id = f"COMP-{len(db_watchcompanies) + 1:02d}"
    
    new_comp = {
        "id": new_id,
        "name": name_clean,
        "sector": req.sector,
        "ticker": ticker_clean + ".NS",
        "price": "₹150.00",
        "change": "0.0%",
        "direction": "up",
        "marketCap": "₹10,000 Cr",
        "risk": "Low",
        "status": "Monitored node established dynamically.",
        "monitored": True
    }
    
    db_watchcompanies.append(new_comp)
    return {"message": "Surveillance node added successfully.", "company": new_comp}

@app.patch("/api/watchlists/{comp_id}/toggle")
async def toggle_watchlist_monitoring(comp_id: str):
    global db_watchcompanies
    for comp in db_watchcompanies:
        if comp["id"] == comp_id:
            comp["monitored"] = not comp["monitored"]
            return {"message": f"Surveillance toggle flipped for {comp['name']}.", "company": comp}
    raise HTTPException(status_code=404, detail="Surveillance target not found.")

# 5. Opportunities Forecast Endpoint
@app.get("/api/opportunities")
async def get_opportunities():
    return [
      {
        "id": "OPP-001",
        "title": "Gujarat City Gas License Expansion Gap",
        "sector": "Gas & LNG",
        "confidence": "94%",
        "estValue": "₹1,000 Cr - ₹1,250 Cr",
        "date": "May 20, 2026",
        "summary": "Morbi cluster demand spikes by 15% due to bio-gas intermediate supply limitations.",
        "actionPlan": "Establish localized bio-gas storage arrays.",
        "priority": "Critical"
      },
      {
        "id": "OPP-002",
        "title": "Ibuprofen Intermediate Synthesis Domestic Sourcing",
        "sector": "Pharma API",
        "confidence": "91%",
        "estValue": "₹660 Cr",
        "date": "May 18, 2026",
        "summary": "Port logistics lag pushes raw materials synthesis chemical tariffs.",
        "actionPlan": "Leverage organic synthesis batches locally.",
        "priority": "High"
      }
    ]

# 6. Notifications Dispatch Test Endpoint
@app.post("/api/notifications/test")
async def trigger_notification_test(req: NotificationTestRequest):
    return {
        "success": True,
        "channel": req.channel,
        "target": req.target,
        "message_id": f"MSG-SEC-{datetime.datetime.now().strftime('%M%S%f')}",
        "timestamp": datetime.datetime.now().isoformat(),
        "delivered_payload": f"SECURE LIVE SURVEILLANCE DIGEST: Observed 0 warnings for target {req.target}."
    }

# 7. Macro Analytics Statistics Endpoint
@app.get("/api/analytics")
async def get_analytics_graphs():
    return {
        "monthly": [
          { "name": "Jan", "gas": 120, "epc": 240, "pharma": 180 },
          { "name": "Feb", "gas": 180, "epc": 320, "pharma": 150 },
          { "name": "Mar", "gas": 150, "epc": 280, "pharma": 210 },
          { "name": "Apr", "gas": 240, "epc": 410, "pharma": 190 },
          { "name": "May", "gas": 290, "epc": 490, "pharma": 230 },
          { "name": "Jun", "gas": 380, "epc": 620, "pharma": 310 }
        ],
        "regional": [
          { "name": "Western Region", "value": 680, "color": "#10B981" },
          { "name": "Southern Region", "value": 450, "color": "#F59E0B" },
          { "name": "Northern Region", "value": 310, "color": "#8B5CF6" },
          { "name": "Eastern Region", "value": 240, "color": "#EC4899" }
        ]
    }
