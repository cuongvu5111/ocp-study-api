package com.ocp.study.controller;

import com.ocp.study.dto.DocumentDTO;
import com.ocp.study.entity.Document;
import com.ocp.study.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ContentDisposition;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "API quản lý tài liệu học tập")
public class DocumentController {

    private final DocumentService documentService;

    // Temporary user ID extractor placeholder
    private String getUserId() {
        return "current-user";
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tài liệu", description = "Lấy danh sách tài liệu của một chứng chỉ")
    public ResponseEntity<List<DocumentDTO>> getDocuments(@RequestParam UUID certificationId) {
        return ResponseEntity.ok(documentService.getDocumentsByCertification(certificationId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload tài liệu", description = "Upload file PDF cho chứng chỉ")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("certificationId") UUID certificationId,
            @RequestParam(value = "title", required = false) String title) {

        return ResponseEntity.ok(documentService.storeFile(file, certificationId, title, getUserId()));
    }

    @GetMapping("/{id}/file")
    @Operation(summary = "Xem hoặc tải tài liệu")
    public ResponseEntity<Resource> getFile(
            @PathVariable UUID id,
            @RequestParam(value = "download", defaultValue = "false") boolean download) {
        Document document = documentService.getDocumentEntity(id);
        Resource resource = documentService.loadFileAsResource(id);

        String contentType = "application/pdf";
        String disposition = download ? "attachment" : "inline";
        String fileName = document.getFileName();

        // Fallback to title if fileName is missing or just use title as the download
        // name
        if (download && document.getTitle() != null && !document.getTitle().isEmpty()) {
            fileName = document.getTitle();
            if (!fileName.toLowerCase().endsWith(".pdf")) {
                fileName += ".pdf";
            }
        }

        String encodedFileName = UriUtils.encode(fileName, StandardCharsets.UTF_8);

        // Create an ASCII-only fallback for the legacy 'filename' parameter
        String asciiFileName = Normalizer.normalize(fileName, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replace("\"", "\\\"");

        String headerValue = String.format("%s; filename=\"%s\"; filename*=UTF-8''%s",
                disposition, asciiFileName, encodedFileName);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa tài liệu")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
