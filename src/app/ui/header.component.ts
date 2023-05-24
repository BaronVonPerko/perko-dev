import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [CommonModule],
  template: `
      <header>
          <a style="border-bottom: 0" href="/"><img src="/logo.png" alt="logo"/></a>
          <ul>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/talks">Talks</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
          </ul>
      </header>
  `,
  styles: [
      `
          header {
              background-color: var(--color-primary);
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              max-width: var(--max-page-width);
              margin: 0 auto;
          }

          @media (max-width: 800px) {
              header {
                  flex-direction: column;
              }
              
              header ul {
                  width: 100%;
                  justify-content: center;
              }
          }

          img {
              max-width: 160px;
          }

          ul {
              list-style: none;
              display: flex;
              padding: 0;
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
