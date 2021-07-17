# **README - PaintingJoy**

## **About**

### _[PaintingJoy.art](https://paintingjoy.art/)_

The back end of a web app that is part Art Portfolio, part E-commerce, part custom CMS. Built for a local artist's mural painting business.
<br>
<br>
<br>

# **Local Usage**

## **Environmental Variables**:

This app uses the following environmental variables that you will need in order to run the app
| ENV | Value |
| --------------------- | --------------------------------------------------------- |
| `DATABASE_URI` | Postgres URI |
| `PORT` | Port the server listens on |
| `ADMIN_KEY` | Value referencing the current user for session |
| `SECRET_KEY` | Secret key |
| `NODE_ENV` | Whether the app is in production, developement, or testing |
| `BCRYPT_WORK_FACTOR` | # of rounds of encryption for Bcrypt to use |

<hr>
<br>

## **Testing**:

This app uses React Testing Library for Smoke and Snapshot Tests, and Jest for unit testing. Tests can be run using `npm test`

<hr>
<br>

## **Formatting/Linting/Pre-Commit Hooks**:

This project uses pre-commit hooks with ESLint and Prettier.

<br>
<br>
<br>

# **General Information**

## **Features**:

_Browse Murals/General Art_: Returns data for general site browsing.

_E-Commerce_: Uses the Stripe API to process payments for an online art store.

_Custom CMS_: Custom CMS Routes for the artist to manage their posts, homepage, as well as the store through the React front end.

<hr>

## **APIs**:

1. [Stripe API](https://api.setlist.fm/docs/1.0/index.html)
    - Process payments for the web store

<hr>
<br>

## **Tech Stack**:

-   JavaScript
-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
    -   [node-postgres](https://node-postgres.com/)
    -   [Jest](https://jestjs.io/)
    -   [SuperTest](https://github.com/visionmedia/supertest#readme)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Heroku](https://heroku.com/) (Express API Deployment)
-   [VSCode](https://code.visualstudio.com/)

<hr>
<br>

## **Support**

Reach out to me at the following places:

-   Website: [jacobandes.dev](jacobandes.dev)
-   Twitter: [@booshja](https://twitter.com/booshja)
-   Email: [jacob.andes@gmail.com](mailto:jacob.andes@gmail.com)

<hr>
<br>
<br>

Copyright &#169; [Jacob Andes](jacobandes.dev), 2021
