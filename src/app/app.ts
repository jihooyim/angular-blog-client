import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from "./shared/components/loading-overlay/loading-overlay.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true, // ★ standalone
})
export class App {
  protected readonly title = signal('blog-client');
}
