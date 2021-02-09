/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const initialState = anecdotesAtStart.map(asObject);

// Updated for 6.3
// Updated for 6.4
const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'VOTE_ANECDOTE':
    const { id } = action.data;
    const anecdoteToVote = state.find((anecdote) => anecdote.id === id);
    const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 };
    return state.map((anecdote) => (anecdote.id !== id ? anecdote : updatedAnecdote));
  case 'CREATE_ANECDOTE':
    return [...state, action.data];
  default:
    return state;
  }
};

// action creator for 6.3
// needed for 6.6. already done
export const voteAnecdote = (id) => ({
  type: 'VOTE_ANECDOTE',
  data: { id },
});

// action creator for 6.4
// needed for 6.6. already done
export const createAnecdote = (content) => ({
  type: 'CREATE_ANECDOTE',
  data: {
    content,
    id: getId(),
    votes: 0,
  },
});
export default reducer;