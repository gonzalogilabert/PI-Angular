import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-responder-encuesta',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    templateUrl: './responder-encuesta.html',
    styleUrls: ['./responder-encuesta.scss']
})
export class ResponderEncuestaComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private api = inject(ApiService);
    private fb = inject(FormBuilder);

    encuestaId: string = '';
    preguntas: any[] = [];
    loading = true;
    error = '';
    mensajeExito = '';

    // Simulamos un usuario logueado para este ejemplo.
    // En una app real, esto vendría de un AuthService
    // Puedes cambiar este ID por un ID válido de tu base de datos 'usuarios'
    userId = '692dc90dddc7df2333a01ebe'; // ID de Javier
    usuarioIdInput: string = '692dc90dddc7df2333a01ebe'; // Pre-llenado para pruebas

    respuestasForm: FormGroup = this.fb.group({
        respuestas: this.fb.array([])
    });

    ngOnInit() {
        // Obtenemos ID de la URL
        this.encuestaId = this.route.snapshot.paramMap.get('id') || '';

        // Obtenemos datos precargados por el Resolver (sin espera visual)
        const res = this.route.snapshot.data['preguntas'];

        if (Array.isArray(res)) {
            this.preguntas = res;
        } else if (res && res.preguntas) {
            this.preguntas = res.preguntas;
        } else {
            this.preguntas = [];
        }

        this.inicializarFormulario();
        this.loading = false; // Ya no hay carga, los datos ya están aquí
    }

    inicializarFormulario() {
        const respuestasArray = this.respuestasForm.get('respuestas') as FormArray;

        this.preguntas.forEach(pregunta => {
            // Creamos un grupo para cada pregunta
            const respuestaGroup = this.fb.group({
                preguntaId: [pregunta._id, Validators.required],
                tipo: [pregunta.tipo || 'texto'],
                texto_pregunta: [pregunta.texto_pregunta],
                respuesta_texto: [''],
                respuesta_numero: [null],
                opciones_seleccionadas: [[]] // Para multiselect
            });

            respuestasArray.push(respuestaGroup);
        });
    }

    get respuestasControls() {
        return (this.respuestasForm.get('respuestas') as FormArray).controls;
    }

    // Helper para manejar cambios en checkboxes (selección múltiple)
    onCheckboxChange(e: any, index: number, opcionId: string) {
        const respuestasArray = this.respuestasForm.get('respuestas') as FormArray;
        const group = respuestasArray.at(index);
        const opcionesControl = group.get('opciones_seleccionadas');

        let currentValues: string[] = opcionesControl?.value || [];

        if (e.target.checked) {
            currentValues.push(opcionId);
        } else {
            currentValues = currentValues.filter(v => v !== opcionId);
        }

        opcionesControl?.setValue(currentValues);
    }

    async enviarRespuestas() {
        if (!this.usuarioIdInput.trim()) {
            alert('Por favor ingresa un ID de Usuario válido para guardar las respuestas.');
            return;
        }

        // Iteramos sobre las respuestas y enviamos una por una (o podríamos adaptar el backend para batch)
        // El backend actual recibe POST /:encuestaId/pregunta/:preguntaId

        const respuestas = this.respuestasForm.value.respuestas;
        let successCount = 0;
        let errors = 0;

        this.loading = true;

        for (const r of respuestas) {
            // Prepara el payload según el backend
            const payload = {
                userId: this.usuarioIdInput.trim(), // Usamos el input manual por ahora
                respuesta_texto: r.respuesta_texto,
                respuesta_numero: r.respuesta_numero,
                opciones_seleccionadas: r.opciones_seleccionadas // array de IDs
            };

            // Si es selección simple (radio), puede que el valor venga diferente, adaptamos:
            // Si usaste radio buttons, podrías guardarlo en respuesta_texto o opciones_seleccionadas[0]
            // Depende de cómo tu backend espere 'selección simple'.
            // Tu backend usa 'opciones_seleccionadas' array de ObjectIds.

            try {
                await this.api.enviarRespuesta(this.encuestaId, r.preguntaId, payload).toPromise();
                successCount++;
            } catch (e) {
                console.error(e);
                errors++;
            }
        }

        this.loading = false;

        if (errors === 0) {
            this.mensajeExito = '¡Todas las respuestas se guardaron correctamente!';
            // Opcional: navegar a otra pantalla o resetear
            setTimeout(() => this.router.navigate(['/']), 2000);
        } else {
            this.error = `Se guardaron ${successCount} respuestas, pero fallaron ${errors}.`;
        }
    }
}
