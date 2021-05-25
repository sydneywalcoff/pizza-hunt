const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// adds comment to specific pizza
router.route('/:pizzaId').post(addComment);

// deletes comment from pizza using id
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;