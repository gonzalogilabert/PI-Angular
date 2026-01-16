import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-encuesta.html',
  styleUrl: './crear-encuesta.scss'
})
export class CrearEncuestaComponent implements OnInit {
  encuestaForm: FormGroup;
  isEditMode = false;
  encuestaId: string | null = null;
  generatedLink: string | null = null;
  linkCopiado = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notif: NotificacionService
  ) {
    // Inicialización del formulario
    this.encuestaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      destinatario: ['', Validators.required],
      tiempo_limite: [null, [Validators.min(1)]],
      preguntas: this.fb.array([])
    });
  }


  ngOnInit() {
    this.encuestaId = this.route.snapshot.paramMap.get('id');
    if (this.encuestaId) {
      this.isEditMode = true;
      this.generatedLink = `${window.location.origin}/responder-encuesta/${this.encuestaId}`;
      // this.cargarDatosParaEditar(this.encuestaId);
    }
  }

  get preguntasArray(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  // Crear el grupo de controles para cada pregunta
  crearPregunta(): FormGroup {
    return this.fb.group({
      texto_pregunta: ['', Validators.required],
      es_obligatoria: [false],
      limite_caracteres: [250, [Validators.min(1)]]
    });
  }

  addPregunta(): void {
    this.preguntasArray.push(this.crearPregunta());
  }

  removePregunta(index: number): void {
    this.preguntasArray.removeAt(index);
  }

  copiarLink(): void {
    if (this.generatedLink) {
      navigator.clipboard.writeText(this.generatedLink);
      this.linkCopiado = true;
      setTimeout(() => this.linkCopiado = false, 2000);
    }
  }

  onSubmit(): void {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      this.notif.error('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    const datos = this.encuestaForm.value;
    console.log('Datos que se van a enviar:', datos);

    if (this.isEditMode && this.encuestaId) {
      this.apiService.actualizarEncuesta(this.encuestaId, datos).subscribe({
        next: (res: any) => {
          this.generatedLink = `${window.location.origin}/responder-encuesta/${this.encuestaId}`;
          this.notif.success('✅ Encuesta actualizada con éxito');
        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          this.notif.error('❌ Error al actualizar la encuesta.');
        }
      });
    } else {
      this.apiService.crearEncuesta(datos).subscribe({
        next: (res: any) => {
          const id = res.encuesta._id;
          this.generatedLink = `${window.location.origin}/responder-encuesta/${id}`;
          this.notif.success('✅ Encuesta guardada con éxito. ¡Copia el link para compartirla!');
        },
        error: (err: any) => {
          console.error('Error al guardar:', err);
          this.notif.error('❌ Error al conectar con el servidor.');
        }
      });
    }
  }
}