import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';

const QUERY_ALL_USERS = gql`
  query getAllUsers {
    users {
      id
      name
      userName
      age
      nationality
      friends {
        id
        name
        age
      }
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query getAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVE_BY_NAME = gql`
  query getMovie($name: String!) {
    movie(name: $name) {
      name
      isInTheaters
      yearOfPublication
    }
  }
`;

const DisplayData = () => {
  const [movieSearched, setMovieSearched] = useState('');
  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVE_BY_NAME);

  if (loading) {
    return <h1>Loading data</h1>;
  }
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
  return (
    <div>
      {data &&
        data.users.map((user) => {
          return (
            <div key={user.id}>
              <h1>Name: {user.name}</h1>
              <h1>Username: {user.userName}</h1>
              <h2>Age: {user.age}</h2>
              <h2>Nationality: {user.nationality}</h2>
            </div>
          );
        })}
      <br></br>
      <hr></hr>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div key={movie.id}>
              <h1>Movie Name: {movie.name}</h1>
              <h2>Publication: {movie.yearOfPublication}</h2>
              <h2>Theater or not: {movie.isInTheaters}</h2>
            </div>
          );
        })}
      <br></br>
      <hr></hr>
      <div>
        <input
          type="text"
          placeholder="Search movie"
          style={{ padding: '12px' }}
          onChange={(e) => {
            setMovieSearched(e.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <h1>Movie name :- {movieSearchedData.movie.name}</h1>
              <h1>
                Movie Published date :-{' '}
                {movieSearchedData.movie.yearOfPublication}
              </h1>
            </div>
          )}
          {movieError && <div>No movie found with that name</div>}
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
