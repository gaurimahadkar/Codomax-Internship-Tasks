const demoBlogs = [
    {
        id: 'demo1',
        title: 'The quiet art of starting again',
        category: 'Lifestyle',
        content: 'A fresh start does not need a perfect plan. Sometimes it begins with one small choice, one curious question, or one page written just for yourself.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        author: 'Inkspire Editors',
        date: 'Nov 02, 2026'
    },
    {
        id: 'demo2',
        title: 'Building a better digital tomorrow',
        category: 'Technology',
        content: 'Technology is most powerful when it helps people solve real problems. Great products begin with empathy, experimentation, and a willingness to learn.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        author: 'Inkspire Editors',
        date: 'Oct 28, 2026'
    },
    {
        id: 'demo3',
        title: 'Make creativity a daily habit',
        category: 'Creativity',
        content: 'Creativity grows when we make space for it. Collect ideas, follow unexpected paths, and give yourself permission to make imperfect things.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        author: 'Inkspire Editors',
        date: 'Oct 20, 2026'
    }
];

const getBlogs = () => {
    try {
        return JSON.parse(localStorage.getItem('inkspireBlogs')) || [];
    } catch {
        return [];
    }
};

const currentUser = () => {
    try {
        return JSON.parse(localStorage.getItem('inkspireCurrentUser'));
    } catch {
        return null;
    }
};

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));

function blogCard(b, owner = false) {

    return `
    <article class="blog-card">

        <img class="blog-cover"
             src="${esc(b.image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80')}"
             alt="${esc(b.title)}"
             onerror="this.style.display='none'">

        <div class="blog-body">

            <div class="blog-meta">
                <span class="pill">${esc(b.category)}</span>
                <span>${esc(b.date || 'Recently')}</span>
            </div>

            <h3>${esc(b.title)}</h3>

            <p class="excerpt">
                ${esc((b.content || '').slice(0, 130))}
                ${(b.content || '').length > 130 ? '…' : ''}
            </p>

            <div class="card-bottom">

                <span>By ${esc(b.author || 'Writer')}</span>

                ${owner ? `
                    <div class="card-actions">
                        <button class="small-action"
                                data-edit="${esc(b.id)}">
                            Edit
                        </button>

                        <button class="small-action danger"
                                data-delete="${esc(b.id)}">
                            Delete
                        </button>
                    </div>
                ` : '<span class="read-link">Read story ↗</span>'}

            </div>

        </div>

    </article>`;
}

function renderHome(category = 'All') {

    const el = document.getElementById('homeBlogGrid');

    if (!el) return;

    const list = [...getBlogs(), ...demoBlogs]
        .filter(b => category === 'All' || b.category === category);

    el.innerHTML = list.map(b => blogCard(b)).join('') ||
        '<p class="empty">No stories in this category yet.</p>';
}

document.addEventListener('DOMContentLoaded', () => {

    const year = document.getElementById('year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    renderHome();

    document.querySelectorAll('[data-filter]').forEach(btn => {

        btn.addEventListener('click', () => {

            document.querySelectorAll('[data-filter]')
                .forEach(x => x.classList.remove('active'));

            btn.classList.add('active');

            renderHome(btn.dataset.filter);
        });

    });

    const menu = document.querySelector('.menu-btn');

    if (menu) {
        menu.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.toggle('open');
        });
    }

});