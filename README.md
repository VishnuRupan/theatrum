<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://theatrum.vercel.app/">
    <img src="/public/images/logo.jpg" alt="Logo" width="200">
  </a>

  <h3 align="center">Theatrum</h3>

  <p align="center">
    The app that lets you pick the perfect movie for that speical occasion.
    <br />
    <a href="https://theatrum.vercel.app/"><strong>Check it out »</strong></a>
    <br />
    <a href="https://theatrum.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/VishnuRupan/theatrum/issues">Report Bug</a>
    ·
    <a href="https://github.com/VishnuRupan/theatrum/issues">Request Feature</a>
  </p>
</p>

<!-- rest api created with next.js api routes-->
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2>Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#frontend">Frontend</a>
        <ul>
          <li> <a href="#design">Design</a></li>
          <li> <a href="#homepage">Homepage</a></li>
          <li> <a href="#search-page">Search Page</a></li>
           <li> <a href="#movie-details">Movie Details</a></li>
           <li> <a href="#profile-page">Profile Page</a></li>
           <li> <a href="#friends-list">Friends List</a></li>
      </ul>
    </li>
    <li>
      <a href="#backend">Backend</a>
      <ul>
        <li> <a href="#mongodb">MongoDB</a></li>
        <li> <a href="#nextauth">NextAuth</a></li>
        <li> <a href="#api-routes">API Routes</a></li>
        <li> <a href="#server-side-rendering">Server-Side Rendering</a></li>
      </ul>
    </li>
    <li><a href="#tests">Tests</a></li>
    <li><a href="#issues">Issues</a></li>
    <li><a href="#lessons">Lessons</a></li>
     <li><a href="#future Updates">Future Updates</a></li>
  
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

  <a href="https://theatrum.vercel.app/movie/tt4154796/avengers:-endgame">
    <img src="/public/images/movie-info.jpg" alt="theatrum screenshot" width="500" >
  </a>

Theatrum is a website that allows users to search and favourite movies they like to their profile. Users can add friends and compare if anyone in their friends list favourited the same movies.

Initially, the apps only purpose was to favourite movies they searched and notify users after reaching a certain limit of favourited movies, however, this was useless if you couldn't do anything with it. Thus, I added a clipboard feature to share movie titles and favourite lists, and the ability to compare favourited movies among friends. The current limit for favouriting movies is 5, but will change with future updates.

The goal was to provide a simple and smooth user experience.

### Built With

