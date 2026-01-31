import Main from "@/components/layout/Main";
import ChatHistory from "@/components/layout/ChatWindow/ChatHistory";
import { validateWorkflow } from "@/utils/workflowValidation";

const ChatIdPage = async ({ params, searchParams }) => {
  const { chatId } = await params;
  const search = await searchParams;

  const status = search.status;
  const workflowId = search.workflowId;

  const validation = await validateWorkflow(workflowId, status);

  return (
    <Main status={status} workflowId={workflowId} validation={validation}>
      <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15 overflow-hidden">
        <ChatHistory chatId={chatId} workflowId={workflowId} status={status} />
      </div>
    </Main>
  );
};

export default ChatIdPage;
