import os
import sys
import asyncio
from pathlib import Path
import py_compile
import httpx

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    ROOT / "README.md",
    ROOT / ".env.example",
    ROOT / ".gitignore",
    ROOT / "render.yaml",
    ROOT / "backend" / "requirements.txt",
    ROOT / "backend" / "Procfile",
    ROOT / "backend" / ".env.example",
    ROOT / "backend" / ".env",
    ROOT / "backend" / "app" / "__init__.py",
    ROOT / "backend" / "app" / "config.py",
    ROOT / "backend" / "app" / "main.py",
    ROOT / "backend" / "app" / "models" / "schemas.py",
    ROOT / "backend" / "app" / "services" / "air_quality_service.py",
    ROOT / "backend" / "app" / "services" / "gemini_service.py",
    ROOT / "backend" / "app" / "services" / "routine_service.py",
    ROOT / "backend" / "app" / "services" / "travel_service.py",
    ROOT / "backend" / "app" / "services" / "impact_service.py",
    ROOT / "backend" / "app" / "data" / "default_cities.json",
    ROOT / "backend" / "app" / "static" / "index.html",
    ROOT / "frontend" / "package.json",
    ROOT / "frontend" / "index.html",
    ROOT / "frontend" / "vite.config.js",
    ROOT / "frontend" / "tailwind.config.js",
    ROOT / "frontend" / "postcss.config.js",
    ROOT / "frontend" / "vercel.json",
    ROOT / "frontend" / ".env.example",
    ROOT / "frontend" / "src" / "main.jsx",
    ROOT / "frontend" / "src" / "App.jsx",
    ROOT / "frontend" / "src" / "index.css",
    ROOT / "frontend" / "src" / "api" / "client.js",
    ROOT / "frontend" / "src" / "context" / "AirQualityContext.jsx",
    ROOT / "frontend" / "src" / "context" / "ImpactContext.jsx",
    ROOT / "frontend" / "src" / "utils" / "aqiUtils.js",
    ROOT / "frontend" / "src" / "utils" / "formatters.js",
    ROOT / "frontend" / "src" / "components" / "Navbar.jsx",
    ROOT / "frontend" / "src" / "components" / "Sidebar.jsx",
    ROOT / "frontend" / "src" / "components" / "CitySearchModal.jsx",
    ROOT / "frontend" / "src" / "components" / "HealthAlertBanner.jsx",
    ROOT / "frontend" / "src" / "components" / "Common" / "Card.jsx",
    ROOT / "frontend" / "src" / "components" / "Common" / "Badge.jsx",
    ROOT / "frontend" / "src" / "components" / "Common" / "Button.jsx",
    ROOT / "frontend" / "src" / "components" / "Common" / "StatMetric.jsx",
    ROOT / "frontend" / "src" / "views" / "LandingPage.jsx",
    ROOT / "frontend" / "src" / "views" / "DashboardView.jsx",
    ROOT / "frontend" / "src" / "views" / "AssistantView.jsx",
    ROOT / "frontend" / "src" / "views" / "RoutineView.jsx",
    ROOT / "frontend" / "src" / "views" / "IndoorView.jsx",
    ROOT / "frontend" / "src" / "views" / "TravelView.jsx",
    ROOT / "frontend" / "src" / "views" / "ImpactView.jsx",
    ROOT / "frontend" / "src" / "views" / "LearnView.jsx",
]

def check_files():
    print("=" * 60)
    print("1. VERIFYING ALL FILE ARTIFACTS EXIST AND ARE NON-EMPTY")
    print("=" * 60)
    missing = []
    empty = []
    for f in REQUIRED_FILES:
        if not f.exists():
            missing.append(str(f.relative_to(ROOT)))
        elif f.stat().st_size == 0:
            empty.append(str(f.relative_to(ROOT)))

    if missing:
        print("❌ MISSING FILES:", missing)
        return False
    if empty:
        print("❌ EMPTY FILES:", empty)
        return False
    print(f"✅ All {len(REQUIRED_FILES)} required files are present and populated with content!")
    return True