This project was built with Next.js to get familiar creating REST APIs with Next.js API routes. Most pages using [Server-Side Rendering(SSR)](https://nextjs.org/docs/basic-features/pages#server-side-rendering) use `getServerSideProps()`.

List of technologies and node modules used to build the app:

- [Next.js](https://nextjs.org)
- [MongoDB](https://www.mongodb.com/)
  - Primary database
- [NextAuth](https://next-auth.js.org/)
  - Used for authentication in Next.js
- [Axios](https://github.com/axios/axios)
  - Handling requests
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
  - Password-hashing
- [Chakra UI](https://chakra-ui.com/)
  - UI components for alerts
- [styled-components](https://styled-components.com/)
  - CSS & conditional styling
- [Swiper](https://swiperjs.com/)
  - Carousel library
- [Font Awesome](https://fontawesome.com/)
  - Icons
- [hamburger-react](https://www.npmjs.com/package/hamburger-react)
- [react copy-to-clipboard](https://www.npmjs.com/package/react-copy-to-clipboard)

## Frontend

Next.js has a file-system based router. Thus, each page contains specific JSX/JS code and CSS styles that makes it unique. In addition, because Next.js is a React Framework, reusable and customizable components were used. Many components and pages use state. Because the size of this project was small, it was not necessary to use state management libraries. Pages share state with child components so that changes in the state is reflected on the parent page. The goal was to keep it simple and modern both in design and code. 

### Design

Text styles were based on retro movie 3D title texts, thus I created a text-shadow effect behind all heading tags. Text colors were either white or #ffcdcd (light pink) to allow for variation while maintaining high contrast with a dark background. The light pink text is used throughout this website for emphasis on certain words.

There are 2 different pairs of button color schemes. The first pair is an alternation between white/black used for the search, login, and logout buttons. The second pair is red/green/white used for liking or removing liked movies. Red indicates that a movie has already been favourited which is a color scheme common among most apps that use a heart icon.

### Homepage

  <a href="https://theatrum.vercel.app/">
    <img src="/public/images/home-page.jpg" alt="theatrum homepage" width="500" >
  </a>

To keep it simple, I included the search form, a react component, in the homepage and on the search page. I decided having a field for title and year(optional) was enough to search for a movie.

The background was created in Figma so that the top portion of the movie collage image would blend in with the navigation bar color.

### Search Page

  <a href="https://theatrum.vercel.app/">
    <img src="/public/images/search-movies.jpg" alt="search movies page" width="500" >
  </a>

Initially the movie posters were done using the CSS grid layout, but was later changed to flex-box due to mobile responsive issues. On the top right corner is a heart icon that is used to either favourite or removed a favourited movie.

Movie poster cards are created using a single react component which is used in a `map()` array method to generate a new movie poster for movies in a list.

The heart icon color is changed on the front-end upon a click action and is temporary. However, a request is sent to update the database and the correct color styles will be pre-rendered when the page is reloaded.

### Movie Details

 <a href="https://theatrum.vercel.app/movie/tt4154796/avengers:-endgame">
    <img src="/public/images/movie-info.jpg" alt="movie details page" width="500" >
  </a>

This page was designed as an after thought, which required using a TMDB API in addition to OMDB API. This issue is discussed further in the <a href="#lessons">lessons section</a>.

Under the movie poster is a text button to add and remove movies that follows the green/red color scheme, which was designed using conditional rendering with `useState()`.

This page was created using Next.js dynamic routes, making each url unique. Movie urls are in the form of `/movie/[imdbID]/[movie name]`. Any url would be caught after `/movie/` and would return a _no movies found_ error if the search page redirected to an imdb ID that doesn't exist.

Below the poster and movie details in a carousel for similar movies created using the Swiper.js library for react. The carousel was a mobile friendly alternative for displaying similar movies.

### Profile Page

 <a href="https://theatrum.vercel.app/">
    <img src="/public/images/profile-page.jpg" alt="movie details page" width="500" >
  </a>

This page features the same flex layout in the search page combined with the text remove button from the movie details page. A Chakra UI alert component/modal appears when the user reaches the limit of 5 favourited movies. When no movies have been favourited, the search form component is conditionally rendered using standard react. Users are also given the option to copy the list of movies they favourited using the copy-to-clipboard icon.

### Friends List

 <a href="https://theatrum.vercel.app/">
    <img src="/public/images/friends-page.jpg" alt="movie details page" width="500" >
  </a>

The design of this page was centered around a responsive experience for mobile users. The 3 main sections that a user needs is the ability to add a friend, accept or decline friend requests, compare movies with friends, and display similar movies.

Adding a friend will only work if that user exists in the database. A status message will be conditionally rendered under the search form on each request.

After each request is successfully sent to accept/remove a friend, the page will reload to pre-render the updated results from the database. Due to the size of the application, and the frequency people will be adding friends, it was not necessary to include WebSocket technology that would eliminate the use of refreshing the page to update the friends list. An alternative to reloading the page would be to create an illusion by conditionally removing any names after a successful request.

The list of similar movies among your friends is conditionally rendered based on the list received from a `PATCH` request to `/api/check-movies` .

## Backend

### MongoDB

This is the structure of documents in the MongoDB database:

```JS
{
  _id: {},
  name: String,
  email: String,
  password: String,
  likedMovies: [ { imdbID: String, Title: String, Year: String, Poster: String, selected: boolean }],
  friendsList: [ { status: boolean, email: String, email: String }]
}
```

Each user has a likedMovies array that holds information about different movies they liked. The movie object is the same data you get with you send a `GET` request for a movie to OMDB's API.

For this project, I did not create a schema, unlike other web applications I've built. A user is created upon registration and missing fields are either added or updated if they exist. To ensure no duplicate users are created, there are conditional checks in place before creating new users. An error message will appear in the registration form otherwise.

Having a users favourited movies as a field to their account allows me to easily compare similar movies with friends by querying for their likedMovies array. Thus, pre-rendering the user profile using `getServerSideProps()` would only require me to pass the likedMovies array to the props return value.

The MongoDB Field Update Operators used in the backend were: set, push, pull.

### NextAuth

NextAuth is an easy to use authentication system for Next.js apps. The most useful features of NextAuth is its ability to call the `useSession()` or `getSession()` to determine whether there is still and active session. The `sessions` object returns details about the user, including their email. You can retrieve the session object on the client and server side, making it easier to verify users who are authorized to access protected resources.

A simple example of redirecting users using NextAuth in `getServerSideProps()`

```JS
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
```

Log in using NextAuth

```
  const result = await signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
  });
```

### API Routes

- GET
  - requests to both the OMDB API and TMDB API
- POST
  - `api/auth/signup`(user sign-up)
  - `/api/friend-request`(request to add friend)
- PATCH
  - `/api/friend-request`(accept friend)
  - `/api/check-movies`(return array of matching movies between a friend)
  - `/api/modify-list`(add new movie object to likedMovies array)
- DELETE
  - `/api/friend-request`(delete and remove a friend)
  - `/api/modify-list`(remove a movie from favourites list)

Deleting a movie from `likedMovies` array:

```JS
    if (req.method === "DELETE") {
      if (!(await isMovieAlreadyInList(userProfile, imdb))) {
        res
          .status(422)
          .json({ message: `This movie has not been favourited.` });
        //client.close();
        return;
      }

      const removedLikedList = userProfile.likedMovies.filter(
        (movie) => movie.imdbID != imdb
      );

      const updatedUserProfileDelete = await db.updateOne(
        {
          _id: userProfile._id,
        },
        { $set: { likedMovies: removedLikedList } }
      );

      //client.close();
      res.status(201).json(removedLikedList);
      return;
    }

```

### Server-Side Rendering

Most pages on this app use ```getServerSideProps()``` to fetch data from either the MongoDB database or the OMDB/TMDB API and pass it to the props return value. The data in props is then used to render components on the client side, or used in functions for click events. The benefit is clients don't see server-side code running on the client side, and the data is already pre-fetched for faster rendering of UI components. When a page is reloaded or navigated back to, ```getServerSideProps()``` fires off again to fetch the current data. When a user searches and favourites a movie and return back to the profile page, they will see that their favourites list has been updated. The same concept applies in the friends page for adding and removing a friend. 


Fetching users profile data prior to rendering the page:
```JS
export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db().collection("users");

  const userProfile = await db.findOne({ email: session.user.email });

  const nominationLimit = userProfile.likedMovies.length === 5 ? true : false;
  //client.close();

  //user profile
  return {
    props: {
      likedMovies: userProfile.likedMovies,
      limit: nominationLimit,
    },
  };
}
```

## Tests
```
.
├── cypress
    ├── integration
      ├── login_logout.spec.js
      ├── register-users.spec.js
      ├── search_movie.spec.js
      └── select_movies.spec.js
```

For this project I created end to end automated test scripts using cypress to simulate a user experience. Using the cypress snapshot functionality, I was able to determine where in time an error or bug occurred.


## Issues
1. The back button does not always redirect the user to the last page they visited, and usually end up on the 2nd last page. 
2. Users may return to homepage after logging out instead of the login page. However, the logout handler has code the redirects users to the login page. 

## Lessons
One of the biggest challenges I faced was working with 2 different movie database APIs. Initially this project only needed a database with basic movie details, but later expanded to wanting to have plot summary, ratings, similar movies, and etc. This is when I had the brilliant(terrible) idea to use TMDBs API to fetch movies using the ```imdbID``` of each movie. This was the only unique identifier both databases shared. I did not realize how inefficient and difficult it would be to use 2 APIs instead of switching everything over to TMDB, since it had more details on each movie. 

When a user clicks a movie poster, ```getServerSideProps()``` uses the ```imdbID``` from OMDB to GET that movie's detail on TMDB. This is extremely inefficient and causes issues when the ```imdbID``` can't be found on TMDB. The reasons I stuck to this model was ultimately so I didn't have to change all the code I've written so far, but will make the change in future updates. 




## Run Locally

1. Get a free API Key at 
   1. [https://www.omdbapi.com/](https://www.omdbapi.com/)
   2. [https://developers.themoviedb.org](https://developers.themoviedb.org/3)
2. Clone the repo
   ```sh
   git clone https://github.com/VishnuRupan/theatrum.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your environment variables
   ```
   USER_NAME, PASSWORD, CLUSTER, DATABASE, TMDB_ID, OMDB_ID, NEXTAUTH_URL
   ```

