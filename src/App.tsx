import { gql, useMutation, useQuery } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    user {
      posts {
        id
        text
      }
      edits
    }
  }
`;

const EDIT_POST = gql`
  mutation EditPost($id: Int!, $text: String!) {
    editPost(id: $id, text: $text) {
      id
      text
    }
  }
`;

const HELLO = gql`
  query Hello {
    hello {
      value
    }
  }
`;

const Hello = () => {
  const { loading, data } = useQuery<{ hello: { value: string } }>(HELLO);

  if (loading || !data) {
    return <div>Loading..</div>;
  }

  return <div>{data.hello.value}</div>;
};

const Post = ({ id, text }: { id: number; text: string }) => {
  const [mutate, { loading }] = useMutation(EDIT_POST, {
    variables: {
      id,
      text: text.toUpperCase(),
    },
    refetchQueries: [GET_USER],
    // refetchQueries: [HELLO],
  });
  return (
    <div>
      {id} - {text}
      <button onClick={() => mutate()}>
        {!loading ? "Convert" : "Loading..."}
      </button>
    </div>
  );
};

function App() {
  const { loading, data } = useQuery<{
    user: { posts: { id: number; text: string }[]; edits: number };
  }>(GET_USER);

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {data.user.posts.map((post) => (
          <Post id={post.id} text={post.text} key={post.id} />
        ))}
      </div>
      <br />

      <div>Edited {data.user.edits} times.</div>
      <br />

      <Hello />
    </div>
  );
}

export default App;
