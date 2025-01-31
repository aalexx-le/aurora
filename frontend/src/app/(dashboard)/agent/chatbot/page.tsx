"use client"

import { useChat, type UseChatOptions } from "ai/react"

import { Chat } from "@/components/ui/chat"

type ChatDemoProps = {
    initialMessages?: UseChatOptions["initialMessages"]
}

export default function ChatDemo(props: ChatDemoProps) {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        stop,
        isLoading,
    } = useChat({})

    return (
        <div className="flex h-full w-full">
            <Chat
                className="grow"
                messages={messages}
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isGenerating={isLoading}
                stop={stop}
                append={append}
                suggestions={[]}
            />
        </div>
    )
}