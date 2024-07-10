import { Component } from "@angular/core";
import { ControlButtonsComponent } from "../ui/control-buttons.component";
import { RecentPostsComponent } from "../ui/recent-posts.component";
import { SocialIconLinksComponent } from "../ui/social-icon-links.component";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFabAnchor, MatIconAnchor, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    ControlButtonsComponent,
    RecentPostsComponent,
    SocialIconLinksComponent,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatIconButton,
    MatIcon,
    MatIconAnchor,
    MatFabAnchor,
    RouterLink
  ],
  template: `
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
      section.posts {
          display: flex;
          align-items: center;
          justify-content: center;

          a {
              margin-left: 8px;
          }
      }
  `
})
export default class HomeComponent {
}
