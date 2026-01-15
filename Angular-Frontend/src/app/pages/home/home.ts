import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute

  listaDatos: any[] = [];
  // isLoading removed because we have data before we enter

  constructor() { }

  ngOnInit() {
    // 1. Get preloaded data
    const resolvedData = this.route.snapshot.data['encuestas'] || [];
    this.listaDatos = resolvedData;

    // 2. Sync service state (Fix for SSR/Client mismatch)
    this.apiService.setEncuestas(resolvedData);

    // 3. Subscribe to reactive state for future updates
    this.apiService.encuestas$.subscribe(data => {
      this.listaDatos = data;
      this.cd.detectChanges();
    });
  }

  borrarEncuesta(id: string) {
    if (confirm('¿Seguro que quieres borrar?')) {
      this.apiService.borrarEncuesta(id).subscribe({
        error: (err) => console.error(err)
      });
    }
  }
}