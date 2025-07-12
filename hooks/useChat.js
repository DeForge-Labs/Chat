"use client";

import { useDispatch } from "react-redux";
import {
  setChatQuery,
  setChatSessions,
  setCurrentProcessingSessionId,
  setCurrentSessionHistory,
  setCurrentSessionId,
  setIsChatLoading,
} from "@/redux/slice/chatSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function useChat() {
  const dispatch = useDispatch();
  const chatQuery = useSelector((state) => state.chat.chatQuery);
  const workflowId = useSelector((state) => state.chat.workflowId);

  const startNewChat = async () => {
    try {
      dispatch(setIsChatLoading(true));

      const sessionId = uuidv4();
      dispatch(setCurrentProcessingSessionId(sessionId));

      const response = `That's an **interesting point**! Let me think about that for a moment...

Here are some key considerations:
- First consideration
- Second important point
- Third aspect to explore

\`\`\`javascript
// Example code snippet
function processData(input) {
return input.map(item => item.value);
}
\`\`\`\nI understand what you're asking. Here's my perspective on that topic:

> This is an important concept that requires careful consideration.

**Key Benefits:**
1. Enhanced functionality
2. Better user experience
3. Improved performance

For more information, you can check out [this resource](https://example.com).Great question! Based on what you've shared, I think we should consider several factors:

### Technical Aspects
- **Performance**: How fast does it need to be?
- **Scalability**: Will it handle growth?
- **Maintainability**: Can we easily update it?

### Implementation Example
\`\`\`python
def analyze_data(data):
  """Analyze the provided data"""
  results = []
  for item in data:
      if item.is_valid():
          results.append(item.process())
  return results
\`\`\`

*What do you think about this approach?*Thanks for sharing that with me. I'd like to explore this idea further.

## Analysis Framework

| Aspect | Rating | Notes |
|--------|--------|-------|
| Feasibility | ⭐⭐⭐⭐ | Highly achievable |
| Impact | ⭐⭐⭐⭐⭐ | Significant benefits |
| Complexity | ⭐⭐⭐ | Moderate effort required |

**Next Steps:**
- [ ] Research implementation options
- [ ] Create prototype
- [ ] Test with users
- [x] Initial discussion (completed)`;

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const history = response
        ? [
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: response,
            },
          ]
        : [
            {
              role: "user",
              content: chatQuery,
            },
          ];

      dispatch(setCurrentSessionId(sessionId));

      dispatch(setCurrentSessionHistory(history));

      localStorage.setItem("chatHistory_" + sessionId, JSON.stringify(history));

      const allChatSessions = localStorage.getItem("chatSessions");
      if (!allChatSessions) {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify([
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );

        dispatch(
          setChatSessions([
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );
      } else {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify([
            ...JSON.parse(allChatSessions),
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );

        dispatch(
          setChatSessions([
            ...JSON.parse(allChatSessions),
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );
      }

      dispatch(setChatQuery(""));
      dispatch(setCurrentProcessingSessionId(null));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setIsChatLoading(false));
    }
  };

  return {
    startNewChat,
  };
}
