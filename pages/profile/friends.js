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
import InvalidInput from "../../components/modal/InvalidInput";

const Friends = (props) => {
  const [friendRequests, setFriendRequests] = useState(props.requests);
  const [acceptedFriends, setAcceptedFriends] = useState(props.accepted || []);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [simlarMoviesPerson, setSimilarMoviesPerson] = useState(null);
  const [session, loading] = useSession();
  const [requestSent, setRequestSend] = useState("");
  const friendEmail = useRef();
  const [friendToBeRejected, setFriendToBeRejected] = useState("");
  const [isOpen, setIsOpen] = useState(null);
  const [confirm, setConfirm] = useState(false);

  //
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

      if (response.ok) {
        setRequestSend(
          `Your request has been sent to ${friendEmail.current.value}`
        );
        friendEmail.current.value = "";
      } else {
        setRequestSend(
          `Your request failed to send to ${friendEmail.current.value}`
        );
      }
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

  const rejectRequestHandler = async (e) => {
    setFriendToBeRejected(e.target.value);

    if (!confirm) {
      setIsOpen(true);
      return;
    } else {
      setIsOpen(false);
    }
  };

  useEffect(async () => {
    // fire when confirming to reject or remove friend/request
    if (confirm) {
      if (session) {
        const response = await fetch("/api/friend-request", {
          method: "DELETE",
          body: JSON.stringify({
            friendToBeRejected: friendToBeRejected,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      global.location.reload();
    }
  }, [friendRequests, acceptedFriends, confirm]);

  return (
    <FriendsPage>
      {isOpen && (
        <InvalidInput
          warning="Confirm"
          error="Are you sure?"
          setIsOpen={setIsOpen}
          setError={setConfirm}
        />
      )}
      <MainSection>
        {session && (
          <IntroText
            span={`${session.user.name}'s `}
            last="Friends List"
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
          <p
            onClick={() => {
              setRequestSend("");
            }}
          >
            {requestSent}{" "}
            {requestSent != "" && <span style={{ cursor: "pointer" }}>✕</span>}
          </p>
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
                      value={request.email}
                      onClick={acceptFriendRequestHandler}
                    >
                      Add
                    </Btn>

                    <Btn
                      primary
                      value={request.email}
                      onClick={rejectRequestHandler}
                    >
                      Reject
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
                        value={accepted.email}
                        onClick={(e) => {
                          checkFriendMovies(e, accepted.name);
                        }}
                      >
                        Compare
                      </Btn>

                      <Btn
                        primary
                        value={accepted.email}
                        onClick={rejectRequestHandler}
                      >
                        Remove
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

          {simlarMoviesPerson === null && <p>Compare a movie with a friend!</p>}

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
      padding-bottom: 1.5rem;
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
  text-align: center;

  .movie-match-desc {
    width: 100%;
    display: flex;
    justify-content: center;
  }

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

  .movie-results {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    li {
      margin: 1.5rem 0rem;
      margin-right: 1.5rem;

      width: 20rem;

      img {
        height: 400px;
      }

      @media (max-width: 400px) {
        width: 15rem;
      }
    }
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

const Btn = styled(primeButton)`
  margin-right: 1rem;
`;

/// next.js
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

  return {
    props: {
      accepted: acceptedFriends,
      requests: friendRequests,
    },
  };
}

export default Friends;
