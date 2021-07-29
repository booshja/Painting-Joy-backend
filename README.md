# **README - PaintingJoy**

## **About**

### _[PaintingJoy.art](https://paintingjoy.art/)_

The back end of a web app that is part Art Portfolio, part E-commerce, part custom CMS. Built for a local artist's mural painting business.

<br>
<br>

# **Local Usage**

## **Summary**:

Set Up:

```
git clone git@github.com:booshja/Painting-Joy-backend.git
cd Painting-Joy-backend
npm i
createdb {database name here}
createdb {test database name here}
```

-   _Don't forget to create your .env file and create your ENV's (below)_

Run Tests:

```
npm test
```

Run Development server:

```
npm run dev
```

<hr>
<br>

## **Environmental Variables**:

This app uses the following environmental variables:

| ENV                  | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| `DATABASE_URI`       | Postgres URI                                               |
| `PORT`               | Port the server listens on                                 |
| `ADMIN_KEY`          | Value referencing the current user for session             |
| `SECRET_KEY`         | Secret key                                                 |
| `NODE_ENV`           | Whether the app is in production, developement, or testing |
| `BCRYPT_WORK_FACTOR` | # of rounds of encryption for Bcrypt to use                |
| `KEY`                | Encryption/Decryption password for Postgres                |
| `ALGORITHM`          | Encryption algorithm to use for Postgres encryption        |
| `STRIPE_API_KEY`     | API key from Stripe to use with their API                  |
| `SENDGRID_API_KEY`   | API key from SendGrid for sending emails                   |
| `EMAIL_TO`           | Email to send when new message is sent through site        |
| `EMAIL_FROM`         | Email to send from when new message is sent through site   |
| `RECAPTCHA_SECRET`   | Server secret for recaptcha v3                             |

<hr>
<br>

## **Testing**:

This app uses Jest and Supertest for testing. Tests can be run using:

```
npm i
npm test
```

<hr>
<br>

## **Formatting/Linting/Pre-Commit Hooks**:

This project uses pre-commit hooks with ESLint and Prettier.

<hr>
<br>
<br>
<br>

# **General Information**

## **Features**:

**_Browse Murals/General Art_**: Returns data for general site browsing.

**_E-Commerce_**: Uses the Stripe API to process payments for an online art store.

**_Custom CMS / Admin Dashboard_**: Custom CMS Routes for the artist to manage their posts, homepage, an Instagram feed, as well as the store.

<hr>
<br>

## **API Routes**:

A list of routes and usage can be found [HERE](https://github.com/booshja/Painting-Joy-backend/blob/main/API.md).

<hr>
<br>

## **External APIs**:

1. [Stripe API](https://api.setlist.fm/docs/1.0/index.html)
    - Payment Intent Token generation
2. [SendGrid](https://sendgrid.com/)
    - Email client

<hr>
<br>

## **Tech Stack**:

-   [JavaScript](https://developer.mozilla.org/en-US/docs/javascript)
    -   [ESLint](https://eslint.org/)
    -   [Prettier](https://prettier.io/)
-   [Node.js](https://nodejs.org/)
    -   [Generate Changelog](https://github.com/lob/generate-changelog)
    -   [Bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
    -   [SendGrid](https://sendgrid.com/)
    -   [reCAPTCHA](https://developers.google.com/recaptcha/docs/v3)
-   [Express](https://expressjs.com/)
    -   [Helmet](https://helmetjs.github.io/)
    -   [Jest](https://jestjs.io/)
    -   [JSON-Schema](https://json-schema.org/)
    -   [JSON Web Token](https://github.com/auth0/node-jsonwebtoken#readme)
    -   [Morgan](https://expressjs.com/en/resources/middleware/morgan.html)
    -   [Multer](https://expressjs.com/en/resources/middleware/multer.html)
    -   [node-pg](https://node-postgres.com/)
    -   [pg-format](https://github.com/datalanche/node-pg-format)
    -   [Stripe](https://github.com/stripe/stripe-node)
    -   [SuperTest](https://github.com/visionmedia/supertest#readme)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Heroku](https://heroku.com/)
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