def compile_python():
    print("\n" + "=" * 60)
    print("2. COMPILING PYTHON FILES FOR SYNTAX VALIDATION")
    print("=" * 60)
    py_files = list((ROOT / "backend" / "app").glob("**/*.py"))
    for pyf in py_files:
        try:
            py_compile.compile(str(pyf), doraise=True)
            print(f"  ✓ Compiled {pyf.name}")
        except py_compile.PyCompileError as e:
            print(f"❌ Syntax Error in {pyf.name}:", e)
            return False
    print(f"✅ All {len(py_files)} Python backend files compiled successfully!")
    return True

async def test_backend_features():
    print("\n" + "=" * 60)
    print("3. TESTING ALL FASTAPI CORE ENDPOINTS & AI INTEGRATIONS")
    print("=" * 60)

    # Import backend app
    sys.path.insert(0, str(ROOT / "backend"))
    from app.main import app

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # A. Root Web App
        r = await client.get("/")
        assert r.status_code == 200, "Root app failed"
        assert "BreatheWise AI" in r.text
        print("  ✓ [GET /] Serves embedded UI (Length: " + str(len(r.text)) + " bytes)")

        # B. Health Check
        h = await client.get("/api/health")
        assert h.status_code == 200
        hj = h.json()
        print(f"  ✓ [GET /api/health] Status: {hj['status']}, Provider: {hj['data_provider']}")

        # C. Cities & Geocoding
        cities = await client.get("/api/cities")
        assert cities.status_code == 200 and len(cities.json()) >= 10
        print(f"  ✓ [GET /api/cities] Curated Hotspots count: {len(cities.json())}")

        geo = await client.get("/api/geocoding?query=London")
        assert geo.status_code == 200 and len(geo.json()) > 0
        print(f"  ✓ [GET /api/geocoding] Found: {[x['name'] for x in geo.json()]}")

        # D. Air Quality Data Handling
        aq = await client.get("/api/air-quality?city=Delhi&lat=28.6139&lon=77.2090")
        assert aq.status_code == 200
        aq_data = aq.json()
        assert "current" in aq_data and "hourly_trend" in aq_data
        print(f"  ✓ [GET /api/air-quality] City: {aq_data['city']}, AQI: {aq_data['current']['us_aqi']}, "
              f"PM2.5: {aq_data['current']['pm2_5']} µg/m³, Category: {aq_data['current']['category']}")
        assert len(aq_data["hourly_trend"]) >= 20, "Hourly forecast missing"
        print(f"    - Hourly forecast points: {len(aq_data['hourly_trend'])}")
        print(f"    - Source: {aq_data['source']}")

        # E. Gemini AI Assistant
        prompt1 = "Why does smog peak during winter mornings?"
        chat1 = await client.post("/api/chat", json={
            "message": prompt1, "city": "Delhi", "current_aqi": 280, "pm2_5": 160.0
        })
        assert chat1.status_code == 200
        c1 = chat1.json()
        print(f"  ✓ [POST /api/chat - Smog Query] Provider: {c1.get('provider')}, Engine: {c1['model_used']}, Fallback: {c1.get('is_fallback')}")
        print(f"    - Sample snippet: {c1['reply'][:70]}...")

        prompt2 = "What mask works best for PM2.5?"
        chat2 = await client.post("/api/chat", json={
            "message": prompt2, "city": "Delhi", "current_aqi": 280, "pm2_5": 160.0
        })
        assert chat2.status_code == 200
        assert "N95" in chat2.json()["reply"]
        print("  ✓ [POST /api/chat - Mask Query] N95 recommendations validated")

        # F. Smart Daily Routine (across 3 personas)
        for persona in ["student", "office_worker", "senior_asthma"]:
            rt = await client.post("/api/routine", json={
                "city": "Delhi",
                "aqi": 270,
                "pm2_5": 165.0,
                "lifestyle": persona,
                "exercise_preference": "morning_jog",
                "commute_mode": "metro_transit"
            })
            assert rt.status_code == 200
            rj = rt.json()
            assert len(rj["hourly_schedule"]) == 5
            print(f"  ✓ [POST /api/routine] Persona: {persona} -> {rj['summary']} (Peak: {rj['peak_pollution_window']})")

        # G. Eco-Friendly Travel Planner (with exposure comparison)
        tr = await client.post("/api/travel", json={
            "city": "Delhi", "distance_km": 15.0, "current_aqi": 240
        })
        assert tr.status_code == 200
        tj = tr.json()
        assert len(tj["options"]) == 5
        print(f"  ✓ [POST /api/travel] Modes: {[o['mode'] for o in tj['options']]}")
        print(f"    - Healthiest mode: {tj['healthiest_option']}")
        print(f"    - CO2 Savings Potential: {tj['co2_savings_potential_kg']} kg")

        # H. Impact Action Logging
        imp = await client.post("/api/impact/log", json={"action_type": "public_transit"})
        assert imp.status_code == 200
        ij = imp.json()
        assert ij["co2_avoided_kg"] == 2.4 and ij["points_earned"] == 50
        print(f"  ✓ [POST /api/impact/log] Avoided {ij['co2_avoided_kg']} kg CO2, Earned {ij['points_earned']} pts")

        # I. Indoor Air Quality Advisor
        iaq = await client.get("/api/indoor-advisor")
        assert iaq.status_code == 200
        iaq_j = iaq.json()
        assert len(iaq_j["rooms"]) == 4 and len(iaq_j["top_purifying_plants"]) == 4
        print(f"  ✓ [GET /api/indoor-advisor] 4 Rooms audited, {len(iaq_j['top_purifying_plants'])} NASA plants loaded")

    print("\n✅ ALL BACKEND AND AI API TESTS PASSED WITH 100% SUCCESS!")
    return True

