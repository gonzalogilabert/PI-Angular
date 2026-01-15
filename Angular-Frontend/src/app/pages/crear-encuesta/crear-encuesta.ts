import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-encuesta.html',
  styleUrl: './crear-encuesta.scss'
})
export class CrearEncuestaComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 1. Definición del formulario con validación de tiempo (mínimo 1)
  encuestaForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    tiempo_limite: [null, [Validators.min(1)]], 
    preguntas: this.fb.array([]) 
  });

  isEditMode = false;       
  encuestaId: string | null = null; 

  get preguntasArray() {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  ngOnInit() {
    this.encuestaId = this.route.snapshot.paramMap.get('id');
    if (this.encuestaId) {
      this.isEditMode = true;
      this.cargarDatosParaEditar(this.encuestaId);
    }
  }

  cargarDatosParaEditar(id: string) {
    this.apiService.getEncuestaPorId(id).subscribe((data: any) => {
      this.encuestaForm.patchValue({
        titulo: data.titulo,
        descripcion: data.descripcion,
        tiempo_limite: data.tiempo_limite
      });

      this.apiService.getPreguntas(id).subscribe((preguntas: any[]) => {
        this.preguntasArray.clear();
        preguntas.forEach(p => {
          const preguntaGroup = this.fb.group({
            texto_pregunta: [p.texto_pregunta, Validators.required],
            es_obligatoria: [p.es_obligatoria || false],
            limite_caracteres: [p.limite_caracteres || 0]
          });
          this.preguntasArray.push(preguntaGroup);
        });
      });
    });
  }

  // 2. Añadir pregunta con los nuevos campos
  addPregunta() {
    const preguntaGroup = this.fb.group({
      texto_pregunta: ['', Validators.required],
      es_obligatoria: [false], 
      limite_caracteres: [0] 
    });
    this.preguntasArray.push(preguntaGroup);
  }

  removePregunta(index: number) {
    this.preguntasArray.removeAt(index);
  }

  onSubmit() {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    const datos = this.encuestaForm.value;
    if (this.isEditMode && this.encuestaId) {
      this.apiService.actualizarEncuesta(this.encuestaId, datos).subscribe({
        next: () => { alert('Encuesta actualizada'); this.irAlInicioConRetraso(); },
        error: (err) => console.error(err)
      });
    } else {
      this.apiService.crearEncuesta(datos).subscribe({
        next: () => { alert('Encuesta creada'); this.irAlInicioConRetraso(); },
        error: (err) => console.error(err)
      });
    }
  }

  irAlInicioConRetraso() {
    setTimeout(() => { this.router.navigate(['/']); }, 100); 
  }
}