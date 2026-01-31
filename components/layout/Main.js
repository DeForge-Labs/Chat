import Sidebar from "./sidebar/Sidebar";

const Main = ({ status, workflowId, validation, children }) => {
  if (!validation?.valid) {
    throw new Error(validation?.message || "Access Denied");
  }

  return (
    <div className="flex w-screen max-h-screen flex-1 h-screen overflow-hidden dark:bg-dark">
      <Sidebar workflowId={workflowId} status={status} />

      <main className="flex-1 flex flex-col relative overflow-hidden h-screen bg-foreground/5 py-2 pr-1">
        {children}
      </main>
    </div>
  );
};

export default Main;
