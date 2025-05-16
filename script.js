// Initialize Locomotive Scroll with enhanced smoothness
const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    multiplier: 1.2, // Increased for more dramatic effect
    lerp: 0.05, // Smaller value for smoother transitions
    smartphone: {
        smooth: true,
        lerp: 0.05
    },
    tablet: {
        smooth: true,
        lerp: 0.05
    }
});

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on locomotive scroll update
scroll.on('scroll', ScrollTrigger.update);

// Set up ScrollTrigger proxy for locomotive scroll
ScrollTrigger.scrollerProxy('#main', {
    scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    pinType: document.querySelector('#main').style.transform ? "transform" : "fixed"
});

// Force a small delay before initial scroll update to prevent flickering
setTimeout(() => {
    scroll.update();
    ScrollTrigger.refresh(true);
}, 200);

// Handle our animations
document.addEventListener('DOMContentLoaded', () => {
    // Initial reveal animation for hero split images - with enhanced randomness
    gsap.to(".anim-swipe", {
        yPercent: 300,
        delay: 0.2,
        duration: 3,
        stagger: {
            from: "random",
            each: 0.25 // More pronounced staggering
        },
        ease: "power2.out"
    });
    
    // Create different effects for each image container
    document.querySelectorAll('.hero__image-cont').forEach((container, index) => {
        const img = container.querySelector('img');
        const swipe = container.querySelector('.anim-swipe');
        
        // Different animation for each column - Y-AXIS ONLY
        const yMove = -20 - (index * 5); // Makes each strip move at different speeds
        // Removed xMove variable completely
        const scaleAmount = 1 + ((index % 3) * 0.05); // Reduced scale variation
        
        // Create parallax effect for images - Y-AXIS ONLY
        gsap.to(img, {
            yPercent: yMove,
            // Removed xPercent property
            scale: scaleAmount,
            scrollTrigger: {
                trigger: "#page",
                scroller: '#main',
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
            }
        });
        
        // Reset the swipe position for scroll effect
        gsap.set(swipe, {
            yPercent: 100, // Start below
            opacity: 1
        });
        
        // Dynamic reveal on scroll
        ScrollTrigger.create({
            trigger: "#page",
            scroller: '#main',
            start: "top top",
            end: "+=100%",
            onUpdate: (self) => {
                // Create random movement based on scroll position - Y-AXIS ONLY
                const progress = self.progress;
                const randomOffset = index * 50;
                const yPos = 100 - (progress * 300) + randomOffset;
                gsap.to(swipe, {
                    yPercent: yPos,
                    duration: 0.8,
                    ease: "power1.out"
                });
            }
        });
    });

    // Create a split effect animation
    const splitColumns = document.querySelectorAll('.hero__image-cont');
    
    // Randomize column positions on scroll - Y-AXIS ONLY
    ScrollTrigger.create({
        trigger: '#page',
        scroller: '#main',
        start: 'top top',
        end: '+=100%',
        onUpdate: (self) => {
            const scrollProgress = self.progress;
            
            // Apply different transforms to each column based on scroll - Y-AXIS ONLY
            splitColumns.forEach((column, i) => {
                // Random values based on column index for variation
                const randomFactor = (i % 3) * 0.4;
                const randomYOffset = ((i + 1) * 5) - 15; // Different for each column
                
                // Calculate y-movement based on scroll progress
                const yMovement = scrollProgress * randomYOffset;
                
                // Apply transform with Y-AXIS movement only
                gsap.to(column, {
                    y: -yMovement * 20, // Move columns up at different rates
                    duration: 0.5,
                    ease: "power1.out"
                });
            });
        }
    });
    
    // Pin the page1 section until all animations complete
    ScrollTrigger.create({
        trigger: '#page1',
        scroller: '#main',
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true
    });
    
    // Animation for the aboutus title - with delay to start after reaching the section
    gsap.fromTo('#aboutus h1', 
        { opacity: 0, y: 100 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1.5,
            scrollTrigger: {
                trigger: '#page1',
                scroller: '#main',
                start: 'top center',
                end: '+=30%',
                scrub: 1
            }
        }
    );

    // Stagger the paragraph animations to happen sequentially
    const aboutTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#page1',
            scroller: '#main',
            start: 'top top',
            end: '+=120%',
            scrub: 1
        }
    });
    
    // First reveal the left paragraph
    aboutTimeline.fromTo('.about-left', 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1.2 },
        0.5 // Delay start
    );
    
    // Then reveal the right paragraph
    aboutTimeline.fromTo('.about-right', 
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1.2 },
        1.5 // Delay start after left paragraph
    );

    // PAGE 2 - IMAGE TRANSITIONS
    // ============================
    
    // Get all the transition images
    const transitionImages = document.querySelectorAll('.transitionImage');
    const imageSwipes = document.querySelectorAll('.image-swipe');
    
    // Set initial states for all swipe elements
    gsap.set(imageSwipes, {
        scaleY: 1,
        transformOrigin: "top center"
    });
    
    // Initialize the first image - make sure it's visible and swipe is hidden
    gsap.set(imageSwipes[0], {
        scaleY: 0 // Hide the swipe overlay for the first image
    });
    
    // Make sure first image is at left: 0%
    gsap.set(transitionImages[0], {
        left: "0%"
    });
    
    // Create a main timeline for the Page 2 transitions
    const imageTransitionTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#page2",
            scroller: "#main",
            start: "top top",
            end: "+=400%", // Longer scroll duration to accommodate all transitions
            pin: true,
            pinSpacing: true,
            scrub: 1, // Smooth scrubbing effect
            anticipatePin: 1 // Helps with smoother pin triggering
        }
    });
    
    // Calculate how much of the timeline each transition should take
    const segmentDuration = 1 / (transitionImages.length);
    
    // For each image (except the first one which is already visible)
    for (let i = 1; i < transitionImages.length; i++) {
        const position = (i * segmentDuration) - (segmentDuration * 0.2); // Offset to create overlap
        
        // First animate the swipe effect
        imageTransitionTimeline.to(imageSwipes[i], {
            scaleY: 0,
            duration: segmentDuration * 0.3,
            ease: "power1.inOut"
        }, position);
        
        // Move the previous image out
        imageTransitionTimeline.to(transitionImages[i-1], {
            left: "-100%",
            duration: segmentDuration * 0.5,
            ease: "power2.inOut"
        }, position + (segmentDuration * 0.1));
        
        // Bring the current image in
        imageTransitionTimeline.to(transitionImages[i], {
            left: "0%",
            duration: segmentDuration * 0.5,
            ease: "power2.inOut"
        }, position + (segmentDuration * 0.1));
    }
    
    // Add a pause at the end to let the user view the final image before unpinning
    imageTransitionTimeline.to({}, { duration: segmentDuration * 0.5 }, (transitionImages.length - 1) * segmentDuration);
});



