class Utils {
    static Auth(values) {
        const hours = 24;
        const now = new Date().getTime();
        const login = localStorage.getItem('currentUser');
        if (login === null) {
            localStorage.setItem(values);
            // localStorage.setItem('_currentToken', token);
        } else {
            if ((now - login) > hours * 60 * 60 * 1000) {
                localStorage.clear();
                localStorage.setItem('loggedIn', now);
            }
        }
    }
}


export default Utils;