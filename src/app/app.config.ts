import {provideHttpClient} from "@angular/common/http";
import {ApplicationConfig, provideZonelessChangeDetection} from "@angular/core";
import {provideFileRouter} from "@analogjs/router";
import {provideContent, withMarkdownRenderer} from "@analogjs/content";
import {withPrismHighlighter} from "@analogjs/content/prism-highlighter";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideClientHydration} from "@angular/platform-browser";
import {withInMemoryScrolling} from "@angular/router";
import {DATE_PIPE_DEFAULT_OPTIONS} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withInMemoryScrolling({scrollPositionRestoration: "top"}),
    ),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideAnimations(),
    provideClientHydration(),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
    {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {timezone: "+0"}}
  ]
};
