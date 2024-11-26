import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormGenerationComponent } from './dynamic-form-generation.component';

describe('DynamicFormGenerationComponent', () => {
  let component: DynamicFormGenerationComponent;
  let fixture: ComponentFixture<DynamicFormGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
