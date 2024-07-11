import { Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { FooterComponent } from "./ui/footer.component";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { SocialIconLinksComponent } from "./ui/social-icon-links.component";
import { MatPrefix } from "@angular/material/form-field";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, MatIcon, MatIconButton, MatToolbar, MatToolbarRow, MatAnchor, RouterLink, SocialIconLinksComponent, MatPrefix, RouterLinkActive],
    template: `
        <main [class.light-theme]="theme() === 'light'" [class.dark-theme]="theme() === 'dark'"
              class="mat-app-background">
            <mat-toolbar>
                <mat-toolbar-row>
                    <span>perko.dev</span>
                    <a mat-button routerLink="/blog" routerLinkActive="button-nav-active">
                        <mat-icon matIconPrefix>article</mat-icon>
                        Blog</a>
                    <a mat-button routerLink="/talks" routerLinkActive="button-nav-active">
                        <mat-icon matIconPrefix>microphone</mat-icon>
                        Talks</a>
                    <a mat-button routerLink="/portfolio" routerLinkActive="button-nav-active">
                        <mat-icon matIconPrefix>work</mat-icon>
                        Portfolio</a>
                    <span class="spacer"></span>
                    <app-social-icon-links />
                    <button mat-icon-button (click)="toggleTheme()">
                        @if (theme() === 'light') {
                            <mat-icon>dark_mode</mat-icon>
                        } @else {
                            <mat-icon>light_mode</mat-icon>
                        }
                    </button>
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
