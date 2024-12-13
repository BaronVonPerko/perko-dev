import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { SocialIconLinksComponent } from "./ui/social-icon-links.component";
import { MatPrefix } from "@angular/material/form-field";
import { MAT_CARD_CONFIG } from "@angular/material/card";
import { MainIconComponent } from "./ui/app-icon.component";
import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [AsyncPipe, RouterOutlet, MatIcon, MatIconButton, MatToolbar, MatToolbarRow, MatAnchor, RouterLink, SocialIconLinksComponent, MatPrefix, RouterLinkActive, MainIconComponent],
    providers: [{
       provide:  MAT_CARD_CONFIG, useValue: {appearance: 'outlined'}
    }],
    template: `
        @if (theme() !== null) {
            <main [class.light-theme]="theme() === 'light'" [class.dark-theme]="theme() === 'dark'"
                  class="mat-app-background">
                <mat-toolbar>
                    @if (!(isSmallScreen | async)) {
                    <mat-toolbar-row>
                        <app-main-icon />
                        <a mat-button routerLink="/blog" routerLinkActive="button-nav-active">
                            <mat-icon matIconPrefix>article</mat-icon>
                            Blog</a>
                        <a mat-button routerLink="/talks" routerLinkActive="button-nav-active">
                            <mat-icon matIconPrefix>microphone</mat-icon>
                            Talks</a>
                        <a mat-button routerLink="/workshops" routerLinkActive="button-nav-active">
                            <mat-icon matIconPrefix>laptop_mac</mat-icon>
                            Workshops
                        </a>
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
                    } @else {
                        <mat-toolbar-row>
                            <app-main-icon />
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
                        <mat-toolbar-row>
                            <a mat-button routerLink="/blog" routerLinkActive="button-nav-active">
                                <mat-icon matIconPrefix>article</mat-icon>
                                Blog</a>
                            <a mat-button routerLink="/talks" routerLinkActive="button-nav-active">
                                <mat-icon matIconPrefix>microphone</mat-icon>
                                Talks</a>
                            <a mat-button routerLink="/workshops" routerLinkActive="button-nav-active">
                                <mat-icon matIconPrefix>laptop_mac</mat-icon>
                                Workshops
                            </a>
                        </mat-toolbar-row>
                    }
                </mat-toolbar>
                <div class="content">
                    <router-outlet />
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
            
            @media (max-width: 600px) {
                padding: 1rem;
            }
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
    protected isSmallScreen = inject(BreakpointObserver).observe('(max-width: 600px)').pipe(map(result => result.matches));

    themeUpdated = effect(() => {
        if (typeof window !== 'undefined' && 'localStorage' in window) {
            localStorage.setItem('theme', this.theme() ?? '');
        }
    });

    ngOnInit() {
        if (typeof window !== 'undefined' && 'localStorage' in window) {
            this.theme.set(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
        }
    }
}
