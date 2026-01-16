import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="notif$ | async as n" 
         class="toast-container" 
         [class.visible]="n.visible"
         [class.success]="n.tipo === 'success'"
         [class.error]="n.tipo === 'error'">
      <div class="toast-content">
        <span class="material-icons icon">
          {{ n.tipo === 'success' ? 'check_circle' : (n.tipo === 'error' ? 'error' : 'info') }}
        </span>
        <span class="message">{{ n.mensaje }}</span>
        <button class="close-btn" (click)="close()">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="progress-bar"></div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      min-width: 300px;
      max-width: 450px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      z-index: 9999;
      transform: translateX(120%);
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      overflow: hidden;
      border-left: 6px solid var(--primary-blue);
    }

    .toast-container.visible {
      transform: translateX(0);
    }

    .toast-container.success { border-left-color: #28a745; .icon { color: #28a745; } }
    .toast-container.error { border-left-color: #dc3545; .icon { color: #dc3545; } }

    .toast-content {
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 12px;
    }

    .icon { font-size: 24px; color: var(--primary-blue); }
    .message { flex: 1; font-weight: 500; color: #333; font-family: 'Segoe UI', sans-serif; }

    .close-btn {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      display: flex;
      padding: 4px;
      border-radius: 50%;
      transition: background 0.2s;
      &:hover { background: #f0f0f0; color: #333; }
    }

    .progress-bar {
      height: 4px;
      width: 100%;
      background: #eee;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: currentColor;
        opacity: 0.3;
        animation: progress 5s linear forwards;
      }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent {
    private ns = inject(NotificacionService);
    notif$ = this.ns.notificacion$;

    close() {
        this.ns.hide();
    }
}
