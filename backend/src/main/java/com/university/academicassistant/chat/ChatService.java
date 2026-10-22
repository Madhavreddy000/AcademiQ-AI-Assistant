package com.university.academicassistant.chat;

import com.university.academicassistant.rag.RAGService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final CitationRepository citationRepository;
    private final RAGService ragService;

    public ChatService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            CitationRepository citationRepository,
            RAGService ragService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.citationRepository = citationRepository;
        this.ragService = ragService;
    }

    @Transactional
    public Conversation createConversation(Long userId, String title) {
        Conversation conversation = new Conversation(userId, title != null ? title : "New Academic Query");
        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUserConversations(Long userId) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public Optional<Conversation> getConversation(Long conversationId, Long userId) {
        return conversationRepository.findById(conversationId)
                .filter(c -> c.getUserId().equals(userId));
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long userId) {
        conversationRepository.findById(conversationId)
                .filter(c -> c.getUserId().equals(userId))
                .ifPresent(conversationRepository::delete);
    }

    public List<MessageWithCitations> getConversationMessages(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        List<MessageWithCitations> result = new ArrayList<>();

        for (Message msg : messages) {
            List<MessageCitation> citations = citationRepository.findByMessageId(msg.getId());
            result.add(new MessageWithCitations(msg, citations));
        }

        return result;
    }

    public static class MessageWithCitations {
        private Message message;
        private List<MessageCitation> citations;

        public MessageWithCitations(Message message, List<MessageCitation> citations) {
            this.message = message;
            this.citations = citations;
        }

        public Message getMessage() { return message; }
        public List<MessageCitation> getCitations() { return citations; }
    }

    @Async
    public void streamChatResponse(
            Long conversationId,
            String userQuery,
            Long userId,
            String userRole,
            Long departmentId,
            SseEmitter emitter) {

        long startTime = System.currentTimeMillis();

        try {
            // 1. Save User Message to MySQL
            Message userMessage = new Message();
            userMessage.setConversationId(conversationId);
            userMessage.setSender(Message.SenderType.USER);
            userMessage.setContent(userQuery);
            userMessage.setRagGrounded(false);
            messageRepository.save(userMessage);

            // 2. Perform RAG Vector Retrieval and Grounded Answer Generation
            RAGService.RAGResult ragResult = ragService.generateGroundedAnswer(userQuery, userRole, departmentId);

            // 3. Emit Citations event to client first
            if (!ragResult.getCitations().isEmpty()) {
                emitter.send(SseEmitter.event()
                        .name("citations")
                        .data(ragResult.getCitations()));
            }

            // 4. Stream tokens / deltas via SSE
            String answer = ragResult.getAnswer();
            String[] words = answer.split(" ");
            StringBuilder streamedContent = new StringBuilder();

            for (int i = 0; i < words.length; i++) {
                String delta = (i == 0 ? "" : " ") + words[i];
                streamedContent.append(delta);

                Map<String, String> payload = Map.of("delta", delta);
                emitter.send(SseEmitter.event().data(payload));

                // Small micro-delay for smooth realistic SSE streaming effect
                Thread.sleep(18);
            }

            // 5. Save Assistant Message and Citations to MySQL
            long latencyMs = System.currentTimeMillis() - startTime;
            Message assistantMessage = new Message();
            assistantMessage.setConversationId(conversationId);
            assistantMessage.setSender(Message.SenderType.ASSISTANT);
            assistantMessage.setContent(streamedContent.toString());
            assistantMessage.setRagGrounded(ragResult.isGrounded());
            assistantMessage.setUnverified(ragResult.isUnverified());
            assistantMessage.setModelUsed("Spring-AI-RAG");
            assistantMessage.setLatencyMs((int) latencyMs);
            Message savedAssistantMsg = messageRepository.save(assistantMessage);

            for (RAGService.CitationDto cit : ragResult.getCitations()) {
                MessageCitation mc = new MessageCitation();
                mc.setMessageId(savedAssistantMsg.getId());
                mc.setDocumentTitle(cit.getDocumentTitle());
                mc.setPageNumber(cit.getPageNumber());
                mc.setSnippet(cit.getSnippet());
                mc.setRelevanceScore(cit.getRelevanceScore());
                citationRepository.save(mc);
            }

            // 6. Signal completion
            emitter.send(SseEmitter.event().data("[DONE]"));
            emitter.complete();

        } catch (Exception ex) {
            log.error("Streaming chat response failed", ex);
            try {
                emitter.send(SseEmitter.event().name("error").data("Streaming error: " + ex.getMessage()));
                emitter.completeWithError(ex);
            } catch (IOException ignored) {}
        }
    }
}
