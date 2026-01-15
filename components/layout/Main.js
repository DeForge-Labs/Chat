import Sidebar from "./sidebar/Sidebar";

async function validateWorkflow(workflowId, status) {
  if (!workflowId) return { valid: false, message: "No Workflow ID provided" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chatbot/getWorkflow/${workflowId}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!data.success) {
      return { valid: false, message: data.message || "API Error" };
    }

    if (!data.valid || !data.exists) {
      return { valid: false, message: "Invalid Workflow" };
    }

    if (data.status?.toLowerCase() === "test") {
      if (status?.toLowerCase() !== "test") {
        return { valid: false, message: "Unauthorized: Test mode required" };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Workflow validation error:", error);
    return { valid: false, message: "Server connection failed" };
  }
}

const Main = async ({ status, workflowId, children }) => {
  const validation = await validateWorkflow(workflowId, status);

  if (!validation.valid) {
    throw new Error(validation.message);
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
