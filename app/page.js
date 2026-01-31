// app/page.jsx (or wherever Home is located)
import Main from "@/components/layout/Main";
import IntroWindow from "@/components/layout/ChatWindow/IntroWindow";
import { validateWorkflow } from "@/utils/workflowValidation"; // Import your helper

const Home = async ({ searchParams }) => {
  const params = await searchParams;
  const { status, workflowId } = params;

  const validation = await validateWorkflow(workflowId, status);

  return (
    <Main status={status} workflowId={workflowId} validation={validation}>
      <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15 overflow-hidden">
        <IntroWindow
          status={status}
          workflowId={workflowId}
          validation={validation}
        />
      </div>
    </Main>
  );
};

export default Home;
