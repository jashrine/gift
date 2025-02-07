$(document).ready(function () {
  let audioContext, analyser, microphone, dataArray;

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
          detectBlow();
      } catch (err) {
          console.error("Microphone access denied:", err);
      }
  }

  function detectBlow() {
      requestAnimationFrame(detectBlow);
      analyser.getByteFrequencyData(dataArray);

      let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // Adjust threshold based on testing
      if (average > 50) {
          extinguishCandle();
      }
  }

  function extinguishCandle() {
      $("#flame").removeClass("burn").addClass("puff");
      $(".smoke").each(function () {
          $(this).addClass("puff-bubble");
      });
      $("#glow").remove();
      $("h1").hide().html("Happy 12th Birthday, Madeline!").delay(750).fadeIn(300);
      $("#candle").animate({ opacity: "0.5" }, 100);
  }

  // Start listening when the page loads
  startAudioDetection();
});
