export const authors = {
  author1: {
    name: 'Author 1',
    age: 41,
  },
  author2: {
    name: 'Author 2',
    age: 31,
  },
  author3: {
    name: 'Author 3',
    age: 35,
  },
};

export const authorsDocuments = {
  author1Document: {
    _id: '6249b5161fcde00ca89fe1cd',
    ...authors.author1,
  },
  author2Document: {
    _id: '6249b5161fcde00ca89fe1ce',
    ...authors.author2,
  },
  author3Document: {
    _id: '6249b5161fcde00ca89fe1cf',
    ...authors.author3,
  },
};

export const authorsDocumentsArray = [
  authorsDocuments.author1Document,
  authorsDocuments.author2Document,
  authorsDocuments.author3Document,
];
