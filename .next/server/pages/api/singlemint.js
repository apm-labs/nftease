"use strict";
(() => {
var exports = {};
exports.id = 880;
exports.ids = [880];
exports.modules = {

/***/ 765:
/***/ ((module) => {

module.exports = require("@pinata/sdk");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 913:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "config": () => (/* binding */ config),
  "default": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: external "formidable"
const external_formidable_namespaceObject = require("formidable");
var external_formidable_default = /*#__PURE__*/__webpack_require__.n(external_formidable_namespaceObject);
;// CONCATENATED MODULE: ./server/pinata.js
const fs = __webpack_require__(147);
const pinataSDK = __webpack_require__(765);
const pinata = pinataSDK('eed3e62e15fb35cb84c1', '52955b7afe9a69af60211a5d3843e796dde50e0ec5f8365c77f158a2845734d9');
const uploadAsset = async (file, name, description)=>{
    const stream = fs.createReadStream(file.filepath);
    const options = {
        pinataMetadata: {
            name: name
        }
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    const metadata = {
        "title": "NFTease",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": description || ''
            },
            "description": {
                "type": "string",
                "description": name
            },
            "image": {
                "type": "string",
                "description": `ipfs://${response.IpfsHash}`
            }
        }
    };
    const mresponse = await pinata.pinJSONToIPFS(metadata);
    return mresponse.IpfsHash;
};

;// CONCATENATED MODULE: ./pages/api/singlemint.js


const config = {
    api: {
        bodyParser: false
    }
};
async function handler(req, res) {
    const form = new (external_formidable_default()).IncomingForm();
    form.parse(req, async (err, fields, files)=>{
        if (!err) {
            const tokenURI = await uploadAsset(files.file, fields.name);
            //const response = await mint('singlemint', '0x7003797C57EB365910877a945862978E700F4aA6', tokenURI);
            res.status(200).json({
                tokenURI
            });
        }
    });
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(913));
module.exports = __webpack_exports__;

})();