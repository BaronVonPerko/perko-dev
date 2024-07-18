import { Component } from "@angular/core";
import { MatIcon, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { MatFabAnchor, MatIconAnchor } from "@angular/material/button";

const ANGULAR_ICON = `<svg x="0px" y="0px" width="960px" height="960px" viewBox="0 0 960 960"><polygon _ngcontent-ng-c1910891413="" points="562.6,109.8 804.1,629.5 829.2,233.1"></polygon><polygon _ngcontent-ng-c1910891413="" points="624.9,655.9 334.3,655.9 297.2,745.8 479.6,849.8 662,745.8"></polygon><polygon _ngcontent-ng-c1910891413="" points="384.1,539.3 575.2,539.3 479.6,307"></polygon><polygon _ngcontent-ng-c1910891413="" points="396.6,109.8 130,233.1 155.1,629.5"></polygon></svg>`

@Component({
  selector: "app-main-icon",
  standalone: true,
  template: `
    <a mat-fab extended routerLink="/">
      <mat-icon svgIcon="angular" aria-hidden="false" aria-label="Chris Perko Home"></mat-icon>
      Chris Perko
    </a>
  `,
  imports: [
    MatIcon,
    RouterLink,
    MatIconAnchor,
    MatFabAnchor
  ],
  styles: `
  a {
      margin-right: 2rem;
  }
  `
})
export class MainIconComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('angular', sanitizer.bypassSecurityTrustHtml(ANGULAR_ICON))
  }
}
