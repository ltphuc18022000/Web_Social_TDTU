from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware

from api import router as identity_route
from api.third_parties.socket.socket import sio_app
from settings.event import create_start_app_handler, create_stop_app_handler
from settings.init_project import config_system

app = FastAPI(
    title=config_system['PROJECT_NAME'],
    docs_url="/docs",
    openapi_url="/ekyc_openapi.json",
    version=config_system['VERSION']
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=identity_route.router)

app.add_event_handler("startup", create_start_app_handler(app))
app.add_event_handler("shutdown", create_stop_app_handler(app))

app.mount('/', app=sio_app)
