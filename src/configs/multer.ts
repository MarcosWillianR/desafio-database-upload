import { diskStorage } from 'multer';
import crypto from 'crypto';
import path, { extname } from 'path';

const fileUploadDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: fileUploadDirectory,

  storage: diskStorage({
    destination: fileUploadDirectory,
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const filename = `${fileHash}${extname(file.originalname)}`;

      return cb(null, filename);
    },
  }),
};
