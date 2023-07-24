import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookService } from './book.service';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Book } from '../models/book.model';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

describe('Book Service', () => {
  let service: BookService;
  let httpMock: HttpTestingController; // Hacer peticiones mock, recuerda test unitarios no hacen peticiones reales.
  let storage = {};

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

  const book: Book = {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }); // No hace falta el compileComponent, porque recuerda, esto es un servicio.
  });

  beforeEach(() => {
    service = TestBed.inject(BookService); // Instanciamos el servicio.
    httpMock = TestBed.inject(HttpTestingController);

    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ? storage[key] : null;
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        return (storage[key] = value);
      }
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should create', () => {
    expect(service).toBeTruthy();
  });

  it('Should getBooks return a list of books and does a get method', () => {
    service.getBooks().subscribe((resp: Book[]) => {
      expect(resp).toEqual(listBook);
    });
    const req = httpMock.expectOne(environment.API_REST_URL + '/book');
    expect(req.request.method).toBe('GET');
    req.flush(listBook); // Simular que esa petición se hizo y que ésta nos devuelva un Observable de listBook.
  });

  it('Should getBooksFromCart return empty array when localStorage is empty', () => {
    const listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
  });

  it('Should addBooksToCart add a book successfully when the list does not exist in the localStorage', () => {
    const toast = {
      fire: () => null,
    } as any; // Ya que solo hacemos uso del fire, por eso lo usamos como any.
    const spy = spyOn(Swal, 'mixin').and.callFake(() => {
      return toast;
    });
    let listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
    service.addBookToCart(book);
    listBook = service.getBooksFromCart();
    // expect(listBook.length).toBe(1);
    service.addBookToCart(book);
    expect(spy).toHaveBeenCalled();
  });

  it('Should removeBooksFromCart removes the list from the localStorage', () => {
    service.addBookToCart(book);
    let listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(1);
    service.removeBooksFromCart();
    listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
  })
});
