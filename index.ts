export class MyObservable<T>
{
  private _subscribe: any;

  constructor(subscribe?: any){
    this._subscribe =subscribe;
  }

  subscribe(onNext: any , onError?: any , onCompleted?: any){
    if( typeof onNext === 'function' ){
      return this._subscribe({
        onNext : onNext,
        onError: onError || (() => {}),
        onCompleted: onCompleted || (() => {})
      });
    }
    else{
      return this._subscribe(onNext)
    }
  }

  // Must only return Observable 
  // to continue chain of methosds
  static of(...args) {
    return new MyObservable((obs) => {
      args.forEach(val => {
        obs.onNext(val)
      });
      obs.onCompleted();

      return{ 
        unsubscribe:() =>{
          obs = {
            onNext:() => {},
            onError:() =>{},
            onCompleted:() =>{}
          };
        }
      };
     });
  }


  static from(iterable) {
    return new MyObservable((observer)=>{
      for(let element of iterable){
        observer.onNext(element);
      }
      observer.onComplete();

      return{
        unsubscribe:() =>{
          observer = {
          onNext:() => {},
          onError:() =>{},
          onCompleted:() =>{}
          };
        }
      
      };
    });
  }

  static fromEvent(source, event){
    return new MyObservable((obs) =>{
      const callbackFunc  = (e) => obs.onNext(e);

      source.addEventListener(event, callbackFunc);

      return {
        unsubscribe: () => source.removeEventListener(event, callbackFunc)
      };
    });
  }
  
}