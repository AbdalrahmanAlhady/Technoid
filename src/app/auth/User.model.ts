export class User {
    constructor(
      public email: string,
      public id: string,
      private  _token: string,
      private _tokenExpirationDate: Date
    ) {}
  
  
    // the getter below used to access token like the "User.token"
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
  }
  