import {WebApp, Component, EventManager} from './modules/app.js';
import {Grid, html} from "https://unpkg.com/gridjs?module";
// import { RowSelection } from "https://unpkg.com/gridjs/plugins/selection/dist/selection.umd.js";

// Required to initialize our web app
const app = new WebApp();

// Give this the "id" value of any HTML form and it will return
// a native JavaScript object with all the form inputs.
function getFormData(formId) {
    const form = document.querySelector(`#${formId}`);
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());
    return entries;
}

// Example of creating a new component with dummy data
// And rendering it to the page
// const main = app.component({
//     name: "Main",
//     selector: "#DemoArea",
//     template: "#FooBar",
//     data: {
//         title: "CPSC431 Final Demo Page",
//         buttons: [
//             { msg: "Hello", displayText: "Say Hi" },
//             { msg: "Goodbye", displayText: "Say Bye" }
//         ]
//     }
// });

// main.render("replace");

function intersection(setA, setB) {
    let intersectionSet = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            intersectionSet.add(elem);
        }
    }
    return intersectionSet;
}


function loadSample1() {
    const elem = document.getElementsByName("transitiontable")[0];
    elem.value = `B,A\nC,C\nD,B\nA,D`;
}

function loadSample2() {
    const elem = document.getElementsByName("transitiontable")[0];
    elem.value = `{B},{A}\n{C},{C}\n{D},{B}\n{A},{D}`;
}

function loadSample3() {
    const elem = document.getElementsByName("transitiontable")[0];
    elem.value = `{B},{A},{C}\n{C},{C},{C}\n{D},{B},{D}\n{A},{D},{C}`;
}

async function onLoad() {
    document.getElementsByName("states")[0].value = "A,B,C,D";
    loadSample1();
    drawTransitionTableRowNames();
}

function showConfirmBox(title, message, dataset) {
    const form = document.getElementById('ConfirmBox');
    form.style.display = 'block';
    const yesButton = document.getElementById('ConfirmBoxYesButton');

    yesButton.dataset['click'] = dataset['click'];
    yesButton.dataset['id'] = dataset['id'];
    yesButton.dataset['listid'] = dataset['listid'];
}

function traceDFSM(inputString, initialState, finalStates, trasitionTable) {
    let currentState = initialState;
    const path = [currentState];

    let i = 0;
    let done = false;
    while (i < inputString.length && !done) {
        currentState = trasitionTable[currentState][inputString[i]];

        if (!currentState) {
            currentState = "NULL";
            done = true;
        }
        
        path.push(currentState);
        ++i;
    }

    const outputElem = document.getElementById("output");
    outputElem.innerHTML = path.join('→');;

    if (finalStates.has(currentState)) 
        outputElem.insertAdjacentHTML("beforeend", " Accepted");
     else 
        outputElem.insertAdjacentHTML("beforeend", " Rejected");
    
}

function traceNFSM(inputString, initialState, finalStates, trasitionTable) {
    const entries = getFormData("MainForm");

    let currentStates = [initialState];

    // ------ Step 1: Check epsilons ------
    if (entries.FSMType == "NFSMwithEpsilon") { // Notes: a circle loop can happen.. Check if exists before insert to the current states.
        currentStates.forEach((state) => { // Get the epsilons
            const row = trasitionTable[state];
            const epsilons = row["ε"];

            // Append the epsilonStates to currentStates
            epsilons.forEach((epsilonState) => {
                if (! currentStates.includes(epsilonState)) {
                    currentStates.push(epsilonState);
                }
            });
        });
        // console.log(currentStates);
    }

    const path = [`{${
            currentStates.toString()
        }}`];


    // Loop thru each character of the input string
    for (var i = 0; i < inputString.length; ++ i) {
        const nextStates = [];

        // ------ Step 1: State transitions ------
        currentStates.forEach((state) => {
            const temp = trasitionTable[state][inputString[i]];
            nextStates.push(... temp);
            console.log(nextStates);
        });

        currentStates = nextStates;

        // ------ Step 2: Epsilon transitions ------
        if (entries.FSMType == "NFSMwithEpsilon") { // Notes: a circle loop can happen.. Check if exists before insert to the current states.
            currentStates.forEach((state) => { // Get the epsilons
                const row = trasitionTable[state];
                const epsilons = row["ε"];

                // Append the epsilonStates to currentStates
                epsilons.forEach((epsilonState) => {
                    if (! currentStates.includes(epsilonState)) {
                        currentStates.push(epsilonState);
                    }
                });
            });
            console.log(currentStates);
        }

        path.push(`{${
            currentStates.toString()
        }}`);


    }

    const outputElem = document.getElementById("output");
    outputElem.innerHTML = path.join('→');

    const acceptedStates = Array.from(intersection(finalStates, currentStates));
    if (acceptedStates.length > 0) 
        outputElem.insertAdjacentHTML("beforeend", `<br>Accepted States: {${acceptedStates}}`);
     else 
        outputElem.insertAdjacentHTML("beforeend", "<br>Rejected");
    
}

