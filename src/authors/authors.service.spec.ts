import { AuthorsService } from './authors.service';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model, AnyKeys, AnyObject, HydratedDocument } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateAuthorDto } from './dto/update-author.dto';

const mockAuthor = (name = 'Author 1', age = 41): Author => ({
  name,
  age,
});

const mockAuthorDocument = (
  id?: string,
  mock?: Partial<Author>,
): Partial<AuthorDocument> => ({
  _id: id || '6249b5161fcde00ca89fe1cd',
  name: mock?.name || 'Author 1',
  age: mock?.age || 41,
});

const mockAuthorDocumentArray = [
  mockAuthorDocument(),
  mockAuthorDocument('6249b5161fcde00ca89fe1ce', { name: 'Author 2', age: 40 }),
  mockAuthorDocument('6249b5161fcde00ca89fe1cf', { name: 'Author 3', age: 39 }),
];

describe('AuthorsService', () => {
  let service: AuthorsService;
  let model: Model<AuthorDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    model = module.get<Model<AuthorDocument>>(getModelToken(Author.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new author', async () => {
    type CreateOp<T> = (
      doc: AnyKeys<T> | AnyObject,
    ) => Promise<HydratedDocument<T>>;
    const id = '6249b5161fcde00ca89fe1cd';
    const author = mockAuthor();
    const authorDocument = mockAuthorDocument(id, author);
    const createSpy = jest.spyOn(
      model,
      'create',
    ) as unknown as jest.MockedFunction<CreateOp<AuthorDocument>>;
    createSpy.mockResolvedValueOnce(authorDocument as any);
    const authorCreated = await service.create(author);
    expect(authorCreated).toEqual(authorDocument);
  });

  it('shoud return one author by id', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    jest.spyOn(model, 'findById').mockResolvedValueOnce(authorDocument);
    const foundAuthor = await service.findOne(id);
    expect(foundAuthor).toEqual(authorDocument);
  });

  it('should return all authors', async () => {
    jest.spyOn(model, 'find').mockResolvedValueOnce(mockAuthorDocumentArray);
    const authorsFound = await service.findAll();
    expect(authorsFound).toEqual(mockAuthorDocumentArray);
  });

  it('shoud update author by id and return updated author', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce({ ...authorDocument, ...updateAuthorDto });
    const updatedAuthor = await service.update(id, updateAuthorDto);
    expect(updatedAuthor).toEqual({ ...authorDocument, ...updateAuthorDto });
  });

  it('shoud delete author by id and return author', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    jest
      .spyOn(model, 'findByIdAndRemove')
      .mockResolvedValueOnce(authorDocument);
    const deletedAuthor = await service.remove(id);
    expect(deletedAuthor).toEqual(authorDocument);
  });
});