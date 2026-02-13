from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import status
from pydantic import BaseModel, Field
import logging
import traceback
import openai
from agent import main
from schemas import ResolveQuery, AgentState
import asyncio
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
app = FastAPI(title="Walkthrough System")
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception: {exc}")
    logger.error(traceback.format_exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal Server Error", "details": str(exc)}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request:Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc}")
    body = await request.body()
    logger.error(f"Request body: {body.decode()}")
    return JSONResponse(
        status_code = status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"message": "Validation Error", "details": str(exc), "tip": "Ensure you are sending a JSON body, not URL query parameters."}
    )

@app.exception_handler(openai.RateLimitError)
async def openai_rate_limit_handler(request: Request, exc: openai.RateLimitError):
    logger.error(f"OpenAI Rate Limit Error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "message": "OpenAI API Quota Exceeded", 
            "details": "The system is temporarily unable to process requests due to API rate limits. Please check your OpenAI billing details or try again later."
        },
    )



@app.get("/")
async def root():
    return {
        "message": "Welcome to our Walkthrough system"
    }

@app.post("/walkthrough")
async def resolve_request(request: ResolveQuery):
    logger.info(f"Received user request: {request.user_request}")
    url = request.url
    user_request = request.user_request
    thread_id = request.thread_id
    result = await main(url=url, goal=user_request, thread_id=thread_id)
    return {"result": result}


if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8000, loop="asyncio")