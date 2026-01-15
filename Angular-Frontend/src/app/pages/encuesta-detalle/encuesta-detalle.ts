import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-encuesta-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './encuesta-detalle.html',
  styleUrl: './encuesta-detalle.scss'
})
export class EncuestaDetalleComponent implements OnInit {

  // Inyecciones de dependencias
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef); // 🛠️ Herramienta para forzar la actualización visual

  // Variables de datos
  encuesta: any = null;
  preguntas: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    // 1. Obtenemos datos precargados
    this.encuesta = this.route.snapshot.data['encuesta'];

    // 2. Obtenemos preguntas precargadas (si existen)
    // El backend devuelve array directo o { preguntas: [] } dependiendo del endpoint,
    // pero el resolver usa getPreguntas que devuelve array. Validemos por si acaso.
    const resPreguntas = this.route.snapshot.data['preguntas'];
    this.preguntas = Array.isArray(resPreguntas) ? resPreguntas : (resPreguntas?.preguntas || []);

    this.cargando = false;
  }
}