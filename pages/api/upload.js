import formidable from 'formidable';
import { uploadAsset } from '../../server/pinata';

 export const config = {
    api: {
        bodyParser: false
    }
  };

export default async function handler(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (!err) {
            const response = await uploadAsset(fields.url || (files && files.file), fields.name);

            res.status(200).json(response);
        }
    });
  }