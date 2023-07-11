import {Input} from "@graph-script-lang/core/Graphs/Input";
import {FunctionCall} from "@graph-script-lang/core/Graphs/FunctionCall";
import {If} from "@graph-script-lang/core/Graphs/If";
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
            this.functionResponses[this.currentNode.id] = this.executeFunction(this.currentNode)

        }else if (this.currentNode instanceof If) {
            const inputs = this.calculateInputs(this.currentNode);
            let connection;
            if(inputs['condition']) {
                connection = this.fun.connections.find(x => x.from[0] == this.currentNode.id && x.from[1] == 'true')
            }else{
                connection = this.fun.connections.find(x => x.from[0] == this.currentNode.id && x.from[1] == 'false')
            }
            if (connection) {
                this.currentNode = this.fun.elements.find(x => x.id === connection.to[0]);
                return
            }else{
                return {}
            }
        }
        const connection = this.fun.connections.find(x => x.from[0] == this.currentNode.id && x.from[1] == '__exit')
        if (connection) {
            this.currentNode = this.fun.elements.find(x => x.id === connection.to[0]);
        } else {
            return {}
        }
    }

    executeFunction(node) {
        if (node.fun instanceof NativeFunction) {
            const inputs = this.calculateInputs(node);
            return node.fun.execute(inputs);
        }
    }

    calculateInputs(node) {
        const inputs = Object.fromEntries(this.fun.connections.filter(x => x.to[0] == node.id).map(x => {
            let value = null;
            const source = this.fun.elements.find(e => e.id === x.from[0]);
            if (source instanceof ConstantValue) {
                value = source.value;
            } else if (source instanceof FunctionCall) {
                if (source.fun.pure) {
                    value = this.executeFunction(source)[x.from[1]];
                } else {
                    value = this.functionResponses[source.id][x.from[1]];
                }
            }

            return [x.to[1], value]
        }));
        return inputs;
    }
}