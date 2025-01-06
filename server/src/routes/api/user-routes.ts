import express from 'express';
const userRoutes = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticateToken } from '../../services/auth.js';

// put authMiddleware anywhere we need to send a token for verification of user
userRoutes.route('/').post(createUser).put(authenticateToken, saveBook);

userRoutes.route('/login').post(login);

userRoutes.route('/me').get(authenticateToken, getSingleUser);

userRoutes.route('/books/:bookId').delete(authenticateToken, deleteBook);

export { userRoutes };
