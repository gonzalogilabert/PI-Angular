import { Routes, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta';
import { HomeComponent } from './pages/home/home';
import { EncuestaDetalleComponent } from './pages/encuesta-detalle/encuesta-detalle';
import { ResponderEncuestaComponent } from './pages/responder-encuesta/responder-encuesta';
import { VerRespuestasComponent } from './pages/ver-respuestas/ver-respuestas';
import { ApiService } from './services/api';
import { UsuarioService } from './services/usuario.service';
import { CursoService } from './services/curso.service';

// --- RESOLVERS ---

// Encuestas
export const preguntasResolver: ResolveFn<any> = (route) => {
  // console.log('Resolving preguntas...');
  return inject(ApiService).getPreguntas(route.paramMap.get('id')!);
};

export const encuestaResolver: ResolveFn<any> = (route) => {
  return inject(ApiService).getEncuestaPorId(route.paramMap.get('id')!);
};

export const listaEncuestasResolver: ResolveFn<any> = () => {
  return inject(ApiService).getDatos();
};

export const respuestasResolver: ResolveFn<any> = (route) => {
  return inject(ApiService).obtenerRespuestas(route.paramMap.get('id')!);
};

// Usuarios
export const listaUsuariosResolver: ResolveFn<any> = () => {
  return inject(UsuarioService).getUsuarios();
};

export const usuarioResolver: ResolveFn<any> = (route) => {
  return inject(UsuarioService).getUsuario(route.paramMap.get('id')!);
};

// Cursos
export const listaCursosResolver: ResolveFn<any> = () => {
  return inject(CursoService).getCursos();
};

export const cursoResolver: ResolveFn<any> = (route) => {
  return inject(CursoService).getCurso(route.paramMap.get('id')!);
};


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    resolve: { encuestas: listaEncuestasResolver }
  },
  { path: 'crear-encuesta', component: CrearEncuestaComponent },
  {
    path: 'editar-encuesta/:id',
    component: CrearEncuestaComponent,
    resolve: { encuesta: encuestaResolver, preguntas: preguntasResolver }
  },
  {
    path: 'encuesta/:id',
    component: EncuestaDetalleComponent,
    resolve: { encuesta: encuestaResolver }
  },
  {
    path: 'responder-encuesta/:id',
    component: ResponderEncuestaComponent,
    resolve: { preguntas: preguntasResolver }
  },
  {
    path: 'ver-respuestas/:id',
    component: VerRespuestasComponent,
    resolve: { respuestas: respuestasResolver, encuesta: encuestaResolver } // encuestaResolver opcional si visualizamos titulo
  },

  // Nuevas rutas con Resolvers
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    resolve: { usuarios: listaUsuariosResolver }
  },
  { path: 'crear-usuario', loadComponent: () => import('./pages/crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent) },
  {
    path: 'editar-usuario/:id',
    loadComponent: () => import('./pages/crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent),
    resolve: { usuario: usuarioResolver }
  },
  {
    path: 'cursos',
    loadComponent: () => import('./pages/cursos/cursos.component').then(m => m.CursosComponent),
    resolve: { cursos: listaCursosResolver }
  },
  { path: 'crear-curso', loadComponent: () => import('./pages/crear-curso/crear-curso.component').then(m => m.CrearCursoComponent) },
  {
    path: 'editar-curso/:id',
    loadComponent: () => import('./pages/crear-curso/crear-curso.component').then(m => m.CrearCursoComponent),
    resolve: { curso: cursoResolver }
  }
];