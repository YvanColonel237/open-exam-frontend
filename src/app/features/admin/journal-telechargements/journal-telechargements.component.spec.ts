import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTelechargementsComponent } from './journal-telechargements.component';

describe('JournalTelechargementsComponent', () => {
  let component: JournalTelechargementsComponent;
  let fixture: ComponentFixture<JournalTelechargementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalTelechargementsComponent]
    });
    fixture = TestBed.createComponent(JournalTelechargementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
