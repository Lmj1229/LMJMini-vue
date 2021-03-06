import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
// import { track,trigger } from "./effect";


export function reactive(raw){
    return new Proxy(raw,mutableHandlers)
   
}
export function readonly(raw){
    return createActiveObject(raw,readonlyHandlers)
  
}
function createActiveObject(raw:any,baseHandlers){
    return new Proxy(raw,readonlyHandlers)
}
