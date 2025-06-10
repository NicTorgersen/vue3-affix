function getElementAttributes(element) {
    const elementDefaultStyle = element.style;
    const elementBaseWidth = element.offsetWidth;
    const elementBaseHeight = element.offsetHeight;
    const {
        top: elementRelativeTop,
        left: elementRelativeLeft
    } = element.getBoundingClientRect();

    const elementTopPosition = elementRelativeTop + window.scrollY;
    const elementLeftPosition = elementRelativeLeft + window.scrollX;

    return {
        elementBaseWidth,
        elementBaseHeight,
        elementTopPosition,
        elementLeftPosition,
        elementDefaultStyle,
    };
}

function createGhostElement(style) {
    const ghost = document.createElement("div");

    ghost.style = style;
    ghost.classList.add("hidden");

    return ghost;
}

function throttle(callback, delay) {
    let timer = null;

    return (...args) => {
        if (timer === null) {
            callback(...args);

            timer = setTimeout(() => {
                timer = null;
            }, delay);
        }
    }
}

const defaultThrottleDelay = 250;

const parseModifiers = (modifiers) => {
    const parsedModifiers = {
        delay: defaultThrottleDelay,
    }

    for (const modifier in modifiers) {
        if (modifier.endsWith("ms")) {
            parsedModifiers.delay = modifier.slice(0, modifier.indexOf("ms"));
        }
    }

    return parsedModifiers;
}

/**
* This directive calculates element dimensions every scroll tick
* because the size of the `document` might change at any time.
*
* Shouldn't be too heavy computationally.
*/
const affix = {
    mounted(element, binding) {
        const ghostElement = createGhostElement(`width: ${element.offsetWidth}px; height: ${element.offsetHeight}px;`);
        element.parentElement.insertBefore(ghostElement, element);

        const { delay: throttleDelay } = parseModifiers(binding.modifiers);

        element._handleScroll = throttle((_) => {
            let {
                elementBaseWidth,
                elementBaseHeight,
                elementDefaultStyle,
            } = getElementAttributes(element);

            const {
                elementBaseHeight: parentHeight,
                elementTopPosition: parentTopPosition,
            } = getElementAttributes(element.parentElement);

            const parentBottomPosition = parentHeight + parentTopPosition;

            if (parentTopPosition < window.scrollY
                && parentBottomPosition > window.scrollY
            ) {
                element.classList.add("fixed");
                element.style = `top: 0; width: ${elementBaseWidth}px; height: ${elementBaseHeight}px; z-index: 1;`;

                ghostElement.classList.remove("hidden");
            } else {
                element.classList.remove("fixed");
                element.style = elementDefaultStyle;

                ghostElement.classList.add("hidden");
            }
        }, throttleDelay);

        element._handleResize = throttle((_) => {
            element.style["width"] = `${element.parentElement.offsetWidth}px`;
        }, throttleDelay);

        window.addEventListener("scroll", element._handleScroll);
        window.addEventListener("resize", element._handleResize);
    },

    beforeUnmount(element) {
        window.removeEventListener("scroll", element._handleScroll);
        window.removeEventListener("resize", element._handleResize);
    },
}

export default affix;
