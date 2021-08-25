const uploadFile = require("../middleware/upload");
const readline = require('readline');
const fs = require('fs');
addrs = require("email-addresses");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const filename = __basedir + "/uploads/" + req.file.originalname;
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filename),
      output: null,
      console: false
    });
    readInterface.on('line', function(line) {
      const email = addrs.parseOneAddress(line);
      console.log("Name: ", email.name, "Address: ", email.address, "Local: ", email.local);
    });


    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

module.exports = {
  upload
};