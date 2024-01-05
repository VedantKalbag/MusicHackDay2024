// main.js

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const startRecordingButton = document.getElementById('startRecordingButton');
  const stopRecordingButton = document.getElementById('stopRecordingButton');
  const audioPlayer = document.getElementById('audioPlayer');
  let mediaRecorder;
  let chunks = [];
  let recordedBlob;
  let uploadedFile;

  fileInput.addEventListener('change', handleFileUpload);
  uploadButton.addEventListener('click', () => fileInput.click());

  startRecordingButton.addEventListener('click', startRecording);
  stopRecordingButton.addEventListener('click', stopRecording);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      uploadedFile = file;
      playAudioFromFile(file);
      saveUploaded();
    }
  }

  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          recordedBlob = new Blob(chunks, { type: 'audio/wav' });
          chunks = [];
          playAudioFromBlob(recordedBlob);
          saveRecorded();
        };

        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      startRecordingButton.disabled = false;
      stopRecordingButton.disabled = true;
    }
  }

  function saveRecorded() {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'recorded_audio.wav';
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  function saveUploaded() {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = uploadedFile.name;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  function playAudioFromBlob(blob) {
    const audioUrl = URL.createObjectURL(blob);
    audioPlayer.src = audioUrl;
  }

  function playAudioFromFile(file) {
    const reader = new FileReader();

    reader.onload = () => {
      const audioUrl = reader.result;
      audioPlayer.src = audioUrl;
    };

    reader.readAsDataURL(file);
  }
});