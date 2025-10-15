interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';
  return (
    <div
      className={`p-4 rounded-2xl max-w-[75%] ${
        isUser
          ? 'ml-auto bg-emerald-500 text-white'
          : 'mr-auto bg-gray-100 text-gray-900'
      }`}
    >
      {content}
    </div>
  );
}
