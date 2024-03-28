import { Request } from 'express';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

type ExtendedRequest = Request & {
  files?: { [fieldname: string]: MulterFile[] } | MulterFile[] | undefined;
};

export default ExtendedRequest;
