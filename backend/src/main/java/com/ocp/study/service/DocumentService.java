package com.ocp.study.service;

import com.ocp.study.entity.Certification;
import com.ocp.study.entity.Document;
import com.ocp.study.repository.CertificationRepository;
import com.ocp.study.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CertificationRepository certificationRepository;

    private final Path fileStorageLocation = Paths.get("uploads/documents").toAbsolutePath().normalize();

    {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByCertification(Long certificationId) {
        return documentRepository.findByCertificationIdOrderByUploadedAtDesc(certificationId);
    }

    @Transactional
    public Document storeFile(MultipartFile file, Long certificationId, String title, String username) {
        // Validate file type
        if (!"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Chỉ chấp nhận file PDF.");
        }

        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ với ID: " + certificationId));

        // Normalize file name and prevent duplicates/conflicts
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new RuntimeException("Filename is null");
        }
        originalFileName = org.springframework.util.StringUtils.cleanPath(originalFileName);

        String fileExtension = "";
        try {
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
        } catch (Exception e) {
            fileExtension = "";
        }

        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                    .title(title != null && !title.isEmpty() ? title : originalFileName)
                    .fileName(originalFileName) // Keep original name for display if needed
                    .filePath(storedFileName) // Encrypted/UUID name for storage
                    .fileSize(file.getSize())
                    .certification(certification)
                    .uploadedBy(username)
                    .build();

            return documentRepository.save(document);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found " + documentId));

        try {
            Path filePath = this.fileStorageLocation.resolve(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + document.getFilePath());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + document.getFilePath(), ex);
        }
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        try {
            Path filePath = this.fileStorageLocation.resolve(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + e.getMessage());
        }

        documentRepository.delete(document);
    }
}
