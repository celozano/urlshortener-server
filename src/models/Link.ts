import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class Link {
  @prop({ required: true })
  @Field()
  public url: string;

  @prop()
  @Field()
  public link: string;

  @prop()
  @Field()
  public page_title: string;

  @prop()
  @Field()
  public hash: string;

  @prop()
  @Field()
  public created_by: string;

  @prop()
  @Field()
  public created_at: Date;
}

export const LinkModel = getModelForClass(Link);

export const createLink = async (link: Link) => {
  const exists = await LinkModel.findOne({ url: link.url });
  if (exists) {
    throw new Error('Link already exists');
  }

  return LinkModel.create(link);
};

export const getAllLinks = (userId: string) => {
  return LinkModel.find({ created_by: userId }).sort({ created_at: -1 });
};
