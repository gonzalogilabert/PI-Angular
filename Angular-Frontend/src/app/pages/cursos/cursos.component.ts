import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/models';

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cursos.component.html',
    styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
    cursoService = inject(CursoService);
    route = inject(ActivatedRoute); // Inject ActivatedRoute
    cursos: Curso[] = [];

    ngOnInit(): void {
        // 1. Get preloaded data
        const resolvedData = this.route.snapshot.data['cursos'] || [];
        this.cursos = resolvedData;

        // 2. Sync service state
        this.cursoService.setCursos(resolvedData);

        // 3. Subscribe to the reactive state
        this.cursoService.cursos$.subscribe(data => {
            this.cursos = data;
        });
    }

    cargarCursos() {
        this.cursoService.getCursos().subscribe({
            error: (err) => console.error('Error cargando cursos', err)
        });
    }

    borrarCurso(id: string) {
        if (confirm('¿Estás seguro de eliminar este curso? Se eliminarán también sus matrículas.')) {
            // No need to manually reload, the service handles it now
            this.cursoService.borrarCurso(id).subscribe({
                error: (err) => console.error('Error borrando curso', err)
            });
        }
    }
}
