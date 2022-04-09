import { Book } from './../../src/books/schemas/book.schema';
import { authorsDocuments } from './authors.data';

export const books: Book[] = [
  {
    title: 'Book 1',
    description: 'Book 1 description',
    author: authorsDocuments[0]._id,
  },
  {
    title: 'Book 2',
    description: 'Book 2 description',
    author: authorsDocuments[0]._id,
  },
  {
    title: 'Book 3',
    description: 'Book 3 description',
    author: authorsDocuments[0]._id,
  },
];

export const booksDocuments: (Book & { _id: string })[] = [
  {
    _id: '6249b5161fcde00ca89f1a11',
    ...books[0],
  },
  {
    _id: '6249b5161fcde00ca89f1a12',
    ...books[1],
  },
  {
    _id: '6249b5161fcde00ca89f1a13',
    ...books[2],
  },
];
