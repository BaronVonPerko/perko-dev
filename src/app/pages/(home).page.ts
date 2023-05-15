import { Component } from '@angular/core';
import {ControlButtonsComponent} from '../ui/control-buttons.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero">
    </section>
    <section class="about">
      <app-control-buttons />
      <h1>Welcome!</h1>
      <p>My name is Chris Perko. I make things with Angular, and help others to do the same!</p>
      <p>I work as a senior software engineering consultant for <a href="https://hero.dev" target="_blank">HeroDevs</a>,
        and I get
        to help companies solve challenging problems every day with Angular.</p>
      <p>I also love sharing knowledge. You can find my blog here on this site, but I also help with the
        <a href="https://angularcommunity.net/" target="_blank">Angular Community Meetup</a> as a co-organizer, as well
        as give talks at conferences!</p>
    </section>
  `,
  styles: [`
    section.hero {
      background-image: url('/hero.jpeg');
      min-height: 80vh;
      background-size: cover;
      background-attachment: fixed;
    }

    section.about {
      position: relative;
      border: 4px solid var(--color-secondary);
      width: 60%;
      margin: -80px 0 0 10%;
      background-color: var(--color-primary);
      padding: 0 20px 20px;
    }
  `],
  imports: [
    ControlButtonsComponent
  ]
})
export default class HomeComponent {
}
