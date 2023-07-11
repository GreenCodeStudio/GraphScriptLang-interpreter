import {ClassCollection} from "@graph-script-lang/core/ClassCollection";
import {FunctionRunner} from "./FunctionRunner";
import {GSLDebug} from "@graph-script-lang/stdlib/Debug/debug";

export class RuntimeState {
    stack = [];

    constructor() {
        this.classCollection = new ClassCollection();
        this.classCollection.classes['GSL/Debug'] = GSLDebug;


    }

    runFunction(fun) {
        if (this.stack.length > 0) {
            throw new Error('Stack is not empty')
        }
        this.stack.push(new FunctionRunner(this, fun));
    }
    step(){
        if(this.stack.length===0){
            return false;
        }
        const runner=this.stack[this.stack.length-1];
        if(runner.step()){
            this.stack.pop();
        }
    }
}