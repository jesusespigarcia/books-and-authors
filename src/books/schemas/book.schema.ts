import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Author' })
  author: string;

  @Prop({
    select: false,
  })
  __v?: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
