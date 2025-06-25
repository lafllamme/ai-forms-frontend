// composables/useChat.ts

import { useState } from '#app'
import { consola } from 'consola'

/**
 * A single chat message (user/assistant/system)
 */
export interface ChatMessageApi {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * API response shape from /api/chat endpoint
 */
export interface ChatResponse {
  reply: string
  done?: boolean
}

/**
 * useChat composable
 * Talks to our Nuxt server endpoint at /api/chat (not directly to Python!).
 */
export function useChat() {
  const chatHistory = useState<ChatMessageApi[]>('formChatHistory', () => [])

  // add initial welcome message
  if (chatHistory.value.length === 0) {
    chatHistory.value.push({
      role: 'system',
      content: 'Welcome to the chat! How can I assist you today?',
    })
  }

  /**
   * Send message to the /api/chat endpoint.
   * @param {string} message
   * @param {string} chatId
   * @returns {Promise<ChatResponse>} API response
   */
  const sendFormChat = async (message: string, chatId: string): Promise<ChatResponse> => {
    try {
      chatHistory.value.push({ role: 'user', content: message })

      // Calls our Nuxt server endpoint
      const response = await $fetch<ChatResponse>('/api/chat', {
        method: 'POST',
        body: { message, chat_id: chatId },
      })

      // If response shape is wrong, log and throw
      if (!response) {
        consola.error('[API][chat] Invalid response from backend:', response)
      }

      chatHistory.value.push({ role: 'assistant', content: response.reply })
      // Optionally add: done status, etc. from response
      return response
    }
    catch (error) {
      consola.error('[FormChat] sendFormChat error:', error)
      throw error
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
  }
}
