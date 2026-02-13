from typing import Annotated, TypedDict, Optional
from pydantic import BaseModel, Field
import operator

class AgentState(TypedDict):
    url: str
    goal: str
    ui_data: Optional[dict]
    plan: Optional[dict]
    page_content: Optional[str]
    success: bool
    round: int
    final_walkthrough: Optional[str]


class ResolveQuery(BaseModel):
    user_request: str
    url: str = "https://www.nowsecure.com/"
    thread_id: str = "default_user"



