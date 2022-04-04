import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorDocument = Author & Document;

@Schema()
export class Author {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
