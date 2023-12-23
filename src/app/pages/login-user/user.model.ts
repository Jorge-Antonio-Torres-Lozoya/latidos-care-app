export class UserModel {
  constructor(private _token:any){}

  get token(){
    if(!this._token){
      return null;
    }
    return this._token
  }
}
