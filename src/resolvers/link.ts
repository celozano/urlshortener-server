require('dotenv').config();
const ORIGIN = process.env.ORIGIN!;

import { nanoid } from 'nanoid';
import { Arg, Mutation, Query, Resolver, Ctx, Authorized } from 'type-graphql';

import { getPageTitle } from '../utils';
import { getAllLinks, Link, createLink } from '../models/Link';

import { Context as ApolloContext } from 'apollo-server-core';

interface Context extends ApolloContext {
  user: any;
}

@Resolver()
export class LinkResolver {
  @Query(() => String)
  async hello() {
    return 'hello world';
  }

  @Authorized()
  @Query(() => [Link])
  async getLinks(@Ctx() ctx: Context): Promise<Link[]> {
    return await getAllLinks(ctx.user.uid);
  }

  @Authorized()
  @Mutation(() => Link)
  async createLink(
    @Arg('url') url: string,
    @Ctx() ctx: Context
  ): Promise<Link> {
    const hash = nanoid(10);
    const page_title = await getPageTitle(url);
    const link = `${ORIGIN}/${hash}`;

    return await createLink({
      url,
      hash,
      page_title,
      link,
      created_by: ctx.user.uid,
      created_at: new Date(),
    });
  }
}
