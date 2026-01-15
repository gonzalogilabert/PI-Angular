import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
    selector: 'app-ver-respuestas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './ver-respuestas.html',
    styleUrls: ['./ver-respuestas.scss']
})
export class VerRespuestasComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(ApiService);

    encuestaId: string = '';
    resultados: any[] = []; // Array de { cabecera, detalles[] }
    loading = true;
    error = '';

    ngOnInit() {
        // Obtenemos ID de la URL
        this.encuestaId = this.route.snapshot.paramMap.get('id') || '';

        // Obtenemos datos precargados
        const data = this.route.snapshot.data['respuestas'];

        // El endpoint devuelve { encuestaId, respuestas: [...] }
        if (data && data.respuestas) {
            this.resultados = data.respuestas;
        } else {
            this.resultados = [];
        }
        this.loading = false;
    }

    // Helper para mostrar las opciones seleccionadas de forma bonita
    getOpcionesTexto(detalle: any): string {
        if (detalle.opciones_seleccionadas && detalle.opciones_seleccionadas.length > 0) {
            return detalle.opciones_seleccionadas.map((o: any) => o.texto).join(', ');
        }
        return '';
    }
}
