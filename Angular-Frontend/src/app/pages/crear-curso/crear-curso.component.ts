import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/models';

@Component({
    selector: 'app-crear-curso',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './crear-curso.component.html',
    styleUrls: ['./crear-curso.component.scss']
})
export class CrearCursoComponent implements OnInit {
    fb = inject(FormBuilder);
    cursoService = inject(CursoService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    form: FormGroup;
    isEditMode = false;
    cursoId: string | null = null;
    submitted = false;

    constructor() {
        this.form = this.fb.group({
            nombre_curso: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', [Validators.required]],
            anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]]
        });
    }

    ngOnInit(): void {
        this.cursoId = this.route.snapshot.paramMap.get('id');
        if (this.cursoId) {
            this.isEditMode = true;

            const curso = this.route.snapshot.data['curso'];
            if (curso) {
                this.form.patchValue({
                    nombre_curso: curso.nombre_curso,
                    descripcion: curso.descripcion,
                    anio: curso.anio
                });
            }
        }
    }

    cargarCurso(id: string) {
        // Logic replaced by resolver consumption in ngOnInit
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) return;

        const cursoData: Curso = this.form.value;

        if (this.isEditMode && this.cursoId) {
            this.cursoService.actualizarCurso(this.cursoId, cursoData).subscribe({
                next: () => this.router.navigate(['/cursos']),
                error: (err) => console.error('Error actualizando curso', err)
            });
        } else {
            this.cursoService.crearCurso(cursoData).subscribe({
                next: () => this.router.navigate(['/cursos']),
                error: (err) => console.error('Error creando curso', err)
            });
        }
    }
}
