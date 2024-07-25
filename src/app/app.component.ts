import { Component, effect, OnInit, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { SocialIconLinksComponent } from "./ui/social-icon-links.component";
import { MatPrefix } from "@angular/material/form-field";
import { MAT_CARD_CONFIG } from "@angular/material/card";
import { MainIconComponent } from "./ui/app-icon.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatIcon, MatIconButton, MatToolbar, MatToolbarRow, MatAnchor, RouterLink, SocialIconLinksComponent, MatPrefix, RouterLinkActive, MainIconComponent],
    providers: [{
       provide:  MAT_CARD_CONFIG, useValue: {appearance: 'outlined'}
    }],
    template: `
        @if (theme() !== null) {
        <main [class.light-theme]="theme() === 'light'" [class.dark-theme]="theme() === 'dark'"
              class="mat-app-background">
            <mat-toolbar>
                <mat-toolbar-row>
                    <app-main-icon />
                    <a mat-button routerLink="/blog" routerLinkActive="button-nav-active">
                        <mat-icon matIconPrefix>article</mat-icon>
                        Blog</a>
                    <a mat-button routerLink="/talks" routerLinkActive="button-nav-active">
                        <mat-icon matIconPrefix>microphone</mat-icon>
                        Talks</a>
                    <span class="spacer"></span>
                    <button mat-icon-button (click)="toggleTheme()">
                        @if (theme() === 'light') {
                            <mat-icon>dark_mode</mat-icon>
                        } @else {
                            <mat-icon>light_mode</mat-icon>
                        }
                    </button>
                    <app-social-icon-links />
                </mat-toolbar-row>
            </mat-toolbar>
            <div class="content">
            <router-outlet></router-outlet>
            </div>
            
            <footer>
                <mat-toolbar>
                &copy; {{ currentYear }} Chris Perko
                </mat-toolbar>
            </footer>
        </main>
        }
    `,
    styles: `
        .spacer {
            flex: 1 1 auto;
        }

        a {
            margin-right: 4px;
        }

        .content {
            display: block;
            max-width: var(--perko-page-width);
            padding: 2rem;
            margin: 0 auto;
            min-height: 100vh;
        }
        
        footer mat-toolbar {
            display: flex;
            justify-content: center;
        }
    `
})
export class AppComponent implements OnInit {
    protected readonly theme = signal<'light' | 'dark' | null>(null);
    protected toggleTheme = () => this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    protected currentYear = new Date().getFullYear();

    themeUpdated = effect(() => {
        localStorage.setItem('theme', this.theme() ?? '');
    });

    ngOnInit() {
        this.theme.set(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
    }
}
