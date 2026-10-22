package com.university.academicassistant.rag;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.ai.document.Document;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class RAGServiceTest {

    private VectorStoreService vectorStoreService;
    private PromptEngine promptEngine;
    private RAGService ragService;

    @BeforeEach
    void setUp() {
        vectorStoreService = Mockito.mock(VectorStoreService.class);
        promptEngine = new PromptEngine();
        ragService = new RAGService(vectorStoreService, promptEngine, null, 5, 0.70);
    }

    @Test
    @DisplayName("Should retrieve official attendance chunks and generate grounded answer with citations")
    void testAttendanceQueryRetrieval() {
        // Arrange
        Document mockDoc = new Document("chunk-1", "Section 4.2 Attendance Criteria: Minimum 75% attendance mandatory.",
                Map.of("title", "Academic Regulations Handbook 2025-2026", "pageNumber", 14));

        when(vectorStoreService.searchSimilar(anyString(), anyInt(), anyDouble(), anyString(), any()))
                .thenReturn(List.of(mockDoc));

        // Act
        RAGService.RAGResult result = ragService.generateGroundedAnswer(
                "What is the attendance requirement for semester exams?", "STUDENT", 1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isGrounded(), "Result should be marked as grounded in official documents");
        assertFalse(result.isUnverified(), "Result should not be unverified");
        assertFalse(result.getCitations().isEmpty(), "Citations must be present");

        RAGService.CitationDto citation = result.getCitations().get(0);
        assertEquals("Academic Regulations Handbook 2025-2026", citation.getDocumentTitle());
        assertEquals(14, citation.getPageNumber());
        assertTrue(result.getAnswer().contains("75%"));
    }

    @Test
    @DisplayName("Should return disclaimer notice when no official document matches the question")
    void testUnverifiedQueryWhenNoDocumentFound() {
        // Arrange: Vector store returns empty list
        when(vectorStoreService.searchSimilar(anyString(), anyInt(), anyDouble(), anyString(), any()))
                .thenReturn(List.of());

        // Act
        RAGService.RAGResult result = ragService.generateGroundedAnswer(
                "Can students park helicopters on the campus football field?", "STUDENT", 1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.isGrounded(), "Should not be grounded");
        assertTrue(result.isUnverified(), "Should be flagged as unverified / insufficient official information");
        assertTrue(result.getCitations().isEmpty(), "No citations should be returned");
        assertTrue(result.getAnswer().contains("sufficient verified details were not found") ||
                   result.getAnswer().contains("Official Information Notice"));
    }
}
