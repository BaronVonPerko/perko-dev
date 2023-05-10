import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero">
    </section>
    <section class="about">
      <h1>Welcome!</h1>
      <p>My name is Chris Perko.  I make things with Angular, and help others to do the same!</p>
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
      border: 4px solid var(--color-accent);
      width: 60%;
      margin: -80px 0 0 10%;
      background-color: var(--color-primary);
      padding: 20px;
    }
  `],
})
export default class HomeComponent {
}
