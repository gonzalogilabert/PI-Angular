import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  private encuestasSubject = new BehaviorSubject<any[]>([]);
  encuestas$ = this.encuestasSubject.asObservable();

  // Helper to sync state from components (e.g. Resolver hydration)
  setEncuestas(data: any[]) {
    this.encuestasSubject.next(data);
  }

  constructor() { }

  // 1. LISTAR ENCUESTAS
  getDatos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/encuestas`).pipe(
      tap((data: any) => this.encuestasSubject.next(data))
    );
  }

  // 2. CREAR ENCUESTA
  crearEncuesta(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/encuestas`, datos).pipe(
      switchMap((nueva) => this.getDatos().pipe(map(() => nueva)))
    );
  }

  // 3. OBTENER UNA ENCUESTA POR ID
  getEncuestaPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/encuestas/${id}`);
  }

  // 4. ACTUALIZAR ENCUESTA
  actualizarEncuesta(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/encuestas/${id}`, datos).pipe(
      switchMap((updated) => this.getDatos().pipe(map(() => updated)))
    );
  }

  // 5. BORRAR ENCUESTA
  borrarEncuesta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/encuestas/${id}`).pipe(
      switchMap((res) => this.getDatos().pipe(map(() => res)))
    );
  }

  // 6. OBTENER PREGUNTAS (FILTRADAS POR ID ENCUESTA)
  getPreguntas(idEncuesta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/preguntas?id_encuesta=${idEncuesta}`);
  }

  // 7. ENVIAR RESPUESTA A UNA PREGUNTA
  enviarRespuesta(encuestaId: string, preguntaId: string, datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/respuestas/${encuestaId}/pregunta/${preguntaId}`, datos);
  }

  // 8. OBTENER RESPUESTAS DE UNA ENCUESTA
  obtenerRespuestas(encuestaId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/respuestas/encuesta/${encuestaId}`);
  }
}