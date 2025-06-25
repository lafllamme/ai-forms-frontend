import { useState } from '#app'
import { consola } from 'consola'

export interface ChatMessageApi {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  reply: string
  done?: boolean
}

export function useChat() {
  const chatHistory = useState<ChatMessageApi[]>('formChatHistory', () => [])
  // The current AbortController (for cancel)
  const chatAbortController = useState<AbortController | null>('chatAbortController', () => null)

  // initial welcome message
  if (chatHistory.value.length === 0) {
    chatHistory.value.push({
      role: 'system',
      content: 'Hey, ich bin dein Smart Form Assistent! Wie kann ich helfen?',
    })
  }

  /**
   * Send message to the /api/chat endpoint.
   */
  const sendFormChat = async (message: string, chatId: string): Promise<ChatResponse> => {
    // Cancel any previous request before sending a new one
    if (chatAbortController.value) {
      chatAbortController.value.abort()
    }
    const controller = new AbortController()
    chatAbortController.value = controller

    try {
      chatHistory.value.push({ role: 'user', content: message })

      const response = await $fetch<ChatResponse>('/api/chat', {
        method: 'POST',
        body: { message, chat_id: chatId },
        signal: controller.signal,
      })

      if (!response) {
        consola.error('[API][chat] Invalid response from backend:', response)
      }

      chatHistory.value.push({ role: 'assistant', content: response.reply })
      return response
    }
    catch (error: any) {
      if (error?.name === 'AbortError') {
        consola.info('[FormChat] Request was cancelled by user.')
        // Optionally add a cancelled message:
        chatHistory.value.push({
          role: 'system',
          content: '⏹️ Anfrage wurde abgebrochen.',
        })
      }
      else {
        consola.error('[FormChat] sendFormChat error:', error)
      }
      throw error
    }
    finally {
      // Clean up the controller after done or cancelled
      chatAbortController.value = null
    }
  }

  /**
   * Cancel the current chat request (if any)
   */
  const cancelFormChat = () => {
    if (chatAbortController.value) {
      chatAbortController.value.abort()
      chatAbortController.value = null
    }
  }

  /**
   * Clear the chat history.
   */
  const clearChat = () => {
    chatHistory.value = []
  }

  return {
    chatHistory,
    sendFormChat,
    clearChat,
    cancelFormChat,
    chatAbortController,
  }
}
