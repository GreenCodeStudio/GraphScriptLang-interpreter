import {Input} from "@graph-script-lang/core/Graphs/Input";
import {FunctionCall} from "@graph-script-lang/core/Graphs/FunctionCall";
import {NativeFunction} from "@graph-script-lang/core/NativeFunction";

export class FunctionRunner {
    constructor(state, fun) {
        this.state = state;
        this.fun = fun;
        this.currentNode = fun.elements.find(x => x instanceof Input);
    }

    step() {
        if (this.currentNode instanceof FunctionCall) {
            if (this.currentNode.fun instanceof NativeFunction) {
                this.currentNode.fun.execute(this);
            }
        }
        const connection = this.fun.connections.find(x => x.from[0] == this.currentNode.id && x.from[1] == '__exit')
        this.currentNode = this.fun.elements.find(x => x.id === connection.to[0]);
    }
}