import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from 'src/app/services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { By } from '@angular/platform-browser';

const listBook: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 20,
    amount: 1,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 8,
    amount: 7,
  },
];

describe('Card component', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>; // Nos permite extraer elementos del componente.
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Puedes llegar a necesitar otro modulo que afecte al componente, ej. Angular Material.
      declarations: [CartComponent],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(BookService);
    spyOn(service, 'getBooksFromCart').and.callFake(() => null);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  // it('Should create', inject( // Solo si piden una modificación específica.
  //   [CartComponent],
  //   (testComponent: CartComponent) => {
  //     expect(testComponent).toBeTruthy();
  //   }
  // ));

  it('Should getTotalPrice returns an amount', () => {
    const totalPrice = component.getTotalPrice(listBook);
    expect(totalPrice).toBeGreaterThan(0);
    expect(totalPrice).not.toBe(0);
  });

  it('Should onInputNumberChange increments correctly', () => {
    const action = 'plus';
    const book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 2,
    };

    const spy = spyOn(service, 'updateAmountBook').and.callFake(() => null); // Crea un espía y además haz una llamada falsa. Siempre se crea antes de llamarlo en el componente.
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);
    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    expect(book.amount === 3).toBeTrue;
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Should onInputNumberChange decrements correctly', () => {
    const action = 'minus';
    const book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 3,
    };

    const spy = spyOn(service, 'updateAmountBook').and.callFake(() => null); // Crea un espía y además haz una llamada falsa. Siempre se crea antes de llamarlo en el componente.
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);
    expect(book.amount).toBe(3);
    component.onInputNumberChange(action, book);
    expect(book.amount).toBe(2);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Should onClearBooks works correctly', () => {
    // Best way to make a test with a private method.
    const spy = spyOn(component as any, '_clearListCartBook').and.callThrough(); // Es permitido, no es lo correcto, pero solo queremos saber que ha sido llamado. El método se va a llamar y lo vamos a espiar.
    const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.listCartBook = listBook;
    component.onClearBooks();
    // expect(component.listCartBook.length).toBe(0);
    expect(component.listCartBook.length === 0).toBeTrue();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  }); // Si desde un método publico no somos capaces de probar un método privado es que hay algo que no está bien pensado.

  it('Should _clearListCartBook works correctly', () => {
    // Is only to test every method, but this one is also called on before test, so it's not necessary to do it again.
    const spy = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.listCartBook = listBook;
    component['_clearListCartBook']();
    expect(component.listCartBook.length === 0).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('The tile "The cart is empty" is not displayed when there is a list', () => {
    component.listCartBook = listBook;
    fixture.detectChanges(); // We cannot just asign values to the component, we have to detect the changes to refresh the view.
    const debugElement: DebugElement = fixture.debugElement.query(
      By.css('#titleCartEmpty')
    );
    expect(debugElement).toBeFalsy();
  });

  it('The title "The cart is empty" is displayed correctly when the list is empty', () => {
    component.listCartBook = [];
    fixture.detectChanges(); // We cannot just asign values to the component, we have to detect the changes to refresh the view.
    const debugElement: DebugElement = fixture.debugElement.query(
      By.css('#titleCartEmpty')
    );
    expect(debugElement).toBeTruthy();
    if (debugElement) {
      const element: HTMLElement = debugElement.nativeElement;
      expect(element.innerHTML).toContain('The cart is empty');
    }
  });
});
