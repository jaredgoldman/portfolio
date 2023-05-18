let containerOffset = 0;
let isUpdating = false;
let observer; // Declare the IntersectionObserver as a global variable
let cards

const handleWheelEvent = (event) => {
    event.preventDefault();

    // Calculate the scroll direction
    const scrollDirection = Math.sign(event.deltaY);

    // Define the distance to move the elements
    const moveDistance = 120;

    // Update the container's horizontal offset
    containerOffset += moveDistance * scrollDirection;

    container.style.setProperty('--container-offset', `${containerOffset}px`);

    observe()
};

const observe = () => {
    cards.forEach((element) => {
        observer.observe(element);
    });
}

const instantiateObserver = () => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const element = entry.target;
            const isVisible = entry.isIntersecting;
            const isFocused = element.classList.contains('focused');
            const isUnfocused = element.classList.contains('unfocused');

            if (isVisible && isUnfocused) {
                // console.log('visible', element.innerText);
                element.classList.remove('unfocused');
                element.classList.add('focused');
            } else if (!isVisible && isFocused) {
                // console.log('invisible', element.innerText);
                element.classList.remove('focused');
                element.classList.add('unfocused');
            }
        });
    }, {
        root: null,
        threshold: 0.9,
    });

};

document.addEventListener('DOMContentLoaded', () => {
    cards = document.querySelectorAll('.card');
    cards.forEach((element) => {
        element.classList.add('unfocused');
    });
    instantiateObserver(); // Instantiate the IntersectionObserver
    container.addEventListener('wheel', handleWheelEvent);
    observe()
});

