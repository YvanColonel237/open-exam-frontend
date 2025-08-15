import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereCreateEditComponent } from './filiere-create-edit.component';

describe('FiliereCreateEditComponent', () => {
  let component: FiliereCreateEditComponent;
  let fixture: ComponentFixture<FiliereCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiliereCreateEditComponent]
    });
    fixture = TestBed.createComponent(FiliereCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
