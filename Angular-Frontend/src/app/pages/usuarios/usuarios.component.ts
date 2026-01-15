import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/models';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
    usuarioService = inject(UsuarioService);
    route = inject(ActivatedRoute);
    usuarios: Usuario[] = [];

    ngOnInit(): void {
        // 1. Get preloaded data
        const resolvedData = this.route.snapshot.data['usuarios'] || [];
        this.usuarios = resolvedData;

        // 2. Sync service state
        this.usuarioService.setUsuarios(resolvedData);

        // 3. Subscribe to the reactive state
        this.usuarioService.usuarios$.subscribe(data => {
            this.usuarios = data;
        });
    }

    cargarUsuarios() {
        this.usuarioService.getUsuarios().subscribe({
            error: (err) => console.error('Error cargando usuarios', err)
        });
    }

    borrarUsuario(id: string) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            // No need to manually reload, the service handles it now
            this.usuarioService.borrarUsuario(id).subscribe({
                error: (err) => console.error('Error borrando usuario', err)
            });
        }
    }
}
