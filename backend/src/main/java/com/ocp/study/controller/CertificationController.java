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
    @Operation(summary = "Lấy danh sách chứng chỉ", description = "Trả về tất cả các chứng chỉ có trong hệ thống")
    public ResponseEntity<List<Certification>> getAllCertifications() {
        return ResponseEntity.ok(certificationService.getAllCertifications());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chứng chỉ", description = "Trả về thông tin chi tiết của một chứng chỉ")
    public ResponseEntity<Certification> getCertificationById(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getCertificationById(id));
    }
}
