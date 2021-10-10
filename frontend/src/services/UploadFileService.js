import http from "../http-common";

class UploadFileService {
<<<<<<< HEAD
  upload(period, file, assignmentId, onUploadProgress) {
=======
  upload(file, assignmentId, classPeriod, onUploadProgress) {
>>>>>>> 9985d86fd971d8aea877b5b3a8a1fa33528469e9
    let formData = new FormData();

    formData.append("file", file);

    return http.post(`/upload/?assignment=${assignmentId}&period=${classPeriod}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFileService();