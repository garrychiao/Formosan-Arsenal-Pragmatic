import firebase from 'firebase'

export default {
  /**
   *  functions here dealing with firebase file uploads,
   *  starts from frontend uploading img inputs and preview,
   *  and on form submits, upload to firebase firestore
   *  input must be a string
   *  @return void
   */
  async uploadImg(targetCollection, targetDoc, fileReference, file) {
    let db = firebase.firestore();
    let storageRef = firebase.storage().ref();

    // Create the file metadata
    let metadata = {
      contentType: file.type
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    let uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          // console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          // console.log('Upload is running');
          break;
        }
      },
      function (error) {
        console.log(error);
      }, async () => {
        try {
          // Upload completed successfully, now we can get the download URL
          let downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          // console.log('File available at', downloadURL)
          let data = {};
          data[fileReference] = downloadURL;
          await db.collection(targetCollection).doc(targetDoc).update(data);
        } catch (error) {
          console.error(error);
        }
      });
  },
};
