export async function validateWorkflow(workflowId, status) {
  if (!workflowId) return { valid: false, message: "No Workflow ID provided" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chatbot/getWorkflow/${workflowId}`,
      { cache: "no-store" },
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

    return { valid: true, data: data };
  } catch (error) {
    console.error("Workflow validation error:", error);
    return { valid: false, message: "Server connection failed" };
  }
}
