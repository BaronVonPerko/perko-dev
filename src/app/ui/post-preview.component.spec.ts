import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPreviewComponent } from './post-preview.component';

describe('PostPreviewComponent', () => {
  let component: PostPreviewComponent;
  let fixture: ComponentFixture<PostPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostPreviewComponent]
    });
    fixture = TestBed.createComponent(PostPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
