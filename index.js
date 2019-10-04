
window.addEventListener('load', () => {
    console.log('register service worker');
    navigator.serviceWorker.register('service-worker.js');
});


document.addEventListener('DOMContentLoaded', () => {

    var worker = new Worker('./worker.js');

    var vm = {
        availableLetters: ko.observable().extend({ rateLimit: 250}),
        guessedLetters: ko.observable().extend({ rateLimit: 250}),
        guessedRegex: ko.pureComputed(function () {
            if(vm.availableLetters() && vm.availableLetters().length > 0 
            && vm.guessedLetters() && vm.guessedLetters().length > 0) {
                let availableLetters = new Set(vm.availableLetters().toLowerCase());
                let guessedLetters = vm.guessedLetters().toLowerCase();
                let availableRegex = `[ ${Array.from(availableLetters).join('')}]`;
                return new RegExp(`^${guessedLetters.replace(/-/g, availableRegex)}$`)
            }
            else {
                return null;
            }
        }),
        possibleAnswers: ko.observableArray()
    };

    vm.guessedRegex.subscribe(function (newValue) {
        if(newValue) {
            worker.postMessage({ availableLetters: vm.availableLetters().toLowerCase(), newValue: newValue});
        }
        
    });

    worker.onmessage = function (e) {
        console.log(`received message from worker: ${e.data}`);
        vm.possibleAnswers(e.data);
    };

    ko.applyBindings(vm);
});