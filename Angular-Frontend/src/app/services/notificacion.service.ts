import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notificacion {
    mensaje: string;
    tipo: 'success' | 'error' | 'info';
    visible: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private notificacionSubject = new BehaviorSubject<Notificacion>({
        mensaje: '',
        tipo: 'info',
        visible: false
    });

    notificacion$ = this.notificacionSubject.asObservable();

    show(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') {
        this.notificacionSubject.next({ mensaje, tipo, visible: true });

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hide();
        }, 5000);
    }

    success(mensaje: string) {
        this.show(mensaje, 'success');
    }

    error(mensaje: string) {
        this.show(mensaje, 'error');
    }

    hide() {
        this.notificacionSubject.next({ ...this.notificacionSubject.value, visible: false });
    }
}
