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
            const tokenURI = await uploadAsset(files.file, fields.name);
            //const response = await mint('singlemint', '0x7003797C57EB365910877a945862978E700F4aA6', tokenURI);

            res.status(200).json({ tokenURI });
        }
    });
  }