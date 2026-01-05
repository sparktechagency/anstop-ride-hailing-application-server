import { Router } from 'express';
import { MessageController } from './message.controller';
import { MESSAGE_UPLOADS_FOLDER } from './message.constant';
import { upload } from '../../utils/UploadAssets';
import auth from '../../middleware/auth';

const router = Router();



// send message
router
  .route('/')
  .post(auth('Rider'), upload.array('files', 10), MessageController.sendMessage);



// get single message
router
  .route('/:messageId')
  .put(auth('Rider'), MessageController.updateMessage)
  .patch(auth('Rider'), MessageController.markMessageSeen)
  .delete(auth('Rider'), MessageController.deleteMessage);


// Additional routes for new features
router.patch(
  '/view-all-messages/:chatId',
  auth('Rider'),
  MessageController.viewAllMessages
);

export const MessageRoutes = router;
