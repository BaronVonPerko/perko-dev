import { Component } from "@angular/core";
import { ControlButtonsComponent } from "../ui/control-buttons.component";
import { RecentPostsComponent } from "../ui/recent-posts.component";
import { SocialIconLinksComponent } from "../ui/social-icon-links.component";
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from "@angular/material/card";
import { MatFabAnchor, MatIconAnchor, MatIconButton } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { ImagePipe } from "../pipes/image.pipe";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    ControlButtonsComponent,
    RecentPostsComponent,
    SocialIconLinksComponent,
    MatCardModule,
    MatIconModule,
    MatFabAnchor,
    RouterLink,
    ImagePipe,
    MatTooltipModule,
  ],
  template: `
    <section class="cards">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Hello! 👋🏻</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        I'm Chris Perko, a senior engineer at <a href="https://hero.dev" target="_blank">HeroDevs</a> and
        a Google Developer Expert in Angular! I love building cool stuff with Angular and sharing my knowledge
        with the community. I'm also a co-organizer of the
        <a href="https://angularcommunity.net/" target="_blank">Angular Community Meetup</a> and a speaker at
        various events.
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
    
    <h2>Latest Post</h2>

    <section class="posts">
      <app-recent-posts count="1" />
      <a mat-fab extended routerLink="/blog">
        <mat-icon>arrow_forward</mat-icon>
        See More Posts</a>
    </section>
  `,
  styles: `
      h2 {
          text-align: center;
      }
      section.cards {
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-gap: 8px;
      }
      section.posts {
          display: flex;
          align-items: center;
          justify-content: center;

          a {
              margin-left: 8px;
          }
          
          app-recent-posts {
              max-width: 400px;
              width: 100%;
          }
      }
      ul.skills {
          list-style-type: none;
          padding: 0;
          margin: 0;
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
export default class HomeComponent {
}
