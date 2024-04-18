document.addEventListener('DOMContentLoaded', function () {
    var openCameraButton = document.getElementById('openCameraBtn');
    var dropzoneContainer = document.getElementById('dropzoneContainer');
    var capturedImageContainer = document.getElementById('capturedImageContainer');

    var myDropzone = new Dropzone('#myDropzone', {
        url: '/upload',
        autoProcessQueue: false,
        clickable: false,
        acceptedFiles: 'image/*',
        init: function () {
            this.on('addedfile', function (file) {
                // Display the captured image below Dropzone
                var capturedImage = new Image();
                capturedImage.src = URL.createObjectURL(file);
                capturedImage.style.maxWidth = '100%';
                capturedImageContainer.innerHTML = '';
                capturedImageContainer.appendChild(capturedImage);
            });
        }
    });

    // Function to open the camera
    function openCamera() {
        // Request to capture an image from the webcam
        fetch('/capture', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                // Add the captured image to Dropzone
                var blob = base64toBlob(data.image_data);
                var file = new File([blob], 'captured_image.png', { type: 'image/png' });
                myDropzone.addFile(file);
            })
            .catch(error => console.error('Error capturing image: ', error));
    }

    // Attach click event to the button
    openCameraButton.addEventListener('click', openCamera);

    // Function to convert base64 to Blob
    function base64toBlob(base64) {
        var binary = atob(base64);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/png' });
    }
});
