import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model } from 'mongoose';
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

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author.name),
          useValue: Model,
        },
      ],
    }).compile();
    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new author', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const author = mockAuthor();
    const authorDocument = mockAuthorDocument(id, author);
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(authorDocument as any);
    const authorCreated = await controller.create(author);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(author);
    expect(authorCreated).toEqual(authorDocument);
  });

  it('shoud return one author by id', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(authorDocument as any);
    const foundAuthor = await controller.findOne(id);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy.mock.calls[0][0]).toBe(id);
    expect(foundAuthor).toEqual(authorDocument);
  });

  it('should return all authors', async () => {
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValueOnce(mockAuthorDocumentArray as any);
    const authorsFound = await controller.findAll();
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy.mock.calls[0]).toEqual([]);
    expect(authorsFound).toEqual(mockAuthorDocumentArray);
  });

  it('shoud update author by id and return updated author', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    const updateSpy = jest
      .spyOn(service, 'update')
      .mockResolvedValueOnce({ ...authorDocument, ...updateAuthorDto } as any);
    const updatedAuthor = await controller.update(id, updateAuthorDto);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toBe(id);
    expect(updateSpy.mock.calls[0][1]).toEqual(updateAuthorDto);
    expect(updatedAuthor).toEqual({ ...authorDocument, ...updateAuthorDto });
  });

  it('shoud delete author by id and return author', async () => {
    const id = '6249b5161fcde00ca89fe1cd';
    const authorDocument = mockAuthorDocument(id, mockAuthor());
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockResolvedValueOnce(authorDocument as any);
    const deletedAuthor = await controller.remove(id);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe(id);
    expect(deletedAuthor).toEqual(authorDocument);
  });
});
