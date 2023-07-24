import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';

const emptyList: Book[] = [];
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

const bookServiceMock = {
  getBooks: () => of(listBook),
};

@Pipe({ name: 'reduceText' })
class ReduceTextPipeMock implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return '';
  }
}

describe('Home component', () => {
  let component: HomeComponent;
  let testComp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HomeComponent, ReduceTextPipeMock],
      providers: [{ provide: BookService, useValue: bookServiceMock }, HomeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testComp = TestBed.inject(HomeComponent);
  });

  beforeAll(() => {}); // Solo se llama al principio de todos los tests.

  afterEach(() => {}); // Solo se llama al finalizar cada uno de los tests.

  afterAll(() => {}); // Solo se llama al finalizar todos los tests.

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have a primary button', () => {
    const btnMessage =
      fixture.debugElement.nativeElement.querySelector('#title');
    expect(btnMessage.innerHTML).toBe('Holi');
  });

  xit('Should validate data before init', () => {
    console.log(testComp.listBook);
    expect(testComp.listBook).toBe(emptyList);
  });

  xit('Should have values after init', () => {
    testComp.ngOnInit();
    expect(testComp.listBook).toBe(listBook);
  });

  it('Should getBook get books from the subscription', () => {
    const bookService = fixture.debugElement.injector.get(BookService);
    const spy = spyOn(bookService, 'getBooks').and.returnValue(of(listBook));
    component.getBooks();
    expect(spy).toHaveBeenCalled();
    expect(component.listBook.length === 3).toBeTrue();
  });

  xit('Should wait and test the observable 2.0', fakeAsync(() => {
    let subscribed = false;
    let myObservable$ = of(subscribed).pipe(delay(1000));
    myObservable$.subscribe(() => {
      subscribed = true;
    });
    tick(1000);
    expect(subscribed).toBeTrue();
  }));

  xit('Should test HttpClient.get', () => {
    httpClient.get<Data>('gateway/data').subscribe((data) => {
      expect(data).toEqual({ age: 25, name: 'Jorge' });
    });

    const req = httpTestingController.expectOne('gateway/data');

    console.log(JSON.stringify(req.request), 'Le Request');
    expect(req.request.method).toEqual('GET');

    req.flush({ age: 25, name: 'Jorge' });

    console.log(JSON.stringify(req.request), 'Le Request');
    httpTestingController.verify();
  });
});
