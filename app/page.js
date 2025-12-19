import Main from "@/components/layout/Main";
import IntroWindow from "@/components/layout/ChatWindow/IntroWindow";

const Home = async ({ searchParams }) => {
  const params = await searchParams;

  const status = params.status;
  const workflowId = params.workflowId;

  return (
    <Main status={status} workflowId={workflowId}>
      <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15 overflow-hidden">
        <IntroWindow status={status} workflowId={workflowId} />
      </div>
    </Main>
  );
};

export default Home;
