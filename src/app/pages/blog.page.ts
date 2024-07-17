import {Component} from '@angular/core';
import {RecentPostsComponent} from '../ui/recent-posts.component';
import { ImagePipe } from "../pipes/image.pipe";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
    standalone: true,
    imports: [
        RecentPostsComponent,
        ImagePipe,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatTooltip
    ],
    template: `
        <section class="cards">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Hello! 👋🏻</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <p>I'm Chris Perko, a senior engineer at <a href="https://hero.dev" target="_blank">HeroDevs</a> and
                    a Google Developer Expert in Angular! I love building cool stuff with Angular and sharing my knowledge
                    with the community. I'm also a co-organizer of the
                    <a href="https://angularcommunity.net/" target="_blank">Angular Community Meetup</a> and a speaker at
                    various events.</p>
                </mat-card-content>
            </mat-card>
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Skills</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <ul class="skills">
                        <li>
                            <img [src]="'angular-logo.png' | image" matTooltip="Angular" alt="Angular Logo">
                        </li>
                        <li>
                            <img [src]="'material-logo.png' | image" matTooltip="Angular Material" alt="Angular Material Logo">
                        </li>
                        <li><img [src]="'rxjs-logo.png' | image" matTooltip="RxJS" alt="RxJS Logo"></li>
                        <li><img [src]="'ngrx-logo.png' | image" matTooltip="NGRX" alt="NGRX Logo"></li>
                        <li><img [src]="'typescript-logo.png' | image" matTooltip="TypeScript" alt="TypeScript Logo"></li>
                    </ul>
                </mat-card-content>
            </mat-card>
        </section>
        <app-recent-posts />
    `,
    styles: `
        section.cards {
            display: grid;
            grid-template-columns: 1fr;
            grid-gap: 1rem;
            margin-bottom: 2rem;
        }
        @media(min-width: 768px) {
            section.cards {
                grid-template-columns: 2fr 1fr;
            }
        }
        ul.skills {
            list-style-type: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
            grid-gap: 8px;

            img {
                width: 60px;
                height: 60px;
                transition: transform 0.2s;
                &:hover {
                    transform: rotate(10deg);
                }
            }
        }
    `
})
export default class BlogListComponent {
}
