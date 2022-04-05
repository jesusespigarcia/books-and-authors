import { ValidationObjectIdPipe } from './validationObjectIdPipe';

describe('ValidationObjectIdPipe', () => {
  let validationObjectIdPipe: ValidationObjectIdPipe;

  beforeAll(async () => {
    validationObjectIdPipe = new ValidationObjectIdPipe();
  });

  it('should throw when id is invalid', async () => {
    expect(() => validationObjectIdPipe.transform('1')).toThrow('Invalid ID');
  });

  it('should return the id when id is valid', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    expect(validationObjectIdPipe.transform(id)).toBe(id);
  });
});
