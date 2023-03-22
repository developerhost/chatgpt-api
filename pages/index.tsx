import React, { useCallback, useRef, useState } from 'react';

// Types
interface Conversation {
  role: string
  content: string
}

export default function Home() {

  // States
  const [value, setValue] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  },[]
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      const chatHistory = [...conversation, {role: "user", content: value}];
      const response = await fetch('/api/openAIChat', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await response.json()
      setValue("");
      setConversation([...chatHistory, {role: "assistant", content: data.result.choices[0].message.content}]);
    }
  }

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  }
  

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-center mt-40 text-center w-2/3 mx-auto'>
        <h1 className='text-6xl'>タイトル</h1>
      </div>
      <div className="my-12">
        <p className="mb-6 font-bold">入力してください</p>
        <input 
          placeholder='入力' 
          type="text" 
          className='w-full max-w-xs input input-bordered input-secondary' 
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button className='mt-6 btn btn-primary btn-xs' onClick={handleRefresh}>新しい会話を始める</button>
        <div className="textarea">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-end">
                  <div className="chat-bubble chat-bubble-secondary">
                    <strong className="badge badge-primary">AVA</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              ) : (
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary">
                    <strong className="badge badge-primary">User</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              )}
          </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}