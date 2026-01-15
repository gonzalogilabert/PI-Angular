import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { Curso, Matricula } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class CursoService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    private cursosSubject = new BehaviorSubject<Curso[]>([]);
    cursos$ = this.cursosSubject.asObservable();

    setCursos(data: Curso[]) {
        this.cursosSubject.next(data);
    }

    constructor() { }

    // Cursos
    getCursos(): Observable<Curso[]> {
        return this.http.get<Curso[]>(`${this.apiUrl}/cursos`).pipe(
            tap(cursos => this.cursosSubject.next(cursos))
        );
    }

    getCurso(id: string): Observable<Curso> {
        return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}`);
    }

    crearCurso(curso: Curso): Observable<Curso> {
        return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso).pipe(
            switchMap((newCurso) => {
                // Return the new course but refresh the list in the background
                return this.getCursos().pipe(
                    map(() => newCurso) // map back to the original result expected by component
                );
            })
        );
    }

    actualizarCurso(id: string, curso: Partial<Curso>): Observable<Curso> {
        return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso).pipe(
            switchMap((updatedCurso) => {
                return this.getCursos().pipe(
                    map(() => updatedCurso)
                );
            })
        );
    }

    borrarCurso(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cursos/${id}`).pipe(
            switchMap((res) => {
                return this.getCursos().pipe(
                    map(() => res)
                );
            })
        );
    }

    // Matriculas
    matricularUsuario(matricula: Matricula): Observable<Matricula> {
        return this.http.post<Matricula>(`${this.apiUrl}/matriculas`, matricula);
    }

    getMatriculas(): Observable<Matricula[]> {
        return this.http.get<Matricula[]>(`${this.apiUrl}/matriculas`);
    }
}
