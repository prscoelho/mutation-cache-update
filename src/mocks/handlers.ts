import { graphql } from "msw";

const user = {
  __typename: "User",
  posts: [
    {
      id: 0,
      text: "Initial",
      __typename: "Post",
    },
  ],
  edits: 0,
};

let hello = 0;

export const handlers = [
  graphql.query("GetUser", (_, res, ctx) => {
    return res(ctx.delay(2000), ctx.data({ user }));
  }),
  graphql.query("Hello", (_, res, ctx) => {
    hello += 1;
    return res(
      ctx.delay(2000),
      ctx.data({ hello: { value: `Hello ${hello}` } })
    );
  }),

  graphql.mutation("EditPost", (req, res, ctx) => {
    const { id, text } = req.variables;

    const post = user.posts[id];

    if (!post) {
      return res(
        ctx.errors([
          {
            message: "Post not found",
          },
        ])
      );
    }

    post.text = text;
    user.edits += 1;

    return res(ctx.delay(500), ctx.data({ editPost: post }));
  }),
];
