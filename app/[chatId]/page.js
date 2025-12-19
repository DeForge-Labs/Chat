import Main from "@/components/layout/Main";
import ChatHistory from "@/components/layout/ChatWindow/ChatHistory";

const ChatIdPage = async ({ params, searchParams }) => {
  const { chatId } = await params;
  const search = await searchParams;

  const status = search.status;
  const workflowId = search.workflowId;

  return (
    <Main status={status} workflowId={workflowId}>
      <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15 overflow-hidden">
        <ChatHistory chatId={chatId} workflowId={workflowId} status={status} />
      </div>
    </Main>
  );
};

export default ChatIdPage;
