import { Author } from './../../src/authors/schemas/author.schema';
export const authors: Author[] = [
  {
    name: 'Author 1',
    age: 41,
  },
  {
    name: 'Author 2',
    age: 31,
  },
  {
    name: 'Author 3',
    age: 35,
  },
];

export const authorsDocuments: (Author & { _id: string })[] = [
  {
    _id: '6249b5161fcde00ca89fe1cd',
    ...authors[0],
  },
  {
    _id: '6249b5161fcde00ca89fe1ce',
    ...authors[1],
  },
  {
    _id: '6249b5161fcde00ca89fe1cf',
    ...authors[2],
  },
];
