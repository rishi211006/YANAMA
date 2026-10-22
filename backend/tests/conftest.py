import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from app.core.database import Base, engine, SessionLocal
from app.simulator.sample_generator import seed_complete_demo_data

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_complete_demo_data(db)
    finally:
        db.close()
