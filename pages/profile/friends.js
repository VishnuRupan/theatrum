import { getSession, useSession } from "next-auth/client";
import { useState, useEffect, useRef } from "react";
import { connectToDatabase } from "../../util/db";
import styled from "styled-components";
import {
  formBox,
  marginContainer,
  primeButton,
} from "../../styles/uiComponents";
import IntroText from "../../components/IntroText";
import PosterCards from "../../components/PosterCards";
import CopyClipboard from "../../components/CopyClipboard";

const Friends = (props) => {
  const [friendRequests, setFriendRequests] = useState(props.requests);
  const [acceptedFriends, setAcceptedFriends] = useState(props.accepted || []);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [simlarMoviesPerson, setSimilarMoviesPerson] = useState(null);
  const [session, loading] = useSession();
  const friendEmail = useRef();

  let stringMovieList =
    session === null || session === undefined
      ? " "
      : `${session.user.name}'s Movie List: `;

  if (similarMovies != null && similarMovies.length > 0) {
    similarMovies.forEach((movie, idx) => {
      if (similarMovies.length - 1 === idx) {
        stringMovieList =
          `${stringMovieList}` + `${movie.Title} (${movie.Year})`;
      } else {
        stringMovieList =
          `${stringMovieList}` + `${movie.Title} (${movie.Year}), `;
      }
    });
  }

  //const accept friend request
  const acceptFriendRequestHandler = async (event) => {
    const friendToBeAccepted = event.target.value;

    if (session) {
      const response = await fetch("/api/friend-request", {
        method: "PATCH",
        body: JSON.stringify({
          friendToBeAccepted: friendToBeAccepted,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // let temp = friendRequests.filter((el) => el.email !== friendToBeAccepted);
    // setFriendRequests(temp);
    // temp = null;
    // temp = friendRequests.find((f) => f.email === friendToBeAccepted);

    global.location.reload();
  };

  // send a friend request
  const friendRequestHandler = async (event) => {
    if (session) {
      const response = await fetch("/api/friend-request", {
        method: "POST",
        body: JSON.stringify({
          friendEmail: friendEmail.current.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  //
  const checkFriendMovies = async (e, name) => {
    if (session) {
      const response = await fetch("/api/check-movies", {
        method: "PATCH",
        body: JSON.stringify({
          friendEmail: e.target.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data != null && data != undefined) {
        setSimilarMoviesPerson([e.target.value, name]);
        setSimilarMovies(data);
      }
    }
  };

  useEffect(() => {}, [friendRequests, acceptedFriends]);

  return (
    <FriendsPage>
      <MainSection>
        {session && (
          <IntroText
            span={`${session.user.name}'s `}
            last="Friend List"
          ></IntroText>
        )}

        <FriendForm className="center-flex">
          <h3 className="add-a-friend">Add a Friend</h3>

          <div className="form-group center-flex">
            <input
              type="text"
              id="request-friend"
              placeholder="email address"
              ref={friendEmail}
            />

            <Btn onClick={friendRequestHandler}>Request</Btn>
          </div>
        </FriendForm>

        <div className="friend-group">
          <div className="friend-request-div">
            <h3>Friend Requests</h3>

            <div className="scrollable-div">
              {friendRequests &&
                friendRequests.map((request) => (
                  <div key={request.email} className="center-flex request-ctn">
                    <h4 className="friend-request-name">{request.name}</h4>
                    <Btn
                      primary
                      value={request.email}
                      onClick={acceptFriendRequestHandler}
                    >
                      Add
                    </Btn>
                  </div>
                ))}
            </div>
          </div>

          <div className="accepted-friends-ctn">
            <div className="friend-request-div">
              <h3>Your Friends</h3>

              <div className="scrollable-div">
                {acceptedFriends &&
                  acceptedFriends.map((accepted) => (
                    <div
                      key={accepted.email}
                      className="center-flex request-ctn"
                    >
                      <h4 className="friend-request-name">{accepted.name}</h4>
                      <Btn
                        primary
                        value={accepted.email}
                        onClick={(e) => {
                          checkFriendMovies(e, accepted.name);
                        }}
                      >
                        Compare
                      </Btn>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <SimilarMovieCtn>
          <h3>Similar movies</h3>

          {similarMovies != null &&
            simlarMoviesPerson != null &&
            similarMovies.length != 0 && (
              <div key={setSimilarMoviesPerson[0]} className="movie-match-desc">
                <p>
                  🤘 YAY! You and <span>{simlarMoviesPerson[1]}</span> liked
                  these movies
                </p>

                {similarMovies != null && (
                  <CopyClipboard copyText={stringMovieList} />
                )}
              </div>
            )}

          {similarMovies != null &&
            similarMovies.length === 0 &&
            simlarMoviesPerson.length != 0 && (
              <div key={setSimilarMoviesPerson[0]}>
                <p>
                  😥 AW! You and <span>{simlarMoviesPerson[1]}</span> didn't
                  like the same movies movies
                </p>
              </div>
            )}

          <ul className="movie-results">
            {similarMovies &&
              similarMovies.map((movie, i) => (
                <li key={movie.imdbID}>
                  <PosterCards movie={movie} i={i} profile={true} />
                </li>
              ))}
          </ul>
        </SimilarMovieCtn>
      </MainSection>
    </FriendsPage>
  );
};

const FriendsPage = styled.div`
  height: 100%;
  overflow-x: hidden;
`;

const MainSection = styled(marginContainer)`
  padding-top: 5rem;
  min-height: 100vh;

  .add-a-friend {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    padding-top: 1rem;
    padding-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .friend-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .scrollable-div {
    height: 8rem;
    width: 25rem;
    overflow-y: scroll;

    @media (max-width: 380px) {
      width: 18rem;
    }
  }

  .friend-request-div {
    margin-right: 1rem;
    margin-top: 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: bold;
      padding: 1rem 0rem;
    }

    div {
      flex-direction: row;
      justify-content: flex-start;
      padding: 0.5rem 0rem;
    }

    button {
      padding: 0.2rem 1rem;
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }
  }

  .scrollable-div {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  .scrollable-div::-webkit-scrollbar {
    width: 12px;
  }

  .scrollable-div::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollable-div::-webkit-scrollbar-thumb {
    background-color: rgba(118, 118, 118, 0.5);
    border-radius: 1px;
    border: transparent;
  }

  .friend-request-name {
    font-size: 1rem;
    font-weight: 500;
    color: white;
    margin-right: 1rem;
  }

  .similar-movie-ctn {
  }
`;

const SimilarMovieCtn = styled.div`
  padding-bottom: 3rem;
  padding-top: 1rem;

  p {
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.5rem 0rem;
    text-shadow: 2px 2px 0px rgba(255, 205, 205, 0.5);
    color: white;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }

    span {
      color: var(--light-pink);
    }
  }

  h3 {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    padding: 1rem 0rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  li {
    margin: 1.5rem 0rem;
    margin-right: 1.5rem;
  }

  .movie-match-desc {
    display: flex;
  }
`;

const FriendForm = styled(formBox)`
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: none;
  box-shadow: none;

  input,
  button {
    margin: 0rem;
  }

  .form-group {
    flex-direction: row;
  }

  input {
    margin-right: 0.5rem;
  }
`;

const Btn = styled(primeButton)``;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db().collection("users");

  const userProfile = await db.findOne({ email: session.user.email });
  const friendList = userProfile.friendsList;

  const friendRequests = [];
  const acceptedFriends = [];

  // split accepted and request

  if (friendList != null || friendList != undefined) {
    friendList.forEach((friend) => {
      if (friend.status === null) {
        friendRequests.push(friend);
      } else {
        acceptedFriends.push(friend);
      }
    });
  }

  const userProfileLikedMovies = userProfile.likedMovies;

  return {
    props: {
      accepted: acceptedFriends,
      requests: friendRequests,
    },
  };
}

export default Friends;
