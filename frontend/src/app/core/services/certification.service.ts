import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification } from '../../models/certification.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CertificationService {
    private apiUrl = `${environment.apiUrl}/certifications`;

    constructor(private http: HttpClient) { }

    getAllCertifications(): Observable<Certification[]> {
        return this.http.get<Certification[]>(this.apiUrl);
    }

    getCertificationById(id: number): Observable<Certification> {
        return this.http.get<Certification>(`${this.apiUrl}/${id}`);
    }
}
