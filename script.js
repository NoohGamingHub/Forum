// Elements
const postForm = document.getElementById('postForm');
const postContent = document.getElementById('postContent');
const postsContainer = document.getElementById('posts');
const userId = 'user123'; // Replace with an actual user ID when using authentication

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <p>${post.content}</p>
            <small>Posted on ${new Date(post.date).toLocaleString()}</small>
            <div class="post-actions">
                <div class="likes">
                    <button onclick="likePost(${index})">👍</button>
                    <span>${post.likedBy?.length || 0}</span>
                    <button onclick="dislikePost(${index})">👎</button>
                    <span>${post.dislikedBy?.length || 0}</span>
                </div>
                <div>
                    <button onclick="editPost(${index})">Edit</button>
                    <button onclick="deletePost(${index})">Delete</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });
}

// Save posts to localStorage
function savePosts(posts) {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
}

// Add a new post
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = postContent.value.trim();
    if (!content) return;

    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    posts.unshift({ content, date: new Date().toISOString(), likes: 0, likedBy: [], dislikedBy: [] });
    savePosts(posts);
    postContent.value = '';
    loadPosts();
});

// Like a post
function likePost(index) {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const post = posts[index];
    if (!post.likedBy) post.likedBy = [];
    if (!post.dislikedBy) post.dislikedBy = [];

    if (post.likedBy.includes(userId)) {
        post.likedBy = post.likedBy.filter(id => id !== userId); // Remove like
    } else {
        post.likedBy.push(userId);
        post.dislikedBy = post.dislikedBy.filter(id => id !== userId); // Remove dislike
    }

    savePosts(posts);
    loadPosts();
}

// Dislike a post
function dislikePost(index) {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const post = posts[index];
    if (!post.likedBy) post.likedBy = [];
    if (!post.dislikedBy) post.dislikedBy = [];

    if (post.dislikedBy.includes(userId)) {
        post.dislikedBy = post.dislikedBy.filter(id => id !== userId); // Remove dislike
    } else {
        post.dislikedBy.push(userId);
        post.likedBy = post.likedBy.filter(id => id !== userId); // Remove like
    }

    savePosts(posts);
    loadPosts();
}

// Edit a post
function editPost(index) {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const originalContent = posts[index].content;

    const newContent = prompt('Edit your post:', originalContent);
    if (newContent !== null && newContent.trim() !== '') {
        posts[index].content = newContent.trim();
        savePosts(posts);
        loadPosts();
    }
}

// Delete a post
function deletePost(index) {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const postDiv = postsContainer.children[index];
    if (confirm('Are you sure you want to delete this post?')) {
        postDiv.classList.add('deleted-post');
        setTimeout(() => {
            posts.splice(index, 1);
            savePosts(posts);
            loadPosts();
        }, 500);
    }
}

// Initialize
loadPosts();
