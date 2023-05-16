import {Component} from '@angular/core';
import {ControlButtonsComponent} from '../ui/control-buttons.component';
import {RecentPostsComponent} from '../ui/recent-posts.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        ControlButtonsComponent,
        RecentPostsComponent,
    ],
    template: `
        <section class="hero">
        </section>
        <section class="about">
            <app-control-buttons/>
            <h1>👋🏻 Hello!</h1>
            <p>Hi there! I'm Chris Perko, a passionate and experienced software engineer who loves working with Angular.
                At <a href="https://hero.dev" target="_blank">HeroDevs</a>, I tackle complex and exciting challenges
                every day, using the latest technologies and best practices.</p>
            <p>But that's not all! I also enjoy sharing my knowledge and enthusiasm with the Angular community. I
                co-organize the <a href="https://angularcommunity.net/" target="_blank">Angular Community Meetup</a>,
                where we host awesome speakers and events. And sometimes, I get to be one of those speakers myself! I've
                spoken at the meetup as well as <a href="https://ng-conf.org/" target="_blank">ng-conf</a> about Angular
                topics, and I always have a blast doing it.</p>
            <p>If you want to know more about me or my work, feel free to contact me anytime. I'd love to hear from
                you!</p>
        </section>
        <section class="recent-posts">
            <h3>Latest Post</h3>
            <app-recent-posts count="1" />
            <a href="/blog" class="linkbtn">See All Posts</a>
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
            max-width: var(--max-page-width);
            margin: -80px auto 0;
            background-color: var(--color-primary);
            padding: 0 20px 20px;
        }

        section.recent-posts {
            margin: 40px auto;
            max-width: var(--max-page-width);
            display: flex;
            align-items: center;
            flex-direction: column;
        }
        
        section.recent-posts app-recent-posts {
            margin: 0 auto 20px;
        }
    `],
})
export default class HomeComponent {}
