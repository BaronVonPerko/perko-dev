import { Injectable } from "@angular/core";
import { PortfolioAttributes, PostAttributes, TalkAttributes } from "../models";
import {injectContentFiles, ContentFile, injectContent} from "@analogjs/content";
import { WorkshopAttributes } from "../models/workshop-attributes";

@Injectable({
  providedIn: "root"
})
export class ContentService {
  readonly blogs = injectContentFiles<PostAttributes>((contentFile) => {
    console.log(contentFile.filename);
    return contentFile.filename.includes('/content/posts/');
  });

  readonly talks = injectContentFiles<TalkAttributes>((contentFile) => {
    return contentFile.filename.includes('/content/talks/');
  });

  readonly portfolio = injectContentFiles<PortfolioAttributes>((contentFile) => {
    return contentFile.filename.includes('/content/portfolio/');
  });

  readonly workshops = injectContentFiles<WorkshopAttributes>((contentFile) => {
    return contentFile.filename.includes('/content/workshops/');
  });
}
