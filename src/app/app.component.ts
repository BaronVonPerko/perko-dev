import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./ui/footer.component";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, MatIcon, MatIconButton, MatToolbar],
    template: `
      <main [class.light-theme]="theme() === 'light'" [class.dark-theme]="theme() === 'dark'">
        <mat-toolbar>
          <span>perko.dev</span>

          <span class="spacer"></span>

          <a href="/blog">Blog</a>
          <a href="/talks">Talks</a>
          <a href="/portfolio">Portfolio</a>

          <span class="spacer"></span>

          <button mat-icon-button (click)="toggleTheme()">
            @if (theme() === 'light') {
              <mat-icon>dark_mode</mat-icon>
            } @else {
              <mat-icon>light_mode</mat-icon>
            }
          </button>
        </mat-toolbar>
        <router-outlet></router-outlet>
        <app-footer />
      </main>
    `,
    styles: `
        .spacer {
            flex: 1 1 auto;
        }
    `
})
export class AppComponent {
    protected readonly theme = signal<'light' | 'dark'>('light');
    protected toggleTheme = () => this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
}
