import {
  MulterModuleAsyncOptions,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const storageConfig: MulterModuleAsyncOptions = {
  useFactory: async (): Promise<MulterModuleOptions> => ({
    storage: drivers.local,
  }),
};

const drivers = {
  local: diskStorage({
    destination: './uploads',
    filename(req, file, cb) {
      const [, extension] = file.originalname.split('.');
      const newFileName = `${file.fieldname}-${Date.now()}.${extension}`;
      cb(null, newFileName);
    },
  }),
  s3: null,
};
