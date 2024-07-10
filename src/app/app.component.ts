import { Component, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from "./ui/footer.component";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, MatIcon, MatIconButton, MatToolbar, MatToolbarRow, MatAnchor, RouterLink],
    template: `
      <main [class.light-theme]="theme() === 'light'" [class.dark-theme]="theme() === 'dark'"
            class="mat-app-background">
        <mat-toolbar>
          <mat-toolbar-row>
            <span>perko.dev</span>
            <span class="spacer"></span>
            <button mat-icon-button (click)="toggleTheme()">
              @if (theme() === 'light') {
                <mat-icon>dark_mode</mat-icon>
              } @else {
                <mat-icon>light_mode</mat-icon>
              }
            </button>
          </mat-toolbar-row>
          <mat-toolbar-row>
            <a mat-raised-button routerLink="/">Home</a>
            <a mat-raised-button routerLink="/blog">Blog</a>
            <a mat-raised-button routerLink="/talks">Talks</a>
            <a mat-raised-button routerLink="/portfolio">Portfolio</a>
          </mat-toolbar-row>
        </mat-toolbar>
        <router-outlet></router-outlet>
        <app-footer />
      </main>
    `,
    styles: `
        .spacer {
            flex: 1 1 auto;
        }
        a {
            margin-right: 4px;
        }
    `
})
export class AppComponent {
    protected readonly theme = signal<'light' | 'dark'>('light');
    protected toggleTheme = () => this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
}
