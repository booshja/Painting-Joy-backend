// const express = require("express");
// const jsonschema = require("jsonschema");
// const { BadRequestError } = require("../expressError");
// const checkJwt = require("../middleware/checkJwt");
// const IGPost = require("../models/igpost");
// const igPostsNewSchema = require("../schemas/igPostsNew.json");

// const router = express.Router({ mergeParams: true });

// router.post("/", checkJwt, async (req, res, next) => {
//     /** POST "/" { igpost } => { igpost }
//      * Creates a new igpost
//      *
//      * igpost should be { ig_id, caption, perm_url, image_url }
//      *
//      * Returns { ig_id, caption, perm_url, image_url }
//      *
//      * Authorization required: admin
//      */
//     try {
//         const validator = jsonschema.validate(req.body, igPostsNewSchema);
//         if (!validator.valid) {
//             const errors = validator.errors.map((e) => e.stack);
//             throw new BadRequestError(errors);
//         }

//         const igPost = await IGPost.add(req.body);
//         return res.status(201).json({ igPost });
//     } catch (err) {
//         next(err);
//     }
// });

// router.get("/", async (req, res, next) => {
//     /** GET "/" => [ igposts ]
//      * Returns a list of igposts
//      *
//      * Returns [ { ig_id, caption, perm_url, image_url },
//      *              { ig_id, caption, perm_url, image_url }, ...]
//      *
//      * Authorization required: none
//      */
//     try {
//         const igPosts = await IGPost.getAll();
//         return res.status(200).json({ igPosts });
//     } catch (err) {
//         next(err);
//     }
// });

// router.get("/post/:id", checkJwt, async (req, res, next) => {
//     /** GET "/post/{id}" => { igpost }
//      * Returns an igpost by id
//      *
//      * Returns { ig_id, caption, perm_url, image_url }
//      *
//      * Authorization required: admin
//      */
//     try {
//         const igPost = await IGPost.get(req.params.id);
//         return res.status(200).json({ igPost });
//     } catch (err) {
//         return next(err);
//     }
// });

// router.delete("/delete/:id", checkJwt, async (req, res, next) => {
//     /** DELETE "/delete/:id" => { msg: "Deleted." }
//      * Deletes an igpost by id
//      *
//      * Returns { msg: "Deleted." }
//      *
//      * Authorization required: admin
//      */
//     try {
//         const message = await IGPost.delete(req.params.id);
//         return res.status(200).json({ message });
//     } catch (err) {
//         return next(err);
//     }
// });

// module.exports = router;
