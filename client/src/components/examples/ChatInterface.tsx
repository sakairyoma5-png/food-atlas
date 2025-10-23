import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  const mockMessages = [
    {
      id: "1",
      role: "assistant" as const,
      content: "こんにちは！今日はどんな料理を探していますか？",
    },
    {
      id: "2",
      role: "user" as const,
      content: "イタリア料理で、30分以内に作れるものがいいです",
    },
  ];

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatInterface initialMessages={mockMessages} />
    </div>
  );
}
