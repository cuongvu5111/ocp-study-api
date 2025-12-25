import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification } from '../../models/certification.model';
import { environment } from '../../../environments/environment';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CertificationService {
    private apiUrl = `${environment.apiUrl}/certifications`;
    private selectedCertNameSubject = new BehaviorSubject<string>(
        localStorage.getItem('selectedCertificationName') || 'Java SE 11'
    );
    selectedCertName$ = this.selectedCertNameSubject.asObservable();

    private selectedCertIdSubject = new BehaviorSubject<string | null>(
        localStorage.getItem('selectedCertificationId') || null
    );
    selectedCertId$ = this.selectedCertIdSubject.asObservable();

    constructor(private http: HttpClient) { }

    getAllCertifications(page?: number, size?: number): Observable<any> {
        let params: any = {};
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
        return this.http.get<any>(this.apiUrl, { params });
    }

    getCertificationById(id: string): Observable<Certification> {
        return this.http.get<Certification>(`${this.apiUrl}/${id}`);
    }

    createCertification(data: any): Observable<Certification> {
        return this.http.post<Certification>(this.apiUrl, data);
    }

    updateCertification(id: string, data: any): Observable<Certification> {
        return this.http.put<Certification>(`${this.apiUrl}/${id}`, data);
    }

    deleteCertification(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    setSelectedCertification(name: string) {
        localStorage.setItem('selectedCertificationName', name);
        this.selectedCertNameSubject.next(name);
    }

    setSelectedCertificationId(id: string) {
        localStorage.setItem('selectedCertificationId', id);
        this.selectedCertIdSubject.next(id);
    }

    getCurrentCertId(): string | null {
        return this.selectedCertIdSubject.value;
    }
}
