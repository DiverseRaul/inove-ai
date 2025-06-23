<template>
  <div class="home-page-dark">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-main-title">
          <span class="hero-title-segment">Welcome</span>
          <span class="hero-title-segment">to</span>
          <span class="hero-title-segment hero-title-brand">
            inove<span class="hero-title-ai">.ai</span>
          </span>
        </h1>
        <p class="tagline hero-tagline">Dream. Plan. Create.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.home-page-dark {
  background-color: #020207; /* Very dark navy, almost black */
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative; /* For pseudo-elements */
}

.hero-section {
  text-align: center;
  position: relative;
  padding: 2rem;
  z-index: 2;
}

/* The futuristic side glow */
.home-page-dark::before {
  content: '';
  position: absolute;
  top: -25%;
  right: -35%;
  width: 80%;
  height: 150%;
  background: radial-gradient(
    circle at center,
    rgba(120, 81, 169, 0.35) 10%,
    rgba(120, 81, 169, 0.2) 55%,
    rgba(120, 81, 169, 0) 60%
  );
  transform: translateZ(0);
  animation: futuristicGlow 15s infinite alternate ease-in-out;
  z-index: 1;
}

/* Grainy/noise overlay */
.home-page-dark::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
    background-repeat: repeat;
    opacity: 0.025;
    pointer-events: none;
    z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-main-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 800;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-shadow: 0 0 30px rgba(0,0,0,0.3);
}

.tagline {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 300;
  color: #b3b3cc;
  margin-top: 1rem;
}

/* Text reveal animation */
@keyframes revealText {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-main-title .hero-title-segment,
.hero-tagline {
  display: inline-block;
  opacity: 0;
  animation: revealText 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-main-title .hero-title-segment:nth-child(1) { animation-delay: 0.2s; }
.hero-main-title .hero-title-segment:nth-child(2) { animation-delay: 0.4s; margin-left: 0.25em; }
.hero-main-title .hero-title-segment:nth-child(3) { animation-delay: 0.6s; margin-left: 0.25em; }
.hero-tagline { animation-delay: 1s; }

.hero-title-ai {
  font-weight: 300;
  color: #ffffff;
}

/* Glow animation */
@keyframes futuristicGlow {
  0% {
    transform: rotate(-10deg) scale(1) translateX(-10%);
    opacity: 0.8;
  }
  100% {
    transform: rotate(5deg) scale(1.1) translateX(5%);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-main-title {
    font-size: clamp(2.2rem, 10vw, 4rem); /* Adjust clamp for smaller screens */
  }

  .tagline {
    font-size: clamp(0.9rem, 4vw, 1.2rem); /* Adjust clamp for smaller screens */
  }

  .home-page-dark::before {
    width: 130%; /* Make glow wider to cover more of the smaller screen */
    height: 130%;
    top: -20%; /* Adjust vertical position */
    right: -50%; /* Pull more to the right to ensure it's a side glow */
    animation: futuristicGlow 12s infinite alternate ease-in-out; /* Slightly faster animation */
  }
}

@media (max-width: 480px) {
  .hero-main-title {
    font-size: clamp(1.8rem, 12vw, 3rem);
    letter-spacing: -0.01em;
  }

  .tagline {
    font-size: clamp(0.8rem, 5vw, 1rem);
  }
  
  .hero-section {
    padding: 1rem; /* Reduce padding on very small screens */
  }

  .home-page-dark::before {
    width: 200%; /* Even wider for very small screens */
    height: 200%;
    top: -125%;
    right: -65%;
    background: radial-gradient(
      circle at center,
      rgba(120, 81, 169, 0.4) 15%,
      rgba(120, 81, 169, 0.25) 30%,
      rgba(120, 81, 169, 0) 85%
    ); /* Adjust gradient for smaller, potentially more intense glow */
  }
}
</style>
