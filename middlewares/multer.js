import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, "images");
  },
  filename: (req, file, done) => {
    done(null, "hello.jpeg");
  },
});
const upload = multer({ storage: storage });
export default upload;
