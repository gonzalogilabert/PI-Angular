import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-encuesta.html',
  styleUrl: './crear-encuesta.scss'
})
export class CrearEncuestaComponent {
  encuestaForm: FormGroup;

<<<<<<< HEAD
  constructor(private fb: FormBuilder) {
  this.encuestaForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''], // <-- ESTO ELIMINA EL ERROR ROJO
    tiempoLimite: [0],
    preguntas: this.fb.array([])
=======
  // 1. Definición del formulario con validación de tiempo (mínimo 1)
  encuestaForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    tiempo_limite: [null, [Validators.min(1)]], 
    preguntas: this.fb.array([]) 
>>>>>>> 7f07b40 (Cambios gonzalo)
  });
}

<<<<<<< HEAD
  get preguntasArray(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  // Crea una pregunta con todos los campos de tu HTML
  crearPregunta(): FormGroup {
    return this.fb.group({
      texto: ['', Validators.required],
      obligatoria: [false],
      limite: ['250']
    });
  }

  addPregunta(): void {
    this.preguntasArray.push(this.crearPregunta());
  }

  removePregunta(index: number): void {
    this.preguntasArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.encuestaForm.valid) {
      console.log('Datos listos para enviar:', this.encuestaForm.value);
    }
  }
}
=======
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
>>>>>>> 7f07b40 (Cambios gonzalo)
