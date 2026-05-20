from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(
    title="IntelliSector API Core",
    description="Enterprise Intelligence Pipeline API for Gas, EPC, and Pharma sectors.",
    version="1.1.0"
)

# CORS Enablement
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
@app.get("/api/news")
async def get_news_feed():
    return {
        "digest": {
            "title": "Industrial Intelligence Digest",
            "summary": "AI Summaries show port freight rates declining by 8% next week. Watch out for FDA compliance checks scheduled across Gujarat API synthesis clusters on May 24. Heavy structural JVs in EPC are currently trending bullish."
        },
        "articles": [
          {
            "id": "NWS-872",
            "title": "Morbi Ceramic Cluster Demands 15% Gas Supply Increase",
            "sector": "Gas & LNG",
            "sentiment": "Bullish",
            "summary": "Local city gas providers are requesting emergency pipeline load increases from the Central grid. High logistics demand pushes regional tariffs.",
            "source": "PNGRB Watcher",
            "time": "40 mins ago"
          },
          {
            "id": "NWS-871",
            "title": "Sun Pharma Halol API Plant Concludes Clean Audit",
            "sector": "Pharma API",
            "sentiment": "Bullish",
            "summary": "FDA regulatory officers concluded a 5-day procedural inspection with zero critical form 483 warnings. Unit remains at highest compliance level.",
            "source": "FDA Sentinel",
            "time": "2 hours ago"
          },
          {
            "id": "NWS-870",
            "title": "L&T Emerges as Lowest Bidder for Hydrological Power Unit",
            "sector": "EPC & Infra",
            "sentiment": "Bullish",
            "summary": "The civil infrastructure giant submitted a ₹3,140 Crore bid for regional hydrological water corridor projects in Maharashtra. Bidding competitors trailing by 8%.",
            "source": "NHPC Tenders",
            "time": "4 hours ago"
          }
        ]
    }

# 2. Bidding & Tenders Endpoint
@app.get("/api/tenders")
async def get_tenders():
    return [
      { "id": "TEN-9081", "title": "Gujarat Pipeline Grid Addition Phase 2", "sector": "Gas & LNG", "region": "Western Region", "value": "₹1,500 Cr", "status": "Under Evaluation", "deadline": "May 25, 2026" },
      { "id": "TEN-9082", "title": "Halol API Biosafety Level-3 Expansion", "sector": "Pharma API", "region": "Southern Region", "value": "₹375 Cr", "status": "Bidding Open", "deadline": "Jun 12, 2026" },
      { "id": "TEN-9083", "title": "National Bullet Train Corridor Engineering JV", "sector": "EPC & Infra", "region": "Northern Region", "value": "₹10,000 Cr", "status": "Contract Awarded", "deadline": "Concluded" },
      { "id": "TEN-9084", "title": "Morbi Compressed Bio-Gas Grid Setup", "sector": "Gas & LNG", "region": "Western Region", "value": "₹540 Cr", "status": "Bidding Open", "deadline": "Jun 04, 2026" }
    ]

# 3. Events Timeline Endpoint
@app.get("/api/events")
async def get_events():
    return [
      { "day": 12, "title": "FDA Halol Facility Audit Concludes", "type": "pharma", "severity": "High" },
      { "day": 18, "title": "PNGRB Tariff Hearing Grid Additions", "type": "gas", "severity": "Medium" },
      { "day": 24, "title": "Gujarat Hydrogen Cracker Bids Open", "type": "epc", "severity": "High" }
    ]

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
