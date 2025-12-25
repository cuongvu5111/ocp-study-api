package com.ocp.study.controller;

import com.ocp.study.entity.Certification;
import com.ocp.study.service.CertificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certifications")
@RequiredArgsConstructor
@Tag(name = "Certifications", description = "API quản lý chứng chỉ")
public class CertificationController {

    private final CertificationService certificationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách chứng chỉ", description = "Trả về tất cả các chứng chỉ có trong hệ thống (có phân trang)")
    public ResponseEntity<org.springframework.data.domain.Page<Certification>> getAllCertifications(
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(certificationService.getAllCertifications(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chứng chỉ", description = "Trả về thông tin chi tiết của một chứng chỉ bao gồm topics")
    public ResponseEntity<Object> getCertificationById(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getCertificationById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo chứng chỉ mới", description = "Tạo chứng chỉ mới cùng với lộ trình học (topics)")
    public ResponseEntity<Certification> createCertification(
            @RequestBody com.ocp.study.dto.CreateCertificationRequest request) {
        return ResponseEntity.ok(certificationService.createCertification(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật chứng chỉ", description = "Cập nhật thông tin chứng chỉ và topics")
    public ResponseEntity<Certification> updateCertification(
            @PathVariable Long id,
            @RequestBody com.ocp.study.dto.CreateCertificationRequest request) {
        return ResponseEntity.ok(certificationService.updateCertification(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa chứng chỉ", description = "Xóa chứng chỉ và tất cả dữ liệu liên quan")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        certificationService.deleteCertification(id);
        return ResponseEntity.ok().build();
    }
}
