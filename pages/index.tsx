import React, { useCallback, useRef, useState } from 'react';
import { SVGAttributes } from "react";

export function PaperAirplaneIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

// Types
interface Conversation {
  role: string
  content: string
}

export default function Home() {

  // States
  const [value, setValue] = useState<string>("");
  const [profileMe, setprofileMe] = useState<string>("");
  const [profileYou, setprofileYou] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  },[]
  );
  const handleInputMe = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  },[]
  );
  const handleInputYou = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleClick = async () => {

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

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  }
  

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-center mt-40 text-center w-2/3 mx-auto'>
        <h1 className='text-6xl'>AI会話</h1>
      </div>
      <div className="my-12">
        <label htmlFor="chat" className="sr-only">Your message</label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <input 
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder='入力' 
            type="text" 
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            >
            </input>
            <button 
              onClick={handleClick} 
              type="submit" 
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            >
            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
        <button className='mt-6 btn btn-primary btn-xs' onClick={handleRefresh}>新しい会話を始める</button>
        <div className="textarea">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-start">
                  <div className="chat-header">
                    <strong>
                      AI
                    </strong>
                    <div className="chat-bubble chat-bubble-info">
                      {item.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div className="chat-header">
                    <div className='text-right font-bold'>User</div>
                    <div className="chat-bubble chat-bubble">
                      {item.content}
                    </div>
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