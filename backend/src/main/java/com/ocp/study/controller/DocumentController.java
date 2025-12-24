package com.ocp.study.controller;

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

import java.util.List;

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
    public ResponseEntity<List<Document>> getDocuments(@RequestParam Long certificationId) {
        return ResponseEntity.ok(documentService.getDocumentsByCertification(certificationId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload tài liệu", description = "Upload file PDF cho chứng chỉ")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("certificationId") Long certificationId,
            @RequestParam(value = "title", required = false) String title) {

        return ResponseEntity.ok(documentService.storeFile(file, certificationId, title, getUserId()));
    }

    @GetMapping("/{id}/file")
    @Operation(summary = "Xem tài liệu", description = "Tải hoặc xem file PDF")
    public ResponseEntity<Resource> getFile(@PathVariable Long id) {
        Resource resource = documentService.loadFileAsResource(id);

        // Try to detect content type
        String contentType = "application/pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa tài liệu")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
