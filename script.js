const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const recordedVideo = document.getElementById('recordedVideo');
let mediaRecorder;
let recordedChunks = [];
let stream;

recordedVideo.style.display = 'none';

startBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        mediaRecorder = new MediaRecorder(stream);


        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedChunks = [];
            recordedVideo.style.display = 'block';
        };

        mediaRecorder.start();
        recordedVideo.style.display = 'none';
    } catch (err) {
        console.error("Error: " + err);
    }
});

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop()); 
    }
});