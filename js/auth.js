const users = () => {
    try {
        return JSON.parse(localStorage.getItem('inkspireUsers')) || [];
    } catch {
        return [];
    }
};

const say = (id, msg, ok = false) => {

    const el = document.getElementById(id);

    if (el) {
        el.textContent = msg;
        el.className = 'message' + (ok ? ' success' : '');
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const reg = document.getElementById('registerForm');

    if (reg) {

        reg.addEventListener('submit', e => {

            e.preventDefault();

            const name = document.getElementById('registerName').value.trim();

            const email = document.getElementById('registerEmail').value.trim().toLowerCase();

            const password = document.getElementById('registerPassword').value;

            const confirm = document.getElementById('confirmPassword').value;

            if (password !== confirm) {
                return say('registerMessage', 'Passwords do not match.');
            }

            const list = users();

            if (list.some(u => u.email === email)) {
                return say('registerMessage', 'This email is already registered.');
            }

            list.push({
                name,
                email,
                password
            });

            localStorage.setItem('inkspireUsers', JSON.stringify(list));

            localStorage.setItem(
                'inkspireCurrentUser',
                JSON.stringify({ name, email })
            );

            say('registerMessage', 'Account created! Opening dashboard...', true);

            setTimeout(() => {
                location.href = 'dashboard.html';
            }, 700);

        });

    }

    const login = document.getElementById('loginForm');

    if (login) {

        login.addEventListener('submit', e => {

            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();

            const password = document.getElementById('loginPassword').value;

            const user = users().find(u =>
                u.email === email && u.password === password
            );

            if (!user) {
                return say('loginMessage', 'Incorrect email or password.');
            }

            localStorage.setItem(
                'inkspireCurrentUser',
                JSON.stringify({
                    name: user.name,
                    email: user.email
                })
            );

            say('loginMessage', 'Login successful! Redirecting...', true);

            setTimeout(() => {
                location.href = 'dashboard.html';
            }, 600);

        });

    }

});