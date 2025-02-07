$(document).ready(function () {
    let audioContext, analyser, microphone, dataArray, isBlown = false;

    async function startAudioDetection() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphone = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Defines resolution
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            microphone.connect(analyser);
            detectSound();
        } catch (err) {
            console.error("Microphone access denied:", err);
        }
    }

    function detectSound() {
        requestAnimationFrame(detectSound);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        let average = sum / dataArray.length;

        console.log("Sound Level:", average); // Debugging: Open Console (F12)

        // Adjust threshold based on testing (higher = louder required)
        if (average > 30 && !isBlown) {  // Lower threshold = more sensitive
            extinguishCandle();
            isBlown = true; // Prevent multiple triggers
        }
    }

    function extinguishCandle() {
        $("#flame").removeClass("burn").addClass("puff");
        $(".smoke").each(function () {
            $(this).addClass("puff-bubble");
        });
        $("#glow").hide();
        $("h1").hide().html("Happy 12th Birthday, Madeline!").delay(750).fadeIn(300);
        $("#candle").animate({ opacity: "0.5" }, 100);
    }

    // Ensure mic access starts only after user clicks or presses a key
    $(document).on("click keydown", function () {
        if (!audioContext) {
            startAudioDetection();
        }
    });

    // Debugging: Log if mic access fails
    navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        console.error("Microphone access blocked:", err);
    });
});
