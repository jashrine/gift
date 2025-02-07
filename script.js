$(document).ready(function () {
    let audioContext, analyser, microphone, dataArray, isBlown = false;

    async function startAudioDetection() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphone = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512; // Higher resolution
            dataArray = new Uint8Array(analyser.fftSize);
            microphone.connect(analyser);
            detectBlow();
        } catch (err) {
            console.error("Microphone access denied:", err);
        }
    }

    function detectBlow() {
        requestAnimationFrame(detectBlow);
        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += Math.abs(dataArray[i] - 128); // Calculate sound wave variation
        }
        let average = sum / dataArray.length;

        // Adjust threshold based on testing
        if (average > 20 && !isBlown) {  // Lowered threshold for better detection
            extinguishCandle();
            isBlown = true; // Prevent multiple detections
        }
    }

    function extinguishCandle() {
        $("#flame").removeClass("burn").addClass("puff");
        $(".smoke").each(function () {
            $(this).addClass("puff-bubble");
        });
        $("#glow").hide(); // Hide instead of remove
        $("h1").hide().html("Happy 12th Birthday, Madeline!").delay(750).fadeIn(300);
        $("#candle").animate({ opacity: "0.5" }, 100);
    }

    // Start listening only when the user interacts (required for some browsers)
    $(document).on("click keydown", function () {
        if (!audioContext) {
            startAudioDetection();
        }
    });
});
