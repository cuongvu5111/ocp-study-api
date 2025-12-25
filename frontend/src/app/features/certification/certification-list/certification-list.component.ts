import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Certification } from '../../../models/certification.model';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
    selector: 'app-certification-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './certification-list.component.html',
    styleUrls: ['./certification-list.component.scss']
})
export class CertificationListComponent implements OnInit {
    certifications: Certification[] = [];
    isLoading = true;

    constructor(
        private certificationService: CertificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Load certifications for user certification selection
        this.certificationService.getAllCertifications(0, 100).subscribe({
            next: (data: any) => {
                this.certifications = data.content || data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load certifications', err);
                this.isLoading = false;
            }
        });
    }

    selectCertification(cert: Certification): void {
        this.certificationService.setSelectedCertificationId(cert.id);
        this.certificationService.setSelectedCertification(cert.name);
        this.router.navigate(['/dashboard']);
    }
}
