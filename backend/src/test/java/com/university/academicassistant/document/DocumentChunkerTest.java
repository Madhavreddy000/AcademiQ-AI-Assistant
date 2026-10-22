package com.university.academicassistant.document;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DocumentChunkerTest {

    private final DocumentChunker chunker = new DocumentChunker(300, 50);

    @Test
    @DisplayName("Should chunk pages and preserve page numbers and approximate tokens")
    void testChunkingPreservesMetadata() {
        String longText = """
                Section 1.1 Academic Governance. The Academic Council oversees all undergraduate programs.
                Students must register for minimum 16 credits each regular semester.
                Continuous Internal Evaluation includes two mid-term examinations and laboratory practical tests.
                End semester exams contribute 60 percent of final grade marks.
                """;

        DocumentParser.PageContent page1 = new DocumentParser.PageContent(5, longText);
        List<DocumentChunker.RawChunk> chunks = chunker.splitPagesIntoChunks(List.of(page1));

        assertFalse(chunks.isEmpty());
        for (DocumentChunker.RawChunk chunk : chunks) {
            assertEquals(5, chunk.getPageNumber(), "Page number must be preserved");
            assertTrue(chunk.getTokenCount() > 0, "Token count must be positive");
            assertFalse(chunk.getText().isBlank(), "Chunk text must not be blank");
        }
    }
}
