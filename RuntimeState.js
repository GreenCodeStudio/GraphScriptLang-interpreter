import {ClassCollection} from "@graph-script-lang/core/ClassCollection";
import {FunctionRunner} from "./FunctionRunner";
import {GSLDebug} from "@graph-script-lang/stdlib/Debug/debug";
import {GSLMath} from "@graph-script-lang/stdlib/Math/math";
import {GSLConvert} from "@graph-script-lang/stdlib/Convert/convert";

export class RuntimeState {
    stack = [];

    constructor() {
        this.classCollection = new ClassCollection();
        this.classCollection.add(GSLDebug)
        this.classCollection.add(GSLMath)
        this.classCollection.add(GSLConvert)


    }

    runFunction(fun) {
        if (this.stack.length > 0) {
            throw new Error('Stack is not empty')
        }
        this.stack.push(new FunctionRunner(this, fun, ()=>console.log('debug completed')));
    }

    step() {
        if (this.stack.length === 0) {
            return false;
        }
        const runner = this.stack[this.stack.length - 1];
        runner.step()
    }

    run() {
        while (this.stack.length) {
            const runner = this.stack[this.stack.length - 1];
            runner.step()
        }

    }
    stackPop(){
        this.stack.pop();
        const runner = this.stack[this.stack.length - 1];
        if(runner){
            runner.goNextNode();
        }

    }
}