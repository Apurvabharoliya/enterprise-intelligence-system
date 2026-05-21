from fastapi import FastAPI, HTTPException, Body
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
    def fetch_live_news(query, sector):
        encoded_query = urllib.parse.quote(query)
        url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(url)
        articles = []
        for entry in feed.entries[:4]:
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

    gas_news = fetch_live_news("Gas LNG India", "Gas & LNG")
    pharma_news = fetch_live_news("Pharma API India", "Pharma API")
    epc_news = fetch_live_news("EPC Infrastructure India", "EPC & Infra")

    all_articles = gas_news + pharma_news + epc_news
    random.shuffle(all_articles)

    return {
        "digest": {
            "title": "Industrial Intelligence Digest",
            "summary": "AI Summaries show port freight rates declining by 8% next week. Watch out for FDA compliance checks scheduled across Gujarat API synthesis clusters on May 24. Heavy structural JVs in EPC are currently trending bullish."
        },
        "articles": all_articles[:10]
    }

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
@app.get("/api/events")
async def get_events():
    today = datetime.datetime.now()
    events = []

    # Curated realistic events — both past and future
    curated_events = [
        # Past events (completed)
        {"offset": -45, "type": "pharma", "title": "USFDA Pre-Approval Inspection — Halol Unit III", "desc": "The US FDA conducted a 5-day pre-approval inspection at Sun Pharma's Halol Unit III API synthesis facility. Zero Form 483 observations were issued, clearing the unit for commercial exports to regulated markets.", "location": "Halol, Gujarat", "severity": "High"},
        {"offset": -38, "type": "gas", "title": "PNGRB Q1 Tariff Revision Hearing", "desc": "The Petroleum & Natural Gas Regulatory Board held its quarterly tariff revision public hearing covering city gas distribution network charges across 14 geographical areas in Western India.", "location": "New Delhi", "severity": "High"},
        {"offset": -30, "type": "epc", "title": "NHSRCL Bullet Train Viaduct Bid Opening", "desc": "Technical bid envelopes for the Mumbai-Ahmedabad High Speed Rail C-4 viaduct package (₹8,500 Cr) were opened. L&T and Afcons consortium emerged as the two technically qualified bidders.", "location": "Mumbai, Maharashtra", "severity": "High"},
        {"offset": -22, "type": "pharma", "title": "WHO GMP Certification Audit — Dr. Reddy's", "desc": "World Health Organization Good Manufacturing Practice re-certification audit completed at the Srikakulam API facility. Certification renewed for 3 years covering 12 active pharmaceutical ingredients.", "location": "Srikakulam, Andhra Pradesh", "severity": "Medium"},
        {"offset": -15, "type": "gas", "title": "Morbi CGD Network Commissioning Ceremony", "desc": "Adani Total Gas commissioned Phase-2 of the Morbi compressed natural gas distribution network, adding 45 km of steel pipeline and 12 new CNG stations serving the ceramic industrial cluster.", "location": "Morbi, Gujarat", "severity": "Medium"},
        {"offset": -10, "type": "epc", "title": "NHAI NH-48 Expressway Contract Award", "desc": "National Highways Authority awarded the 6-lane access-controlled expressway construction contract worth ₹2,340 Cr to the Dilip Buildcon-HCC joint venture for the Vadodara bypass stretch.", "location": "Vadodara, Gujarat", "severity": "Medium"},
        {"offset": -5, "type": "pharma", "title": "CDSCO New Drug Advisory Committee Meeting", "desc": "Central Drugs Standard Control Organization convened to review 8 new drug applications including 3 novel API formulations from Indian manufacturers targeting oncology and rare disease segments.", "location": "New Delhi", "severity": "High"},
        {"offset": -2, "type": "gas", "title": "GAIL Eastern Grid Pipeline Integrity Audit", "desc": "Third-party pipeline integrity assessment completed for the 1,200 km Jagdishpur-Haldia-Bokaro-Dhamra natural gas pipeline covering corrosion monitoring, cathodic protection, and weld integrity checks.", "location": "Kolkata, West Bengal", "severity": "Medium"},
        # Future events (upcoming)
        {"offset": 3, "type": "epc", "title": "Metro Rail Phase IV DPR Review — Chennai", "desc": "Chennai Metro Rail Limited presents the Detailed Project Report for the 118 km Phase IV network expansion to the Ministry of Housing & Urban Affairs for final approval and budgetary allocation.", "location": "Chennai, Tamil Nadu", "severity": "High"},
        {"offset": 7, "type": "pharma", "title": "Biocon Biologics — EMA Inspection Schedule", "desc": "European Medicines Agency inspectors scheduled to conduct a 4-day GMP compliance audit at Biocon's Bengaluru biologics manufacturing campus covering monoclonal antibody production lines.", "location": "Bengaluru, Karnataka", "severity": "High"},
        {"offset": 12, "type": "gas", "title": "PPAC Monthly Gas Consumption Report Release", "desc": "Petroleum Planning & Analysis Cell releases the monthly domestic natural gas consumption and import statistics report covering sectoral allocation data for power, fertilizer, CGD, and industrial segments.", "location": "New Delhi", "severity": "Medium"},
        {"offset": 18, "type": "epc", "title": "Sagarmala Port Modernization Tender Deadline", "desc": "Last date for submission of technical and financial bids for the Paradip Port inner harbour deepening and mechanization project under the Sagarmala programme, estimated at ₹1,800 Cr.", "location": "Paradip, Odisha", "severity": "High"},
        {"offset": 25, "type": "pharma", "title": "India Pharma & Medical Device Expo 2026", "desc": "Annual flagship industry exhibition organized by FICCI and Department of Pharmaceuticals, featuring 400+ exhibitors, B2B meetings, and policy roundtables on API self-sufficiency and PLI scheme progress.", "location": "Pragati Maidan, New Delhi", "severity": "Medium"},
        {"offset": 35, "type": "gas", "title": "CGD 12th Round Bidding Results Announcement", "desc": "PNGRB announces the results of the 12th CGD bidding round covering 65 geographical areas. Key contenders include GAIL Gas, Adani Total Gas, and Torrent Gas for Northeast and Eastern India territories.", "location": "New Delhi", "severity": "High"},
        {"offset": 42, "type": "epc", "title": "DMRC Yellow Line Extension Pre-Bid Conference", "desc": "Delhi Metro Rail Corporation hosts mandatory pre-bid conference for the 12 km Yellow Line southern extension covering underground and elevated sections, with estimated project cost of ₹6,200 Cr.", "location": "New Delhi", "severity": "Medium"},
        {"offset": 55, "type": "pharma", "title": "NPPA Drug Price Ceiling Quarterly Review", "desc": "National Pharmaceutical Pricing Authority conducts its quarterly review of ceiling prices for 856 scheduled drug formulations under the Drug Price Control Order, potentially impacting API procurement costs.", "location": "New Delhi", "severity": "High"},
        {"offset": 70, "type": "gas", "title": "Kochi LNG Terminal Phase-III Expansion Groundbreaking", "desc": "Petronet LNG ceremonial groundbreaking for the 2.5 MTPA capacity expansion at the Kochi LNG import terminal, including new regasification trains and jetty infrastructure upgrades.", "location": "Kochi, Kerala", "severity": "High"},
        {"offset": 90, "type": "epc", "title": "Smart Cities Mission — Final Review Summit", "desc": "Ministry of Housing & Urban Affairs hosts the final comprehensive review of all 100 Smart Cities Mission projects covering completion status, fund utilization, and handover protocols to urban local bodies.", "location": "New Delhi", "severity": "Medium"},
        {"offset": 120, "type": "pharma", "title": "PLI Scheme Phase-II API Manufacturing Review", "desc": "Department of Pharmaceuticals conducts mid-term review of the Production Linked Incentive scheme for bulk drug manufacturing, covering 35 approved projects with committed investments of ₹15,000 Cr.", "location": "New Delhi", "severity": "High"},
        {"offset": 150, "type": "gas", "title": "National Gas Grid — Eastern Corridor Completion Target", "desc": "Target completion date for the Barauni-Guwahati section of the National Gas Grid eastern corridor, a 729 km pipeline project executed by GAIL with an investment of ₹5,900 Cr.", "location": "Guwahati, Assam", "severity": "High"},
    ]

    for i, evt in enumerate(curated_events):
        event_date = today + datetime.timedelta(days=evt["offset"])
        status = "Completed" if evt["offset"] < 0 else "Upcoming"
        events.append({
            "id": i + 1,
            "day": event_date.day,
            "title": evt["title"],
            "type": evt["type"],
            "severity": evt["severity"],
            "date": event_date.strftime('%Y-%m-%d'),
            "desc": evt["desc"],
            "location": evt.get("location", "India"),
            "status": status
        })

    return events

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
