package com.university.academicassistant.document;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Component
public class DocumentParser {

    public static class PageContent {
        private final int pageNumber;
        private final String text;

        public PageContent(int pageNumber, String text) {
            this.pageNumber = pageNumber;
            this.text = text;
        }

        public int getPageNumber() { return pageNumber; }
        public String getText() { return text; }
    }

    public List<PageContent> parseDocument(File file, String fileType) throws IOException {
        String type = fileType.toUpperCase();
        if ("PDF".equals(type)) {
            return parsePdf(file);
        } else if ("DOCX".equals(type)) {
            return parseDocx(file);
        } else {
            return parseTxt(file);
        }
    }

    private List<PageContent> parsePdf(File file) throws IOException {
        List<PageContent> pages = new ArrayList<>();
        try (PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            int totalPages = document.getNumberOfPages();

            for (int p = 1; p <= totalPages; p++) {
                stripper.setStartPage(p);
                stripper.setEndPage(p);
                String pageText = stripper.getText(document).trim();
                if (!pageText.isEmpty()) {
                    pages.add(new PageContent(p, pageText));
                }
            }
        }
        return pages;
    }

    private List<PageContent> parseDocx(File file) throws IOException {
        List<PageContent> pages = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(file);
             XWPFDocument docx = new XWPFDocument(fis)) {

            StringBuilder sb = new StringBuilder();
            int simulatedPage = 1;
            int paragraphCount = 0;

            for (XWPFParagraph p : docx.getParagraphs()) {
                String text = p.getText().trim();
                if (!text.isEmpty()) {
                    sb.append(text).append("\n\n");
                    paragraphCount++;
                    // Approximate page break every 10 paragraphs for DOCX
                    if (paragraphCount >= 10) {
                        pages.add(new PageContent(simulatedPage++, sb.toString().trim()));
                        sb.setLength(0);
                        paragraphCount = 0;
                    }
                }
            }
            if (sb.length() > 0) {
                pages.add(new PageContent(simulatedPage, sb.toString().trim()));
            }
        }
        return pages.isEmpty() ? List.of(new PageContent(1, "Empty document")) : pages;
    }

    private List<PageContent> parseTxt(File file) throws IOException {
        String content = Files.readString(file.toPath());
        return List.of(new PageContent(1, content));
    }
}
