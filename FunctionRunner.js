import {Input} from "@graph-script-lang/core/Graphs/Input";
import {FunctionCall} from "@graph-script-lang/core/Graphs/FunctionCall";
import {NativeFunction} from "@graph-script-lang/core/NativeFunction";
import {ConstantValue} from "@graph-script-lang/core/Graphs/ConstantValue";

export class FunctionRunner {
    constructor(state, fun) {
        this.state = state;
        this.functionResponses = {};
        this.fun = fun;
        this.currentNode = fun.elements.find(x => x instanceof Input);
    }

    step() {
        if (this.currentNode instanceof FunctionCall) {
            if (this.currentNode.fun instanceof NativeFunction) {
                const inputs = Object.fromEntries(this.fun.connections.filter(x => x.to[0] == this.currentNode.id).map(x => {
                    let value = null;
                    const source = this.fun.elements.find(e => e.id === x.from[0]);
                    if (source instanceof ConstantValue) {
                        value = source.value;
                    } else if (source instanceof FunctionCall) {
                        value = this.functionResponses[source.id][x.from[1]];
                    }

                    return [x.to[1], value]
                }));
                this.functionResponses[this.currentNode.id] = this.currentNode.fun.execute(inputs);
            }
        }
        const connection = this.fun.connections.find(x => x.from[0] == this.currentNode.id && x.from[1] == '__exit')
        if (connection) {
            this.currentNode = this.fun.elements.find(x => x.id === connection.to[0]);
        } else {
            return {}
        }
    }
}