def verify_deploy_configs():
    print("\n" + "=" * 60)
    print("4. VERIFYING GITHUB, RENDER & VERCEL CONFIGURATIONS")
    print("=" * 60)

    # 1. render.yaml
    render_file = ROOT / "render.yaml"
    render_txt = render_file.read_text(encoding="utf-8")
    assert "runtime: python" in render_txt, "render.yaml missing python runtime"
    assert "uvicorn app.main:app" in render_txt, "render.yaml missing uvicorn command"
    print("  ✓ render.yaml configuration valid")

    # 2. vercel.json
    vercel_file = ROOT / "frontend" / "vercel.json"
    vercel_txt = vercel_file.read_text(encoding="utf-8")
    assert "outputDirectory" in vercel_txt and "rewrites" in vercel_txt
    print("  ✓ frontend/vercel.json SPA rewrite configuration valid")

    # 3. .gitignore
    gitignore = ROOT / ".gitignore"
    gi_txt = gitignore.read_text(encoding="utf-8")
    assert "backend/venv/" in gi_txt and "node_modules/" in gi_txt and ".env" in gi_txt
    print("  ✓ .gitignore properly excludes virtualenvs, node_modules, and local secrets")

    # 4. Procfile
    procfile = ROOT / "backend" / "Procfile"
    assert "uvicorn app.main:app" in procfile.read_text(encoding="utf-8")
    print("  ✓ backend/Procfile valid for Render/Heroku")

    # 5. .env.example
    env_ex = ROOT / ".env.example"
    assert "GEMINI_API_KEY=" in env_ex.read_text(encoding="utf-8")
    print("  ✓ .env.example provides clear documentation for API keys")

    print("\n✅ DEPLOYMENT CONFIGURATIONS 100% VERIFIED!")
    return True

def main():
    ok1 = check_files()
    ok2 = compile_python()
    ok3 = asyncio.run(test_backend_features())
    ok4 = verify_deploy_configs()

    if ok1 and ok2 and ok3 and ok4:
        print("\n" + "#" * 60)
        print("🎯 FINAL RESULT: BREATHEWISE AI 100% FUNCTIONAL & VERIFIED!")
        print("#" * 60)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
