import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { Usuario } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/usuarios';

    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    usuarios$ = this.usuariosSubject.asObservable();

    setUsuarios(data: Usuario[]) {
        this.usuariosSubject.next(data);
    }

    constructor() { }

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl).pipe(
            tap(usuarios => this.usuariosSubject.next(usuarios))
        );
    }

    getUsuario(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    crearUsuario(usuario: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, usuario).pipe(
            switchMap((newUsuario) => {
                return this.getUsuarios().pipe(
                    map(() => newUsuario)
                );
            })
        );
    }

    actualizarUsuario(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario).pipe(
            switchMap((updatedUsuario) => {
                return this.getUsuarios().pipe(
                    map(() => updatedUsuario)
                );
            })
        );
    }

    borrarUsuario(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            switchMap((res) => {
                return this.getUsuarios().pipe(
                    map(() => res)
                );
            })
        );
    }
}
