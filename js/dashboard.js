document.addEventListener('DOMContentLoaded', () => {

    let user;

    try {
        user = JSON.parse(localStorage.getItem('inkspireCurrentUser'));
    } catch {
        user = null;
    }

    if (!user) {
        location.href = 'login.html';
        return;
    }

    document.getElementById('userGreeting').textContent =
        'Hello, ' + user.name;

    const all = () => {
        try {
            return JSON.parse(localStorage.getItem('inkspireBlogs')) || [];
        } catch {
            return [];
        }
    };

    const mine = () => all().filter(b => b.authorEmail === user.email);

    const grid = document.getElementById('dashboardBlogGrid');

    const empty = document.getElementById('emptyState');

    function render() {

        const posts = mine();

        document.getElementById('totalBlogs').textContent = posts.length;

        document.getElementById('recentBlogs').textContent =
            posts.filter(b =>
                Date.now() - new Date(b.createdAt).getTime() < 7 * 86400000
            ).length;

        grid.innerHTML = posts.map(b => blogCard(b, true)).join('');

        empty.hidden = posts.length > 0;

        grid.querySelectorAll('[data-delete]').forEach(btn => {

            btn.addEventListener('click', () => {

                if (confirm('Delete this story?')) {

                    localStorage.setItem(
                        'inkspireBlogs',
                        JSON.stringify(
                            all().filter(b => b.id !== btn.dataset.delete)
                        )
                    );

                    render();
                }

            });

        });

        grid.querySelectorAll('[data-edit]').forEach(btn => {

            btn.addEventListener('click', () => {

                location.href =
                    'create-blog.html?edit=' + encodeURIComponent(btn.dataset.edit);

            });

        });

    }

    render();

    document.getElementById('logoutBtn').addEventListener('click', () => {

        localStorage.removeItem('inkspireCurrentUser');

        location.href = 'index.html';

    });

});