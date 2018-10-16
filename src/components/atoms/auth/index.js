import auth0 from 'auth0-js';
import { navigateTo } from 'gatsby';

const AUTH0_DOMAIN = 'wikiweknow.auth0.com';
const AUTH0_CLIENT_ID = 'Nno94ZmFD5Wi3Dan16rvs5aJtri0uk5G';

export default class Auth {
  constructor() {
    this.auth = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:8000/callback',
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    });

    this.local = (typeof window !== 'undefined') ? localStorage : {};
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth.authorize();
  }

  logout() {
    if ((typeof window !== 'undefined')) {
      this.local.removeItem('access_token');
      this.local.removeItem('id_token');
      this.local.removeItem('expires_at');
      this.local.removeItem('user');
      // Return to the homepage after authentication.
      navigateTo('/login');
    }
  }

  handleAuthentication() {
    if (typeof window !== 'undefined') {
      this.auth.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }

        // Return to the homepage after authentication.
        navigateTo('/about/introduction');
      });
    }
  }

  isAuthenticated() {
    if ((typeof window !== 'undefined')) {
      const expiresAt = JSON.parse(this.local.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }
    return null;
  }

  setSession(authResult) {
    if ((typeof window !== 'undefined')) {
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.local.setItem('access_token', authResult.accessToken);
      this.local.setItem('id_token', authResult.idToken);
      this.local.setItem('expires_at', expiresAt);

      this.auth.client.userInfo(authResult.accessToken, (err, user) => {
        this.local.setItem('user', JSON.stringify(user));
      });
    }
    return null;
  }

  getUser() {
    if ((typeof window !== 'undefined') && this.local.getItem('user')) {
      return JSON.parse(this.local.getItem('user'));
    }
    return null;
  }

  getUserName() {
    if ((typeof window !== 'undefined') && this.getUser()) {
      return this.getUser().name;
    }
    return null;
  }
}
