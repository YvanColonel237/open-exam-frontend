import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenCreateEditComponent } from './examen-create-edit.component';

describe('ExamenCreateEditComponent', () => {
  let component: ExamenCreateEditComponent;
  let fixture: ComponentFixture<ExamenCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamenCreateEditComponent]
    });
    fixture = TestBed.createComponent(ExamenCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
