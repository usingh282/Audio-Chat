const users = ["Alice", "Bob", "Charlie", "David"];
let currentUserIndex = 0;
let isMuted = true;
let audioChunks = [];
let mediaRecorder;

// Check for browser support
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support audio recording.");
}

document.getElementById('login-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        updateUser();
    }
});

document.getElementById('next-user').addEventListener('click', function() {
    currentUserIndex = (currentUserIndex + 1) % users.length;
    updateUser();
});

document.getElementById('prev-user').addEventListener('click', function() {
    currentUserIndex = (currentUserIndex - 1 + users.length) % users.length;
    updateUser();
});

document.getElementById('mic-status').addEventListener('click', function() {
    isMuted = !isMuted;
    updateMic();

    if (!isMuted) {
        startRecording();
    } else {
        stopRecording();
    }
});

document.getElementById('edit-profile').addEventListener('click', function() {
    document.getElementById('profile-modal').style.display = 'block';
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('profile-modal').style.display = 'none';
});

document.getElementById('save-profile').addEventListener('click', function() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const age = document.getElementById('profile-age').value;
    const location = document.getElementById('profile-location').value;

    // Here you can save the profile data
    console.log({ name, email, age, location });

    // Close the modal
    document.getElementById('profile-modal').style.display = 'none';
});

function updateUser() {
    const currentUserDiv = document.getElementById('current-user');
    currentUserDiv.textContent = users[currentUserIndex];
}

function updateMic() {
    const micStatusDiv = document.getElementById('mic-status');
    if (isMuted) {
        micStatusDiv.textContent = "Mic: OFF";
        micStatusDiv.className = 'mic-status muted';
    } else {
        micStatusDiv.textContent = "Mic: ON";
        micStatusDiv.className = 'mic-status active';
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                const audioURL = URL.createObjectURL(audioBlob);
                const audioElement = new Audio(audioURL);
                audioElement.play(); // Play the recorded audio
            };
            mediaRecorder.start();
        })
        .catch(error => {
            console.error("Error accessing microphone: ", error);
            alert("Could not access the microphone. Please check your permissions.");
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('profile-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
