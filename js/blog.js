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

    const read = () => {
        try {
            return JSON.parse(localStorage.getItem('inkspireBlogs')) || [];
        } catch {
            return [];
        }
    };

    const params = new URLSearchParams(location.search);

    const editId = params.get('edit');

    const old = read().find(b =>
        b.id === editId && b.authorEmail === user.email
    );

    const title = document.getElementById('blogTitle');

    const category = document.getElementById('blogCategory');

    const image = document.getElementById('blogImage');

    const content = document.getElementById('blogContent');

    const preview = document.getElementById('imagePreview');

    const count = document.getElementById('wordCount');

    if (old) {

        title.value = old.title;

        category.value = old.category;

        image.value = old.image || '';

        content.value = old.content;

        document.querySelector('.editor-heading h1').textContent =
            'Edit your story.';

        document.querySelector('.editor-bottom button').textContent =
            'Save changes ↗';

    }

    function showImage() {

        preview.innerHTML = image.value
            ? `<img src="${image.value.replace(/"/g, '&quot;')}"
                    alt="Cover preview"
                    onerror="this.parentElement.textContent='Could not load image. Check URL.'">`
            : 'Cover image preview will appear here';

    }

    image.addEventListener('input', showImage);

    showImage();

    content.addEventListener('input', () => {

        count.textContent =
            (content.value.trim()
                ? content.value.trim().split(/\s+/).length
                : 0) + ' words';

    });

    document.getElementById('blogForm').addEventListener('submit', e => {

        e.preventDefault();

        const posts = read();

        const post = {

            id: old ? old.id : 'post-' + Date.now(),

            title: title.value.trim(),

            category: category.value,

            image: image.value.trim(),

            content: content.value.trim(),

            author: user.name,

            authorEmail: user.email,

            date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            }),

            createdAt: old ? old.createdAt : new Date().toISOString()

        };

        if (old) {

            const i = posts.findIndex(b => b.id === old.id);

            posts[i] = post;

        } else {

            posts.unshift(post);

        }

        localStorage.setItem('inkspireBlogs', JSON.stringify(posts));

        const msg = document.getElementById('blogMessage');

        msg.textContent = old
            ? 'Story updated successfully!'
            : 'Your story has been published!';

        msg.className = 'message success';

        setTimeout(() => {
            location.href = 'dashboard.html';
        }, 650);

    });

});