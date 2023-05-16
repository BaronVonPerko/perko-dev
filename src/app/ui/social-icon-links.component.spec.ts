import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialIconLinksComponent } from './social-icon-links.component';

describe('SocialIconLinksComponent', () => {
  let component: SocialIconLinksComponent;
  let fixture: ComponentFixture<SocialIconLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocialIconLinksComponent]
    });
    fixture = TestBed.createComponent(SocialIconLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
