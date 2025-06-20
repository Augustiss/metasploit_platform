from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users, tasks, progress  # Add progress import

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://161.35.18.245:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])  # Add this line

@app.get("/")
async def root():
    return {"status": "API is running"}