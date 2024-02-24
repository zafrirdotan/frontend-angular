import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatGptPageComponent } from './chat-gpt-page.component';


describe('ChatGptPageComponent', () => {
  let component: ChatGptPageComponent;
  let fixture: ComponentFixture<ChatGptPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatGptPageComponent]
    });
    fixture = TestBed.createComponent(ChatGptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
