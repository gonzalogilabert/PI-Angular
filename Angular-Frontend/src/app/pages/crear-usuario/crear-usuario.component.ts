import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/models';

@Component({
    selector: 'app-crear-usuario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './crear-usuario.component.html',
    styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
    fb = inject(FormBuilder);
    usuarioService = inject(UsuarioService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    form: FormGroup;
    isEditMode = false;
    usuarioId: string | null = null;
    submitted = false;

    constructor() {
        this.form = this.fb.group({
            nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: [''], // Only required for new users, validation handled in submit
            rol: ['Alumno', Validators.required]
        });
    }

    ngOnInit(): void {
        this.usuarioId = this.route.snapshot.paramMap.get('id');
        if (this.usuarioId) {
            this.isEditMode = true;

            // Check for resolved data
            const usuario = this.route.snapshot.data['usuario'];
            if (usuario) {
                this.form.patchValue({
                    nombre_completo: usuario.nombre_completo,
                    email: usuario.email,
                    rol: usuario.rol
                });
                this.form.get('password')?.clearValidators();
                this.form.get('password')?.updateValueAndValidity();
            }
        } else {
            this.form.get('password')?.addValidators([Validators.required, Validators.minLength(6)]);
        }
    }

    cargarUsuario(id: string) {
        // Logic replaced by resolver consumption in ngOnInit
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) return;

        const usuarioData: Usuario = this.form.value;

        if (this.isEditMode && this.usuarioId) {
            // Don't send password if empty in edit mode
            if (!usuarioData.password) {
                delete usuarioData.password;
            }
            this.usuarioService.actualizarUsuario(this.usuarioId, usuarioData).subscribe({
                next: () => this.router.navigate(['/usuarios']),
                error: (err) => console.error('Error actualizando usuario', err)
            });
        } else {
            this.usuarioService.crearUsuario(usuarioData).subscribe({
                next: () => this.router.navigate(['/usuarios']),
                error: (err) => console.error('Error creando usuario', err)
            });
        }
    }
}
