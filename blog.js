// 博客管理类
class BlogManager {
    constructor() {
        this.posts = this.loadPosts();
        this.currentEditId = null;
        this.initEventListeners();
        this.renderPosts();
    }

    // 从localStorage加载文章
    loadPosts() {
        const posts = localStorage.getItem('blogPosts');
        if (!posts) {
            // 如果没有文章，创建一些示例文章
            const samplePosts = [
                {
                    id: Date.now(),
                    title: '欢迎来到我的博客',
                    category: '其他',
                    content: '这是第一篇博客文章。你可以点击"写文章"按钮创建新文章，也可以编辑或删除现有文章。\n\n博客支持搜索和分类筛选功能，方便你管理和查找文章。',
                    date: new Date().toISOString(),
                }
            ];
            this.savePosts(samplePosts);
            return samplePosts;
        }
        return JSON.parse(posts);
    }

    // 保存文章到localStorage
    savePosts(posts) {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }

    // 初始化事件监听
    initEventListeners() {
        // 新建文章按钮
        const newPostBtn = document.getElementById('newPostBtn');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => this.openModal());
        }

        // 关闭模态框
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // 关闭详情模态框
        const closeDetailModal = document.getElementById('closeDetailModal');
        if (closeDetailModal) {
            closeDetailModal.addEventListener('click', () => this.closeDetailModal());
        }

        // 点击模态框背景关闭
        const postModal = document.getElementById('postModal');
        const postDetailModal = document.getElementById('postDetailModal');
        if (postModal) {
            postModal.addEventListener('click', (e) => {
                if (e.target === postModal) this.closeModal();
            });
        }
        if (postDetailModal) {
            postDetailModal.addEventListener('click', (e) => {
                if (e.target === postDetailModal) this.closeDetailModal();
            });
        }

        // 表单提交
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePost();
            });
        }

        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterPosts());
        }

        // 分类筛选
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterPosts());
        }
    }

    // 打开新建/编辑模态框
    openModal(postId = null) {
        const modal = document.getElementById('postModal');
        const modalTitle = document.getElementById('modalTitle');
        const postForm = document.getElementById('postForm');

        if (postId) {
            // 编辑模式
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                modalTitle.textContent = '编辑文章';
                document.getElementById('postTitle').value = post.title;
                document.getElementById('postCategory').value = post.category;
                document.getElementById('postContent').value = post.content;
                this.currentEditId = postId;
            }
        } else {
            // 新建模式
            modalTitle.textContent = '写文章';
            postForm.reset();
            this.currentEditId = null;
        }

        modal.classList.add('active');
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('postModal');
        modal.classList.remove('active');
        document.getElementById('postForm').reset();
        this.currentEditId = null;
    }

    // 关闭详情模态框
    closeDetailModal() {
        const modal = document.getElementById('postDetailModal');
        modal.classList.remove('active');
    }

    // 保存文章
    savePost() {
        const title = document.getElementById('postTitle').value.trim();
        const category = document.getElementById('postCategory').value;
        const content = document.getElementById('postContent').value.trim();

        if (!title || !content) {
            alert('请填写标题和内容');
            return;
        }

        if (this.currentEditId) {
            // 编辑现有文章
            const post = this.posts.find(p => p.id === this.currentEditId);
            if (post) {
                post.title = title;
                post.category = category;
                post.content = content;
                post.date = new Date().toISOString();
            }
        } else {
            // 创建新文章
            const newPost = {
                id: Date.now(),
                title,
                category,
                content,
                date: new Date().toISOString(),
            };
            this.posts.unshift(newPost);
        }

        this.savePosts(this.posts);
        this.renderPosts();
        this.closeModal();
    }

    // 删除文章
    deletePost(postId) {
        if (confirm('确定要删除这篇文章吗？')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts(this.posts);
            this.renderPosts();
        }
    }

    // 显示文章详情
    showPostDetail(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('postDetailModal');
        const postDetail = document.getElementById('postDetail');

        postDetail.innerHTML = `
            <div class="post-detail-header">
                <h1 class="post-detail-title">${this.escapeHtml(post.title)}</h1>
                <div class="post-detail-meta">
                    <span class="post-category">${this.escapeHtml(post.category)}</span>
                    <span>${this.formatDate(post.date)}</span>
                </div>
            </div>
            <div class="post-detail-content">
                ${this.formatContent(post.content)}
            </div>
            <div class="post-detail-actions">
                <button class="btn btn-primary" onclick="blogManager.openModal(${post.id}); blogManager.closeDetailModal();">编辑</button>
                <button class="btn btn-secondary" onclick="blogManager.deletePost(${post.id}); blogManager.closeDetailModal();">删除</button>
            </div>
        `;

        modal.classList.add('active');
    }

    // 渲染文章列表
    renderPosts() {
        const container = document.getElementById('postsContainer');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        const filteredPosts = this.getFilteredPosts();

        if (filteredPosts.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = filteredPosts.map(post => `
            <div class="post-card" onclick="blogManager.showPostDetail(${post.id})">
                <div class="post-card-header">
                    <h3 class="post-card-title">${this.escapeHtml(post.title)}</h3>
                    <div class="post-card-meta">
                        <span class="post-category">${this.escapeHtml(post.category)}</span>
                        <span>${this.formatDate(post.date)}</span>
                    </div>
                </div>
                <div class="post-card-content">
                    <p class="post-excerpt">${this.getExcerpt(post.content)}</p>
                </div>
                <div class="post-card-footer">
                    <span>点击查看详情</span>
                    <div class="post-actions" onclick="event.stopPropagation()">
                        <button class="action-btn" onclick="blogManager.openModal(${post.id})">编辑</button>
                        <button class="action-btn delete" onclick="blogManager.deletePost(${post.id})">删除</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 筛选文章
    filterPosts() {
        this.renderPosts();
    }

    // 获取筛选后的文章
    getFilteredPosts() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || 'all';

        return this.posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                                post.content.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || post.category === category;
            return matchesSearch && matchesCategory;
        });
    }

    // 获取文章摘要
    getExcerpt(content, length = 100) {
        const text = content.replace(/\n/g, ' ').trim();
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return '今天';
        if (days === 1) return '昨天';
        if (days < 7) return `${days}天前`;
        
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // 格式化内容（保留换行）
    formatContent(content) {
        return this.escapeHtml(content)
            .split('\n')
            .map(line => `<p>${line || '&nbsp;'}</p>`)
            .join('');
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化博客管理器
let blogManager;
document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});
