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

    private selectedCertIdSubject = new BehaviorSubject<number | null>(
        Number(localStorage.getItem('selectedCertificationId')) || null
    );
    selectedCertId$ = this.selectedCertIdSubject.asObservable();

    constructor(private http: HttpClient) { }

    getAllCertifications(): Observable<Certification[]> {
        return this.http.get<Certification[]>(this.apiUrl);
    }

    getCertificationById(id: number): Observable<Certification> {
        return this.http.get<Certification>(`${this.apiUrl}/${id}`);
    }

    createCertification(data: any): Observable<Certification> {
        return this.http.post<Certification>(this.apiUrl, data);
    }

    updateCertification(id: number, data: any): Observable<Certification> {
        return this.http.put<Certification>(`${this.apiUrl}/${id}`, data);
    }

    deleteCertification(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    setSelectedCertification(name: string) {
        localStorage.setItem('selectedCertificationName', name);
        this.selectedCertNameSubject.next(name);
    }

    setSelectedCertificationId(id: number) {
        localStorage.setItem('selectedCertificationId', id.toString());
        this.selectedCertIdSubject.next(id);
    }

    getCurrentCertId(): number | null {
        return this.selectedCertIdSubject.value;
    }
}
