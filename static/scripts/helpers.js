export default class Random{
    constructor(max){
        this.max = max ?? 10;
    }
    get number(){
        
        return Math.random() * this.max;
    }
    get position(){ 
        return (Math.random() - 0.5) * 13
    }
    get rotation(){ 
        return Math.random() * Math.PI
    }
}
