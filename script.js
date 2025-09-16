document.addEventListener('DOMContentLoaded', () => {
    // --- INITIAL DATA ---
    const initialArticles = [
        {
            id: 1,
            title: "Building Neural Networks from Scratch",
            category: "AI/ML",
            image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/055bf1b0-9c16-4f57-8c3f-18fe9f100f41.png",
            description: "Learn how neural networks work by implementing one from scratch in Python. This guide covers the fundamentals of artificial intelligence with hands-on examples, exploring concepts like perceptrons, activation functions, and backpropagation in a clear, step-by-step manner.",
            author: "Rajesh Kumar",
            authorImage: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/555bdd3f-e25d-47c8-99aa-ec4f7dd79e2f.png",
            date: "3 days ago"
        },
        {
            id: 2,
            title: "The Complete Guide to Building Scalable Web Applications with React",
            category: "Web Dev",
            image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ba49b99b-ca7c-4eff-ab07-a4ede9de3f29.png",
            description: "Discover best practices for architecting scalable web applications using React, Redux, and modern JavaScript tooling. Includes performance optimization techniques, state management strategies, and component design patterns to help you build robust and maintainable front-end systems.",
            author: "Priya Sharma",
            authorImage: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a5952bea-1dae-438a-8b07-c92d88d867f4.png",
            date: "1 week ago"
        },
        {
            id: 3,
            title: "Effective Data Visualization Techniques for Better Insights",
            category: "Data Science",
            image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5adeaa2b-061a-4e81-9482-9358f087636b.png",
            description: "Master the art of data storytelling with Python visualization libraries. Learn which charts to use for different types of data analysis scenarios, and how to design compelling visuals that effectively communicate your findings to any audience.",
            author: "Amit Patel",
            authorImage: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9d744a58-c325-4cdc-84ed-a978237fbac4.png",
            date: "2 weeks ago"
        }
    ];

    const categories = [
        { name: "AI/ML", count: 12, icon: "fas fa-robot" },
        { name: "Web Dev", count: 24, icon: "fas fa-laptop-code" },
        { name: "Data Science", count: 18, icon: "fas fa-database" },
        { name: "Cybersecurity", count: 9, icon: "fas fa-shield-alt" },
        { name: "Embedded Systems", count: 7, icon: "fas fa-microchip" },
        { name: "IoT", count: 11, icon: "fas fa-network-wired" }
    ];

    // --- STATE ---
    let articles = [];
    let currentCategoryFilter = 'All';

    // --- DOM ELEMENTS ---
    const html = document.documentElement;
    const articlesGrid = document.getElementById('articles-grid');
    const categoriesGrid = document.getElementById('categories-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const submitArticleForm = document.getElementById('submit-article-form');
    const notification = document.getElementById('notification');

    // --- UTILITY FUNCTIONS ---
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = `fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg opacity-0 translate-y-10 transition-all duration-300 z-[101] ${isError ? 'bg-red-500' : 'bg-green-500'}`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function saveArticles() {
        localStorage.setItem('techBlogArticles', JSON.stringify(articles));
    }

    // --- ACTION FUNCTIONS ---
    function renderArticles(filter = 'All', searchTerm = '') {
        articlesGrid.innerHTML = '';
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredArticles = articles
            .filter(article => filter === 'All' || article.category === filter)
            .filter(article => article.title.toLowerCase().includes(lowerCaseSearchTerm) || article.description.toLowerCase().includes(lowerCaseSearchTerm));

        if (filteredArticles.length === 0) {
            articlesGrid.innerHTML = `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">No articles found.</p>`;
            return;
        }

        filteredArticles.forEach(article => {
            const articleEl = document.createElement('article');
            articleEl.className = 'group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm card-hover h-full flex flex-col';

            articleEl.innerHTML = `
                <div class="relative aspect-video overflow-hidden">
                    <div class="cursor-pointer" data-article-id-open="${article.id}">
                        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div class="absolute bottom-4 left-4 px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs font-medium">${article.category}</div>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold mb-2 line-clamp-2">${article.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">${article.description.substring(0, 100)}...</p>
                    <div class="flex items-center justify-between text-sm mt-auto">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200"><img src="${article.authorImage}" alt="${article.author}" class="w-full h-full object-cover" /></div>
                            <span class="font-medium">${article.author}</span>
                        </div>
                        <span class="text-gray-500">${article.date}</span>
                    </div>
                </div>`;
            articlesGrid.appendChild(articleEl);
        });
    }

    function renderCategories() {
        categoriesGrid.innerHTML = '';
        categories.forEach(cat => {
            const categoryEl = document.createElement('a');
            categoryEl.href = '#';
            categoryEl.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group';
            categoryEl.innerHTML = `<div class="w-12 h-12 mx-auto gradient-bg rounded-full flex items-center justify-center text-white mb-2 transition-transform group-hover:scale-110"><i class="${cat.icon} text-xl"></i></div><h3 class="font-bold">${cat.name}</h3><p class="text-sm text-gray-500">${cat.count} Articles</p>`;
            categoryEl.addEventListener('click', (e) => {
                e.preventDefault();
                filterByCategory(cat.name);
                document.getElementById('recent-posts').scrollIntoView({ behavior: 'smooth' });
            });
            categoriesGrid.appendChild(categoryEl);
        });
    }

    function renderCategoryFilters() {
        categoryFiltersContainer.innerHTML = '';
        ['All', ...new Set(articles.map(a => a.category))].forEach(cat => {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 rounded-full font-medium whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';
            button.dataset.category = cat;
            button.textContent = cat;
            if (cat === currentCategoryFilter) {
                button.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-200');
            } else {
                button.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
            }
            categoryFiltersContainer.appendChild(button);
        });
    }

    function openArticleModal(article) {
        const modal = document.getElementById('article-modal');
        modal.querySelector('#modal-title').textContent = article.title;
        modal.querySelector('#modal-author-img').src = article.authorImage;
        modal.querySelector('#modal-author-name').textContent = article.author;
        modal.querySelector('#modal-date').textContent = article.date;
        modal.querySelector('#modal-body').innerHTML = `<p>${article.description.replace(/\n/g, '</p><p>')}</p>`;
        modal.querySelector('#modal-img').src = article.image;
        modal.querySelector('#modal-img').classList.remove('hidden');
        modal.classList.remove('modal-hidden');
    }

    function closeArticleModal() {
        document.getElementById('article-modal').classList.add('modal-hidden');
    }

    function toggleTheme() {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    }

    function filterByCategory(category) {
        currentCategoryFilter = category;
        renderCategoryFilters();
        renderArticles(currentCategoryFilter, document.getElementById('search-input').value);
    }

    function searchArticles(searchTerm) {
        renderArticles(currentCategoryFilter, searchTerm);
    }

    async function addArticle(formData) {
        const imageFile = formData.get('file');
        let imageB64 = `https://placehold.co/600x400/3b82f6/ffffff?text=${formData.get('category')}`;
        if (imageFile && imageFile.size > 0) {
            imageB64 = await fileToBase64(imageFile);
        }
        articles.unshift({
            id: Date.now(),
            title: formData.get('title'),
            category: formData.get('category'),
            image: imageB64,
            description: formData.get('abstract'),
            author: formData.get('name'),
            authorImage: `https://ui-avatars.com/api/?name=${formData.get('name').replace(' ', '+')}&background=10b981&color=fff`,
            date: "Just now"
        });
        saveArticles();
        showNotification('Article submitted successfully!');
        submitArticleForm.reset();
        currentCategoryFilter = 'All'; // Show all after submit
        renderCategoryFilters();
        renderArticles(currentCategoryFilter);
    }

    function subscribeNewsletter() {
        showNotification('Thank you for subscribing!');
    }

    // --- EVENT LISTENERS ---
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('search-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('search-box').classList.toggle('hidden');
    });
    document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (
            !document.getElementById('search-box').contains(e.target) &&
            !document.getElementById('search-toggle').contains(e.target)
        ) {
            document.getElementById('search-box').classList.add('hidden');
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeArticleModal();
        }
    });
    categoryFiltersContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            filterByCategory(e.target.dataset.category);
        }
    });
    articlesGrid.addEventListener('click', (e) => {
        const openTrigger = e.target.closest('[data-article-id-open]');
        if (openTrigger) {
            const articleId = parseInt(openTrigger.dataset.articleIdOpen, 10);
            const article = articles.find(a => a.id === articleId);
            if (article) openArticleModal(article);
        }
    });
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchArticles(e.target.value);
    });
    document.getElementById('subscribe-form').addEventListener('submit', (e) => {
        e.preventDefault();
        subscribeNewsletter();
        e.target.reset();
    });
    submitArticleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(submitArticleForm);
        await addArticle(formData);
    });
    document.getElementById('modal-close-btn').addEventListener('click', closeArticleModal);
    document.getElementById('article-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeArticleModal();
    });

    // --- INITIALIZATION ---
    function init() {
        articles = JSON.parse(localStorage.getItem('techBlogArticles'));
        if (!articles || !Array.isArray(articles)) {
            articles = initialArticles;
            saveArticles();
        }
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (savedTheme === 'dark') html.classList.add('dark');
        currentCategoryFilter = 'All';
        renderCategoryFilters();
        renderArticles(currentCategoryFilter);
        renderCategories();
    }

    init();

    // --- Expose Action Functions Globally (optional) ---
    window.techBlog = {
        renderArticles,
        renderCategories,
        renderCategoryFilters,
        openArticleModal,
        closeArticleModal,
        toggleTheme,
        filterByCategory,
        searchArticles,
        addArticle,
        subscribeNewsletter,
        showNotification
    };
});