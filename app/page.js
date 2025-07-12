import ChatWindow from "@/components/layout/ChatWindow/ChatWindow";
import SideBar from "@/components/layout/ChatWindow/SideBar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <ChatWindow />
    </div>
  );
}