app.events.click("traceButtonClicked", async (e) => {
    const entries = getFormData("MainForm");
    const inputString = entries.inputString;
    const trasitionTable = buildTrasitionTableFromAdjacencyMatrix(entries.transitiontable);
    const finalStates = new Set(entries.finalStates.split(','));
    console.log(entries.FSMType);
    if (entries.FSMType == "DFSM") {
        traceDFSM(inputString, entries.initialState, finalStates, trasitionTable);
    } else {
        traceNFSM(inputString, entries.initialState, finalStates, trasitionTable);
    }

});

app.events.click("FSMTypeRadioClicked", async (e) => {
    const entries = getFormData("MainForm");

    // Epsilon (ε) symbol
    const sigmaElem = document.getElementsByName("sigma")[0];
    if (entries.FSMType == "NFSMwithEpsilon" && entries.sigma.includes('ε') == false) { // Add Epsilon (ε) symbol
        sigmaElem.value += ",ε";
        loadSample3();
    } else if (entries.FSMType == "NFSM") { // Remove Epsilon (ε) symbol
        sigmaElem.value = sigmaElem.value.replace(",ε", "");
        loadSample2();
    } else {
        sigmaElem.value = sigmaElem.value.replace(",ε", "");
        loadSample1();
    }


    // document.getElementsByName("transitiontable")[0].value = `{B},{A}\n{C},{C}\n{D},{B}\n{A},{D}`;
    drawTransitionTableColNames();
});

async function drawTransitionTableRowNames() {
    const entries = getFormData("MainForm");
    const data = {
        items: entries.states.split(",")
    };

    let options = {
        name: "DynamicDemo",
        selector: "#RowNamesArea",
        template: `{{#items}}<li>{{.}}</li>{{/items}}`,
        data: data
    };

    let comp = app.component(options);

    comp.render();
}

async function drawTransitionTableColNames() {
    const entries = getFormData("MainForm");
    const data = {
        items: entries.sigma.split(",")
    };

    let options = {
        name: "DynamicDemo",
        selector: "#ColNamesArea",
        template: `{{#items}}<span>{{.}}</span>&nbsp;{{/items}}`,
        data: data
    };

    let comp = app.component(options);

    comp.render();
}

app.events.change("statesChanged", async (e) => {
    drawTransitionTableRowNames();
});

app.events.change("sigmaChanged", async (e) => {
    drawTransitionTableColNames();
});

// //////////////////////////
function buildTrasitionTableFromAdjacencyMatrix(inputString) { // States
    const entries = getFormData("MainForm");
    const states = entries.states.split(",");
    const symbols = entries.sigma.split(",");

    // Split the string into lines
    var lines = inputString.split('\n');

    if (states.length != lines.length) 
        return;
    

    // Initialize an empty dictionary
    var dictionary = {};

    lines.forEach((line, rowIndex) => {
        var d = {};

        symbols.forEach((s, index) => {
            if (entries.FSMType == "DFSM") {
                const values = line.split(',');
                // Add key-value pair to the dictionary
                d[s] = values[index];
            } else {
                const pattern = /\{([^}]+)\}/g;
                const matches = [];

                let match;
                while ((match = pattern.exec(line)) !== null) {
                    matches.push(match[1]);
                }
                d[s] = new Set(matches[index].split(','));
            }
        });
        const key = states[rowIndex];
        dictionary[key] = d;

    });
    console.log(dictionary);
    return dictionary;
}
// //////////////////////////

// Example of using a template that has to be downloaded first
(async () => {
    onLoad();
    const entries = getFormData("MainForm");
    buildTrasitionTableFromAdjacencyMatrix(entries.transitiontable);
})(); // Self-Executing function as we can use async/await more easily.
