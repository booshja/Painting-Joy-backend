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
npm install
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
| `SECRET_KEY`         | Secret key                                                 |
| `NODE_ENV`           | Whether the app is in production, developement, or testing |
| `BCRYPT_WORK_FACTOR` | # of rounds of encryption for Bcrypt to use                |
| `KEY`                | Encryption/Decryption password for Postgres                |
| `ALGORITHM`          | Encryption algorithm to use for Postgres encryption        |
| `SENDGRID_API_KEY`   | API key from SendGrid for sending emails                   |
| `EMAIL_TO`           | Email to send when new message is sent through site        |
| `EMAIL_FROM`         | Email to send from when new message is sent through site   |
| `RECAPTCHA_SECRET`   | Server secret for recaptcha v2                             |
| `AUTH0_AUDENCE`      | Audience variable for Auth0                                |
| `AUTH0_DOMAIN`       | Domain variable for Auth0                                  |
| `AUTH0_TEST_TOKEN`   | Auth0 Authorization Token for Testing                      |

<hr>
<br>

## **Testing**:

This app uses Jest and Supertest for testing. Tests can be run using:

```
npm install
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

**_E-Commerce_**: Uses the Stripe API to generate a payment token for payment processing.

**_Custom CMS / Admin Dashboard_**: Custom CMS Routes for the artist to manage their posts, homepage, as well as their store.

<hr>
<br>

## **API Routes**:

A list of routes and usage can be found [HERE](https://github.com/booshja/Painting-Joy-backend/blob/main/API.md).

<hr>
<br>

## **External APIs**:

1. [Stripe API](https://api.setlist.fm/docs/1.0/index.html)
    - Payment Intent Token generation
    - Chosen because they're one of the best in the industry with payment processing, including fantastic SDK's, documentation, and tutorials.
2. [SendGrid](https://sendgrid.com/)
    - Email client
    - Chosen for quick and easy email generation.
3. [Google reCAPTCHA](https://developers.google.com/recaptcha/)
    - Human verification for Contact Form
    - Chosen to filter bots from Contact Form submission.
4. [Auth0](https://a0.to/)
    - Authentication and Authorization service
    - Chosen because of the ease of use of their SDK and API, as well as the additional features of Google, Facebook, and other login options.

<hr>
<br>

## **Project Proposal**:

Step 1 - [General Project Ideas](https://github.com/booshja/Painting-Joy-School-Docs/blob/main/Proposals/step1-ideas.md)
Step 2 - [PaintingJoy.art Propsal](https://github.com/booshja/Painting-Joy-School-Docs/blob/main/Proposals/step2-proposal.md)

<hr>
<br>

## **User Flows**

See the repo directory [HERE.](https://github.com/booshja/Painting-Joy-School-Docs/tree/main/User-Flows)

_Note:_ These user flows were from the original proposal, and contain flows for Authentication/Admin that may not be present in the final project due to the addition of auth0.

<hr>
<br>

## **Database Schema**

-   [Original Proposal File](https://github.com/booshja/Painting-Joy-School-Docs/blob/main/Database-Schema/DB_Schema.png)
-   [Current Updated Database Schema](https://github.com/booshja/Painting-Joy-School-Docs/blob/main/Database-Schema/final_db_schema.png)

<hr>
<br>

## **Tech Stack**:

-   [JavaScript](https://developer.mozilla.org/en-US/docs/javascript)
    -   [ESLint](https://eslint.org/)
        -   Linting
    -   [Prettier](https://prettier.io/)
        -   Formatting
-   [Node.js](https://nodejs.org/) - Back End Code
    -   [Generate Changelog](https://github.com/lob/generate-changelog)
        -   Changelog Generation
    -   [SendGrid](https://sendgrid.com/)
        -   API for sending Emails
    -   [reCAPTCHA](https://developers.google.com/recaptcha/docs/v3)
        -   Human/Bot Detection
-   [Express](https://expressjs.com/) - Server Framework
    -   [Auth0](https://a0.to/)
        -   Authentication and Authorization Service
    -   [express-jwt](https://github.com/auth0/express-jwt)
        -   JWT Package for Express
    -   [Helmet](https://helmetjs.github.io/)
        -   Security enhancements through headers
    -   [Jest](https://jestjs.io/)
        -   Testing Framework
    -   [JSON-Schema](https://json-schema.org/)
        -   Input JSON verification
    -   [jwks-rsa](https://github.com/auth0/node-jwks-rsa)
        -   auth0 dependency
    -   [Morgan](https://expressjs.com/en/resources/middleware/morgan.html)
        -   Logging
    -   [Multer](https://expressjs.com/en/resources/middleware/multer.html)
        -   Image parsing through use of buffer
    -   [node-pg](https://node-postgres.com/)
        -   Node package for interacting with PostgreSQL Database
    -   [pg-format](https://github.com/datalanche/node-pg-format)
        -   Node package for prevention of SQL-Injection with PostgreSQL Database
    -   [Stripe](https://github.com/stripe/stripe-node)
        -   Payment processing API
    -   [SuperTest](https://github.com/visionmedia/supertest#readme)
        -   Integration Testing
-   [PostgreSQL](https://www.postgresql.org/)
    -   SQL Relational Database
-   [Heroku](https://heroku.com/)
    -   Node app hosting built on top of AWS
-   [VSCode](https://code.visualstudio.com/)
    -   My code editor of choice

<hr>
<br>

## **Changelog**

View Changelog [HERE.](https://github.com/booshja/Painting-Joy-backend/blob/main/CHANGELOG.md)

<hr>
<br>

## **Support**

Reach out to me at the following places:

-   Website: [jacobandes.dev](jacobandes.dev)
-   Twitter: [@booshja](https://twitter.com/booshja)
-   Email: [jacob.andes@gmail.com](mailto:jacob.andes@gmail.com)
-   Email: [admin@jacobandes.dev](mailto:admin@jacobandes.dev)

<hr>
<br>
<br>

Copyright &#169; [Jacob Andes](jacobandes.dev), 2021