// Pixelated Image Reveal Effect for Team Members
document.addEventListener('DOMContentLoaded', function() {
  // Configuration options
  const animationStepDuration = 0.3; // Controls the overall animation timing
  const gridSize = 7; // Number of pixels per row and column
  const pixelSize = 100 / gridSize; // Calculate pixel size as percentage
  
  // Select all team member cards
  const teamCards = document.querySelectorAll('[data-pixelated-image-reveal]');
  
  // Detect if device is a touch device for different interaction methods
  const isTouchDevice = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        window.matchMedia("(pointer: coarse)").matches;
  
  // Initialize each card with pixelated effect
  teamCards.forEach((card) => {
    const pixelGrid = card.querySelector('[data-pixelated-image-reveal-grid]');
    const activeCard = card.querySelector('[data-pixelated-image-reveal-active]');
    
    // Remove any existing pixels to avoid duplication
    const existingPixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
    existingPixels.forEach(pixel => pixel.remove());
    
    // Create a grid of pixels dynamically based on the gridSize
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        
        // Set pixel dimensions and position
        pixel.style.width = `${pixelSize}%`;
        pixel.style.height = `${pixelSize}%`;
        pixel.style.left = `${col * pixelSize}%`;
        pixel.style.top = `${row * pixelSize}%`;
        
        pixelGrid.appendChild(pixel);
      }
    }
    
    // Get all pixels for animation
    const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;
    
    // State tracking variables
    let isActive = false;
    let delayedCall;
    
    // Animation function to show/hide pixels
    const animatePixels = (activate) => {
      isActive = activate;
      
      // Kill any ongoing animations
      gsap.killTweensOf(pixels);
      if (delayedCall) {
        delayedCall.kill();
      }
      
      // Reset pixels to hidden state
      gsap.set(pixels, { display: 'none' });
      
      // Show pixels in random order
      gsap.to(pixels, {
        display: 'block',
        duration: 0,
        stagger: {
          each: staggerDuration,
          from: 'random'
        }
      });
      
      // After animation, show or hide the active card
      delayedCall = gsap.delayedCall(animationStepDuration, () => {
        if (activate) {
          activeCard.style.display = 'block';
          activeCard.style.pointerEvents = 'none'; // Allow clicks to pass through
        } else {
          activeCard.style.display = 'none';
        }
      });
      
      // Hide pixels in random order after showing the active card
      gsap.to(pixels, {
        display: 'none',
        duration: 0,
        delay: animationStepDuration,
        stagger: {
          each: staggerDuration,
          from: 'random'
        }
      });
    };
    
    // Set up interaction events based on device type
    if (isTouchDevice) {
      // For touch devices, use click event to toggle
      card.addEventListener('click', () => {
        animatePixels(!isActive);
      });
    } else {
      // For mouse devices, use hover events
      card.addEventListener('mouseenter', () => {
        if (!isActive) {
          animatePixels(true);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (isActive) {
          animatePixels(false);
        }
      });
    }
  });
  
  // Add ScrollTrigger animation for team section
  ScrollTrigger.create({
    trigger: "#page3",
    scroller: "#main",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => {
      // Animate team-title and subtitle with fade up effect
      gsap.fromTo(".team-title", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      
      gsap.fromTo(".team-subtitle", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
      
      gsap.fromTo(".divider", 
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, delay: 0.5, ease: "power2.inOut" }
      );
      
      // Stagger animation for team cards
      gsap.fromTo(".pixelated-image-card", 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1,
          delay: 0.8,
          ease: "power2.out"
        }
      );
    },
    once: true
  });
});



// Refresh ScrollTrigger when locomotive scroll updates
scroll.on('scroll', () => {
    ScrollTrigger.update();
});

// Refresh ScrollTrigger when the window resizes
window.addEventListener('resize', () => {
    setTimeout(() => {
        ScrollTrigger.refresh();
        scroll.update();
    }, 500);
});



// Update Locomotive Scroll and ScrollTrigger after all animations
ScrollTrigger.addEventListener('refresh', () => scroll.update());
ScrollTrigger.refresh();