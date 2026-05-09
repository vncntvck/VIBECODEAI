// Protection Guard
(function() {
    const currentUser = Storage.getCurrentUser();
    const publicPages = ['login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!currentUser && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    } else if (currentUser && publicPages.includes(currentPage)) {
        window.location.href = 'index.html';
    }
    
    // Check for limit if logged in
    if (currentUser && !currentUser.monthlyLimit && currentPage !== 'limit-setup.html') {
        window.location.href = 'limit-setup.html';
    }
})();
