package com.university.academicassistant.document;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DocumentChunker {

    private final int chunkSize;
    private final int chunkOverlap;

    public DocumentChunker(
            @Value("${app.rag.chunk-size:600}") int chunkSize,
            @Value("${app.rag.chunk-overlap:100}") int chunkOverlap) {
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;
    }

    public static class RawChunk {
        private final int chunkIndex;
        private final int pageNumber;
        private final String text;
        private final int tokenCount;

        public RawChunk(int chunkIndex, int pageNumber, String text, int tokenCount) {
            this.chunkIndex = chunkIndex;
            this.pageNumber = pageNumber;
            this.text = text;
            this.tokenCount = tokenCount;
        }

        public int getChunkIndex() { return chunkIndex; }
        public int getPageNumber() { return pageNumber; }
        public String getText() { return text; }
        public int getTokenCount() { return tokenCount; }
    }

    public List<RawChunk> splitPagesIntoChunks(List<DocumentParser.PageContent> pages) {
        List<RawChunk> chunks = new ArrayList<>();
        int chunkCounter = 1;

        for (DocumentParser.PageContent page : pages) {
            String text = cleanText(page.getText());
            if (text.isEmpty()) continue;

            int start = 0;
            int length = text.length();

            while (start < length) {
                int end = Math.min(start + chunkSize, length);

                // Try to find a sentence boundary near the end
                if (end < length) {
                    int lastPeriod = text.lastIndexOf(". ", end);
                    int lastNewline = text.lastIndexOf("\n", end);
                    int bestSplit = Math.max(lastPeriod, lastNewline);

                    if (bestSplit > start + (chunkSize / 2)) {
                        end = bestSplit + 1;
                    }
                }

                String chunkStr = text.substring(start, end).trim();
                if (!chunkStr.isEmpty()) {
                    int approximateTokens = Math.max(1, chunkStr.split("\\s+").length);
                    chunks.add(new RawChunk(chunkCounter++, page.getPageNumber(), chunkStr, approximateTokens));
                }

                if (end >= length) break;
                // Move start forward, respecting overlap
                start = Math.max(start + 1, end - chunkOverlap);
            }
        }

        return chunks;
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text.replaceAll("[\\r\\t]+", " ")
                   .replaceAll(" +", " ")
                   .replaceAll("\n{3,}", "\n\n")
                   .trim();
    }
}
