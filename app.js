class Control {
    constructor() {
        this.available = [];
        this.selected = [];
    }
}

const controlInstance = new Control();

const initApp = () => {
    window.addEventListener("load", () => {
        console.log('hello')
    })
}

initApp();
