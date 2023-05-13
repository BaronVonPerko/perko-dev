import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [CommonModule],
  template: `
      <header>
          <img src="/logo.png" alt="logo"/>
          <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/talks">Talks</a></li>
              <li><a href="#">Portfolio</a></li>
              <li><a href="#">Work History</a></li>
              <li><a href="#">Contact</a></li>
          </ul>
      </header>
  `,
  styles: [
      `
          header {
              background-color: var(--color-primary);
              padding: 0 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          img {
              max-width: 160px;
          }

          ul {
              list-style: none;
              display: flex;
          }

          li {
              margin: 0 20px;
          }

          li a {
              color: var(--color-secondary);
              font-size: 1.2rem;
              font-weight: 700;
              text-decoration: none;
              text-transform: uppercase;
              border-bottom: 0;
          }

          li a:hover {
              color: #6bcacb;
              text-shadow: 0 0 40px var(--color-secondary);
          }
      `
  ]
})
export class HeaderComponent {

}
