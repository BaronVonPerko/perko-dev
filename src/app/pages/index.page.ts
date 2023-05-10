import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero">
      
    </section>
  `,
  styles: [`
  section.hero {
    background-image: url('/hero.jpeg');
    min-height: 80vh;
    background-size: cover;
    background-attachment: fixed;
  }
  `],
})
export default class HomeComponent {
}
