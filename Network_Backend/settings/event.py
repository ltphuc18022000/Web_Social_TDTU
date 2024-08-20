from fastapi import FastAPI


def create_start_app_handler(_: FastAPI):
    async def startup_event():
        pass
    return startup_event


def create_stop_app_handler(_: FastAPI):
    async def shutdown_event():
        pass
    return shutdown_event