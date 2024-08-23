import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {provideFileRouter} from '@analogjs/router';
import {provideContent, withMarkdownRenderer} from '@analogjs/content';
import { withPrismHighlighter } from "@analogjs/content/prism-highlighter";
import { provideAnimations } from "@angular/platform-browser/animations";
import { withInMemoryScrolling } from "@angular/router";

export const appConfig: ApplicationConfig = {
    providers: [
        provideFileRouter(
          withInMemoryScrolling({scrollPositionRestoration: 'top'})
        ),
        provideHttpClient(),
        provideAnimations(),
        provideContent(withMarkdownRenderer(), withPrismHighlighter())
    ],
};
