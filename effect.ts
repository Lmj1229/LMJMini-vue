import { reduceEachLeadingCommentRange } from "typescript";
import { extend } from "./shared";

class ReactiveEffect{
    private _fn:any;
    deps=[];
    onStop?:()=>void;
    active = true;
    public scheduler: Function | undefined;
    constructor(fn, scheduler?:Function){
        this._fn=fn;
        this.scheduler=scheduler;
    }
    run(){
        activeEffect = this;
        return this._fn();

    }
    stop(){
       if (this.active){
        cleanupEffect(this);
        if (this.onStop) {
            this.onStop();
        }
        this.active=false;
       }
    }
   

}
function cleanupEffect(effect) {
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect);
    });
    
}
const targetMap = new Map()
export function track(target,key){
    // Set   target -> key -> dep
    let depsMap = targetMap.get(target);
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target,depsMap);
    }
    let  dep=depsMap.get(key);
    if(!dep){
        dep = new Set();
        depsMap.set(key,dep);
    }
    if(!activeEffect){
       return;
    }
    dep.add(activeEffect);
    activeEffect.deps.push(dep);



}
export function trigger(target,key){
    const depsMap = targetMap.get(target);
    if(!depsMap) return;
    const dep = depsMap.get(key);
    if(!dep) return;
    dep.forEach(effect=>{
        if(effect.scheduler){
            effect.scheduler();
        }else{
            effect.run();

        }
     
    })
}
let activeEffect;
export function effect(fn,options:any={}){
    const scheduler = options.scheduler;
    const _effect = new ReactiveEffect(fn,scheduler);
    Object.assign(_effect,options);
    extend(_effect,options);
    // _effect.onStop = options.onStop;
    _effect.run();
    const runner:any =  _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
export function stop(runner){
    runner.effect.stop();
 
}