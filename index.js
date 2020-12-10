// const styler = window.popmotion.styler;
// const spring = window.popmotion.spring;
// const listen = window.popmotion.listen;
// const pointer = window.popmotion.pointer;
// const value = window.popmotion.value;
// destructure this to:
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