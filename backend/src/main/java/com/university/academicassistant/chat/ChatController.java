package com.university.academicassistant.chat;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Academic Chat & RAG", description = "Endpoints for managing conversations and streaming RAG responses")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    @Operation(summary = "Create new chat session")
    public ResponseEntity<Conversation> createConversation(
            @RequestBody(required = false) Map<String, String> body,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authenticatedUserId");
        if (userId == null) userId = 2L; // fallback student ID

        String title = body != null ? body.get("title") : "New Academic Query";
        return ResponseEntity.ok(chatService.createConversation(userId, title));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get user's recent conversations")
    public ResponseEntity<List<Conversation>> getConversations(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authenticatedUserId");
        if (userId == null) userId = 2L;
        return ResponseEntity.ok(chatService.getUserConversations(userId));
    }

    @GetMapping("/conversations/{id}")
    @Operation(summary = "Get conversation with full message history and citations")
    public ResponseEntity<Map<String, Object>> getConversation(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authenticatedUserId");
        if (userId == null) userId = 2L;

        return chatService.getConversation(id, userId)
                .map(convo -> {
                    List<ChatService.MessageWithCitations> messages = chatService.getConversationMessages(id);
                    return ResponseEntity.ok(Map.of(
                            "conversation", convo,
                            "messages", messages
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/conversations/{id}")
    @Operation(summary = "Delete conversation")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authenticatedUserId");
        if (userId == null) userId = 2L;

        chatService.deleteConversation(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/conversations/{id}/messages/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream grounded answer with citations via Server-Sent Events (SSE)")
    public SseEmitter streamMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String content = body.get("content");
        Long userId = (Long) request.getAttribute("authenticatedUserId");
        if (userId == null) userId = 2L;

        String userRole = (String) request.getAttribute("authenticatedUserRole");
        if (userRole == null) userRole = "STUDENT";

        // Create 2-minute timeout emitter
        SseEmitter emitter = new SseEmitter(120000L);

        chatService.streamChatResponse(id, content, userId, userRole, 1L, emitter);

        return emitter;
    }
}
