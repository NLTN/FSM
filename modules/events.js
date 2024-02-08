export class EventManager{

    constructor(){
        this.actions = {};
        this.register("click");
        this.register("change");
        this.register("keyup");
    }

    /**
     * Register a new event listener like "mousedown" or "keyup" or "submit"
     * @param {string} type 
     */
    register(type){
        document.body.addEventListener(type, (e)=>{
            let source = e.target;
            let action = source.dataset[type] ?? false;

            if(action == false){
                let relative = source.closest("[data-click]");
                action = relative?.dataset?.[type] ?? false;
            }
            this.actions[action]?.(e);
        });
    }

    /**
     * Execute a function when the user clicks on an HTML Element 
     * with a data-click attribute matching the provided name. 
     * @param {string} name A name for this action
     * @param {Function} callback Function to be executed on click 
     */
    click(name, callback){
       this.actions[name] = callback;
    }

    /**
     * Execute a function when the user clicks on an HTML Element 
     * with a data-click attribute matching the provided name. 
     * @param {string} name A name for this action
     * @param {Function} callback Function to be executed on click 
     */
    change(name, callback){
        this.actions[name] = callback;
     }

    /**
     * Execute a function when the user clicks on an HTML Element 
     * with a data-click attribute matching the provided name. 
     * @param {string} name A name for this action
     * @param {Function} callback Function to be executed on click 
     */
    keyup(name, callback){
        this.actions[name] = callback;
     }
}
