import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {provideClientHydration} from '@angular/platform-browser';
import {provideFileRouter} from '@analogjs/router';
import {provideContent, withMarkdownRenderer} from '@analogjs/content';
import { withPrismHighlighter } from "@analogjs/content/prism-highlighter";
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
    providers: [
        provideFileRouter(),
        provideHttpClient(),
        provideAnimations(),
        // provideClientHydration(),
        provideContent(withMarkdownRenderer(), withPrismHighlighter())
    ],
};
