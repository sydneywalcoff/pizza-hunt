const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// adds comment to specific pizza
router.route('/:pizzaId').post(addComment);

// route to PUT(add reply) or DELETE a comment
router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment);

// route to delete a reply
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;