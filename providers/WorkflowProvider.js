"use client";

import StartContainer from "@/components/ui/StartContainer";
import { setIsInitializing, setWorkflowId } from "@/redux/slice/chatSlice";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function WorkflowProvider({ children }) {
  const isInitializing = useSelector((state) => state.chat.isInitializing);
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflowId");
  const status = searchParams.get("status");
  const dispatch = useDispatch();
  const loadedWorkflowId = useSelector((state) => state.chat.workflowId);

  const loadWorkflow = async () => {
    try {
      dispatch(setIsInitializing(true));

      const apiCall = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/getWorkflow/${workflowId}`
      );

      if (!apiCall.data.success) {
        console.log(apiCall.data);
        toast.error(apiCall.data.message);
        return;
      }

      if (!apiCall.data.valid || !apiCall.data.exists) {
        toast.error("Invalid workflow");
        return;
      }

      if (apiCall.data?.status?.toLowerCase() === "test") {
        if (status?.toLowerCase() !== "test") {
          toast.error("Invalid workflow");
          return;
        }
      }

      dispatch(setWorkflowId(workflowId));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setIsInitializing(false));
    }
  };

  useEffect(() => {
    if (workflowId) {
      loadWorkflow();
    } else {
      dispatch(setWorkflowId(null));
      dispatch(setIsInitializing(false));
    }

    return () => {
      dispatch(setWorkflowId(null));
      dispatch(setIsInitializing(false));
    };
  }, [workflowId, status]);

  if (isInitializing) {
    return (
      <StartContainer>
        <Icon icon="lucide:loader-circle" className="w-10 h-10 animate-spin" />
      </StartContainer>
    );
  }

  if (!isInitializing && !loadedWorkflowId) {
    return (
      <StartContainer>
        <Icon icon="line-md:close-circle-filled" className="w-10 h-10" />
      </StartContainer>
    );
  }

  return <>{children}</>;
}
