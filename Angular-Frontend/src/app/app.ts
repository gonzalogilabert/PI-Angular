import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToastComponent], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // La clase se queda vacía, solo sirve de marco
}