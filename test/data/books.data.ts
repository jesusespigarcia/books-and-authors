import { authorsDocuments } from './authors.data';

export const books = {
  book1: {
    title: 'Book 1',
    description: 'Book 1 description',
    author: authorsDocuments.author1Document._id,
  },
  book2: {
    title: 'Book 2',
    description: 'Book 2 description',
    author: authorsDocuments.author2Document._id,
  },
  book3: {
    title: 'Book 3',
    description: 'Book 3 description',
    author: authorsDocuments.author3Document._id,
  },
};

export const booksDocuments = {
  book1Document: {
    _id: '6249b5161fcde00ca89f1a11',
    ...books.book1,
  },
  book2Document: {
    _id: '6249b5161fcde00ca89f1a12',
    ...books.book2,
  },
  book3Document: {
    _id: '6249b5161fcde00ca89f1a13',
    ...books.book3,
  },
};

export const booksDocumentsArray = [
  booksDocuments.book1Document,
  booksDocuments.book2Document,
  booksDocuments.book3Document,
];
