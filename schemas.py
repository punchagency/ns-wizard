from typing import Annotated, TypedDict, Optional, List
from pydantic import BaseModel, Field
from langchain.core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    url: str
    goal: str
    current_url: str  # Tracks where the browser actually is
    ui_data: dict
    plan: Optional[dict]
    page_content: str
    success: bool
    round: int
    final_walkthrough: Optional[str]
    messages: Annotated[List[BaseMessage], lambda x, y: x + y] 


class ResolveQuery(BaseModel):
    user_request: str
    url: str = "https://www.nowsecure.com/"
    thread_id: str = "default_user"



