to change!

# Project include external library

### What is this about?

- for desktop (not responsive), build a simple website with HTML, CSS, JavaScript, that [includes an animation of an external library](https://popmotion.io/#quick-start-animation-animate-spring-options)
- why JavaScript based animation? Quote: "the popmotion animations go beyond the capabilities of CSS (?), so use JavaScript"
- animation comes in via script tag `<script src=“https://unpkg.com/popmotion@8.1.24/dist/popmotion.global.min.js”></script>` (via CDN) - this is on purpose for rapid experimentation

### This Repo is based on:

- tutorial within [Frontendmasters' Beginners Path](https://frontendmasters.com/learn/beginner/)
- tutorial video [Integrating with other people's libraries](https://frontendmasters.com/courses/web-development-v2/integrating-with-other-people-s-libraries/)
- tutorial course notes [Integrating with other people's libraries](https://btholt.github.io/intro-to-web-dev-v2/libraries)

### Heads-up

- I quickly coded the desired spring animation along during the course, please see, why I mention this here below the code

```
const { styler, spring, listen, pointer, value } = window.popmotion;

const ball = document.querySelector('.anim-box');
const divStyler = styler(ball);
const ballXY = value({ x: 0, y: 0 }, divStyler.set);

listen(ball, 'mousedown touchstart')
    .start((e) => {
        e.preventDefault();
        pointer(ballXY.get()).start(ballXY);
    });

listen(document, 'mouseup touchend')
    .start(() => {
        spring({
            from: ballXY.get(),
            velocity: ballXY.getVelocity(),
            to: { x: 0, y: 0 },
            stiffness: 200,
            // mass: 1,
            // damping: 10
        }).start(ballXY);
    });
```

- apparently the popmotion website has been changed since the recording of the tutorial, so there are no codepens linked in it any longer, it’s also not THAT intuitive how to quickly (like, within 2 minutes) grab JavaScript animation code off of this website
- a quick search resulted in [popmotion on codepen](https://codepen.io/popmotion) but I did not take the time to search if the (up to date) spring animation is in there

### How to run this?

- clone this repo
- `cd` into project
- open `index.html` in your browser of choice (in my case, built in/for Chrome)
