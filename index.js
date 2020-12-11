// https://codepen.io/popmotion/pen/vZwNap
import popmotion from 'popmotion';
// const popmotion = require("popmotion");
// import './useless';

const { pointer, trackOffset, physics, transform, value, css } = popmotion;
const { clamp, pipe, interpolate, nonlinearSpring, percent, conditional } = transform;
const SPRING_STRENGTH = 1;

const hue = value(0).setProps({ transform: Math.round });
const saturation = value(100).setProps({ transform: percent });
const lightness = value(50).setProps({ transform: percent });

class Slider {
  constructor({ dom, val, getColor, getGradient, initialValue, range }) {
    this.width = dom.offsetWidth;

    const bar = dom.querySelector('.bar');
    const barHitBox = dom.querySelector('.bar-hit-area');
    const handle = dom.querySelector('.handle');
    const handleHitBox = dom.querySelector('.handle-hit-area');

    const barRenderer = css(bar);
    const handleRenderer = css(handle);
    const handleHitBoxRenderer = css(handleHitBox);

    const mapWidthToVal = interpolate([0, this.width], range);
    this.x = value(0, (v) => {
      val.set(mapWidthToVal(v));
      handleHitBoxRenderer.set('x', v);
      handleRenderer.set('backgroundColor', getColor());
    });

    if (getGradient) {
      hue.addListener(() => {
        barRenderer.set('background', getGradient());
        handleRenderer.set('backgroundColor', getColor());
      });
    }

    if (initialValue) {
      this.x.set(initialValue * this.width);
    }

    handleHitBox.addEventListener('mousedown', this.startTracking);
    handleHitBox.addEventListener('touchstart', this.startTracking, { passive: false });
    barHitBox.addEventListener('click', this.goto);
  }

  startTracking = (e) => {
    const trackPointer = pointer(e).start();
    trackOffset(trackPointer.x, {
      from: this.x.get(),
      transform: pipe(
        conditional(
          (v) => v > this.width,
          nonlinearSpring(SPRING_STRENGTH, this.width)
        ),
        conditional(
          (v) => v < 0,
          nonlinearSpring(SPRING_STRENGTH, 0)
        )
      ),
      onUpdate: this.x
    }).start();

    document.addEventListener('mouseup', this.stopTracking);
    document.addEventListener('touchend', this.stopTracking);
  };

  isOutOfBounds = (x) => (x <= 0 || x >= this.width);

  stopTracking = (e) => {
    // If out of range
    if (this.isOutOfBounds(this.x.get())) {
      this.snapWithinRange();
    // Or within range
    } else {
      this.glide();
    }

    document.removeEventListener('mouseup', this.stopTracking);
    document.removeEventListener('touchend', this.stopTracking);
  };

  snapWithinRange = () => {
    physics({
      from: this.x.get(),
      velocity: this.x.getVelocity(),
      to: clamp(0, this.width)(this.x.get()),
      spring: 800,
      friction: 0.85,
      onUpdate: this.x
    }).start();
  };

  glide = () => {
    physics({
      from: this.x.get(),
      velocity: this.x.getVelocity(),
      friction: 0.5,
      transform: (v) => {
        if (this.isOutOfBounds(v)) this.snapWithinRange();
        return v;
      },
      onUpdate: this.x
    }).start();
  };

  goto = (e) => {
    physics({
      from: this.x.get(),
      to: e.pageX - e.target.getBoundingClientRect().left,
      friction: 0.97,
      onUpdate: this.x,
      spring: 700
    }).start();
  };
}

new Slider({
  dom: document.querySelector('.slider.hue'),
  val: hue,
  getColor: () => `hsl(${hue.get()}, 100%, 50%)`,
  range: [0, 360]
});
new Slider({
  dom: document.querySelector('.slider.saturation'),
  val: saturation,
  initialValue: 1,
  getColor: () => `hsl(${hue.get()}, ${saturation.get()}, 50%)`,
  getGradient: () => `linear-gradient(to right, hsl(${hue.get()}, 0%, 50%), hsl(${hue.get()}, 100%, 50%))`,
  range: [0, 100]
});
new Slider({
  dom: document.querySelector('.slider.lightness'),
  val: lightness,
  initialValue: 0.5,
  getColor: () => `hsl(${hue.get()}, 100%, ${lightness.get()})`,
  getGradient: () => `linear-gradient(to right, hsl(${hue.get()}, 100%, 0%), hsl(${hue.get()}, 100%, 50%), hsl(${hue.get()}, 100%, 100%))`,
  range: [0, 100]
});

const swatchRenderer = css(document.querySelector('.color'));
const updateSwatch = () => swatchRenderer.set('background', `hsl(${hue.get()}, ${saturation.get()}, ${lightness.get()})`);
hue.addListener(updateSwatch);
saturation.addListener(updateSwatch);
lightness.addListener(updateSwatch);
