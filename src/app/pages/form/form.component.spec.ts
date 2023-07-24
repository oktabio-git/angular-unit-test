import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

fdescribe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should name field is required', () => {
    const nameField = component.form.get('name');
    nameField.setValue('');
    expect(nameField.valid).toBeFalse();
  });

  it('Should name field has an error with more than 5 characters', () => {
    const nameField = component.form.get('name');
    nameField.setValue('test name');
    expect(nameField.valid).toBeFalse();
  });

  it('Should name field is correct with less than 5 characters', () => {
    const nameField = component.form.get('name');
    nameField.setValue('test');
    expect(nameField.valid).toBeTrue();
  });
});
