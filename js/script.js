const members = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "password123",
        borrowedBooks: []  
    }
   
];

const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/14972775-M.jpg" },
    { id: 2, title: "1984", author: "George Orwell", genre: "Science Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/10843662-M.jpg" },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", genre: "Fiction", available: false, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/12452418-M.jpg" },
    { id: 4, title: "Requirements Engineering : A Good Practice Guide", author: "Ian Sommerville", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/307579-M.jpg" },
    { id: 5, title: "Introduction to Modern Cryptography", author: "Jonathan Katz, Yehuda Lindell", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/8078229-M.jpg" },
    { id: 6, title: "And Then There Were None", author: "Agatha Christie", genre: "Mystery", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/13427682-M.jpg" },
    { id: 7, title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/8068060-M.jpg" },
    { id: 8, title: "Anne Frank: The Diary of Anne Frank", author: "Frances Goodrich, Anne Frank", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/11589256-M.jpg" },
    { id: 9, title: "Artificial Intelligence", author: "Noah Berlatsky", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/7070242-M.jpg" },
    { id: 10, title: "Test Driven development : by example", author: "Kent Beck", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/12381947-M.jpg" },
    { id: 11, title: "Discovering computers: fundamentals", author: "Gary B. Shelly", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/6490593-M.jpg" },
    { id: 12, title: "Computers and Data Processing", author: "Harvey M. Dietel", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/9617832-M.jpg" },
    { id: 13, title: "How Computers Work", author: "Ron White, Timothy Edward Downs", genre: "Non-Fiction", available: true, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/9466188-M.jpg" },
	{ id: 14, title: "Advances in Computers.", author: "Marvin V. Zelkowitz, Marshall C. Yovits", genre: "Non-Fiction", available: false, reservedBy: null, imageUrl: "https://covers.openlibrary.org/b/id/8666254-M.jpg" }
];

let currentUser = null;

function calculateDueDate() {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);
    return dueDate.toLocaleDateString();
}

function borrowBook(bookId) {
    if (!currentUser) {
        alert('Please login to borrow books');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book && book.available && book.reservedBy !== (currentUser ? currentUser.id : null) && book.reservedBy !== null) {
         const reservingMember = members.find(m => m.id === book.reservedBy);
         const memberName = reservingMember ? reservingMember.name : "another member";
         alert(`"${book.title}" is reserved by ${memberName} and cannot be borrowed.`);
         return;
    }


    if (book && book.available) {
        book.available = false;
        book.reservedBy = null;
        const member = members.find(m => m.id === currentUser.id);
        if (member) {
            member.borrowedBooks.push({
                id: book.id,
                title: book.title,
                author: book.author,
                borrowDate: new Date().toLocaleDateString(),
                dueDate: calculateDueDate()
            });
        }

        displayBooks(books);
        alert(`You have borrowed "${book.title}"`);
    } else if (book && !book.available) {
        alert(`"${book.title}" is currently unavailable.`);
    }
}

function reserveBook(bookId) {
    if (!currentUser) {
        alert('Please login to reserve books');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book && book.available && book.reservedBy === null) {
        book.reservedBy = currentUser.id;
        displayBooks(books);
        alert(`You have reserved "${book.title}"`);
    } else if (book && book.reservedBy === currentUser.id) {
        alert(`You have already reserved "${book.title}".`);
    } else if (book && book.reservedBy !== null) {
        const reservingMember = members.find(m => m.id === book.reservedBy);
        const memberName = reservingMember ? reservingMember.name : "another member";
        alert(`"${book.title}" is currently reserved by ${memberName}.`);
    } else if (book && !book.available) {
         if (book.reservedBy === null) {
             book.reservedBy = currentUser.id;
             displayBooks(books);
             alert(`"${book.title}" is currently borrowed but you have reserved it.`);
         } else if (book.reservedBy === currentUser.id) {
             alert(`You have already reserved "${book.title}".`);
         } else {
              const reservingMember = members.find(m => m.id === book.reservedBy);
              const memberName = reservingMember ? reservingMember.name : "another member";
              alert(`"${book.title}" is currently unavailable and reserved by ${memberName}.`);
         }
    }
}


function viewBorrowedBooks() {
    const borrowedBooksSection = document.getElementById('borrowedBooks');
    const reservedBooksSection = document.getElementById('reservedBooks');
    const finesSection = document.getElementById('finesSection');
    const borrowedBooksList = document.getElementById('borrowedBooksList');

    if (borrowedBooksSection) borrowedBooksSection.style.display = 'block';
    if (reservedBooksSection) reservedBooksSection.style.display = 'none';
    if (finesSection) finesSection.style.display = 'none';


    const member = members.find(m => m.id === currentUser.id);

    if (member && borrowedBooksList) {
        if (member.borrowedBooks.length > 0) {
            borrowedBooksList.innerHTML = '';
            member.borrowedBooks.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${book.title}</strong> by ${book.author}<br>
                    Borrowed on: ${book.borrowDate}<br>
                    Due Date: ${book.dueDate}
                `;
                borrowedBooksList.appendChild(li);
            });
        } else {
            borrowedBooksList.innerHTML = '<li>No books currently borrowed</li>';
        }
    }
}

function viewReservedBooks() {
    const borrowedBooksSection = document.getElementById('borrowedBooks');
    const reservedBooksSection = document.getElementById('reservedBooks');
    const finesSection = document.getElementById('finesSection');
    const reservedBooksList = document.getElementById('reservedBooksList');

    if (borrowedBooksSection) borrowedBooksSection.style.display = 'none';
    if (reservedBooksSection) reservedBooksSection.style.display = 'block';
    if (finesSection) finesSection.style.display = 'none';


    if (reservedBooksList) {
        reservedBooksList.innerHTML = '';
        const reservedByUser = books.filter(book => book.reservedBy === currentUser.id);

        if (reservedByUser.length > 0) {
            reservedByUser.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author}`;
                reservedBooksList.appendChild(li);
            });
        } else {
            reservedBooksList.innerHTML = '<li>No books currently reserved</li>';
        }
    }
}

function viewFines() {
    const borrowedBooksSection = document.getElementById('borrowedBooks');
    const reservedBooksSection = document.getElementById('reservedBooks');
    const finesSection = document.getElementById('finesSection');
    const finesAmount = document.getElementById('finesAmount');

    if (borrowedBooksSection) borrowedBooksSection.style.display = 'none';
    if (reservedBooksSection) reservedBooksSection.style.display = 'none';
    if (finesSection) finesSection.style.display = 'block';

     let totalFines = 0;
     if (currentUser) {
         const member = members.find(m => m.id === currentUser.id);
         if (member && member.borrowedBooks.length > 0) {
             const today = new Date();
             member.borrowedBooks.forEach(book => {
                 const dueDate = new Date(book.dueDate);
                 if (dueDate < today && dueDate.toDateString() !== today.toDateString()) {
                     const timeDiff = today.getTime() - dueDate.getTime();
                     const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
                     totalFines += daysOverdue * 0.10;
                 }
             });
         }
     }

     if (finesAmount) {
         if (totalFines > 0) {
              finesAmount.textContent = `Total Fines: $${totalFines.toFixed(2)}`;
         } else {
              finesAmount.textContent = 'You have no fines.';
         }
     }
}


function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    if (!booksList) return;

    booksList.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        let availabilityText = book.available ? 'Available' : 'Unavailable';
        if (!book.available && book.reservedBy) {
            const reservingMember = members.find(m => m.id === book.reservedBy);
            const memberName = reservingMember ? reservingMember.name : "someone";
            availabilityText = `Reserved by ${book.reservedBy === currentUser?.id ? 'You' : memberName}`;
        } else if (!book.available && !book.reservedBy) {
             availabilityText = 'Currently Borrowed';
        }


        let actionButtons = '';
        if (currentUser) {
             if (book.available && book.reservedBy === null) {
                actionButtons = `<button onclick="borrowBook(${book.id})">Borrow</button>
                                <button onclick="reserveBook(${book.id})">Reserve</button>`;
            } else if (book.available && book.reservedBy === currentUser.id) {
                 actionButtons = `<button onclick="borrowBook(${book.id})">Borrow</button>`;
            } else if (!book.available && book.reservedBy !== currentUser?.id) {
                 if (book.reservedBy !== currentUser?.id) {
                     actionButtons = `<button onclick="reserveBook(${book.id})">Reserve</button>`;
                 }
            } else if (!book.available && book.reservedBy === currentUser?.id) {
                 actionButtons = ''; 
            } else if (book.available && book.reservedBy !== null && book.reservedBy !== currentUser?.id) {
                  actionButtons = `<button onclick="reserveBook(${book.id})">Reserve</button>`;
            }
        }


        bookCard.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title} Cover" class="book-cover">
            <div class="book-details">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Genre: ${book.genre}</p>
                <p class="availability">
                    Availability: ${availabilityText}
                </p>
                ${actionButtons}
            </div>
        `;
        booksList.appendChild(bookCard);
    });
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return; 

    const searchValue = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue) ||
        book.genre.toLowerCase().includes(searchValue)
    );
    displayBooks(filteredBooks);
}

function filterBooks() {
    const genreFilter = document.getElementById('genreFilter');
     if (!genreFilter) return;

    const selectedGenre = genreFilter.value;
    const filteredBooks = selectedGenre
        ? books.filter(book => book.genre === selectedGenre)
        : books;
    displayBooks(filteredBooks);
}

function showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const memberDashboard = document.getElementById('memberDashboard');

    if (loginSection) loginSection.style.display = 'block';
    if (registerSection) registerSection.style.display = 'none';
    if (memberDashboard) memberDashboard.style.display = 'none';
}

function showRegisterForm() {
     const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const memberDashboard = document.getElementById('memberDashboard');

    if (loginSection) loginSection.style.display = 'none';
    if (registerSection) registerSection.style.display = 'block';
    if (memberDashboard) memberDashboard.style.display = 'none';
}

function showMemberDashboard(member) {
     const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const memberDashboard = document.getElementById('memberDashboard');
    const memberNameElement = document.getElementById('memberName');
    const reservedBooksCountElement = document.getElementById('reservedBooksCount');


    if (loginSection) loginSection.style.display = 'none';
    if (registerSection) registerSection.style.display = 'none';
    if (memberDashboard) memberDashboard.style.display = 'block';

    if (memberNameElement) memberNameElement.textContent = member.name;

    if (reservedBooksCountElement) {
         const reservedCount = books.filter(book => book.reservedBy === member.id).length;
         reservedBooksCountElement.textContent = reservedCount;
    }

    const borrowedBooksSection = document.getElementById('borrowedBooks');
    const reservedBooksSection = document.getElementById('reservedBooks');
    const finesSection = document.getElementById('finesSection');

    if (borrowedBooksSection) borrowedBooksSection.style.display = 'none';
    if (reservedBooksSection) reservedBooksSection.style.display = 'none';
    if (finesSection) finesSection.style.display = 'none';
}

function logout() {
    currentUser = null;
    showLoginForm();
}

if (document.URL.includes("members.html")) {
    document.addEventListener('DOMContentLoaded', function() {
        showLoginForm();

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const usernameInput = document.getElementById('username');
                const passwordInput = document.getElementById('password');

                if (usernameInput && passwordInput) {
                     const username = usernameInput.value;
                    const password = passwordInput.value;

                    const member = members.find(m => m.username === username && m.password === password);
                    if (member) {
                        currentUser = member;
                        showMemberDashboard(member);
                    } else {
                        alert('Invalid username or password');
                    }
                }
            });
        }


        const registerForm = document.getElementById('registerForm');
         if (registerForm) {
             registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const nameInput = document.getElementById('regName');
                const emailInput = document.getElementById('regEmail');
                const usernameInput = document.getElementById('regUsername');
                const passwordInput = document.getElementById('regPassword');

                if (nameInput && emailInput && usernameInput && passwordInput) {
                    const name = nameInput.value;
                    const email = emailInput.value;
                    const username = usernameInput.value;
                    const password = passwordInput.value;

                    if (!name || !email || !username || !password) {
                        alert('Please fill in all fields');
                        return;
                    }

                    if (members.some(m => m.username === username)) {
                        alert('Username already exists');
                        return;
                    }

                    const newMember = {
                        id: members.length + 1,
                        name,
                        email,
                        username,
                        password,
                        borrowedBooks: []
                    };

                    members.push(newMember);
                    alert('Registration successful! Please login.');
                    showLoginForm();
                    nameInput.value = '';
                    emailInput.value = '';
                    usernameInput.value = '';
                    passwordInput.value = '';
                }
            });
        }


        const showRegLink = document.getElementById('showRegisterLink');
        if (showRegLink) {
            showRegLink.addEventListener('click', function(e) {
                e.preventDefault();
                showRegisterForm();
            });
        }

         
        const showLoginLink = document.getElementById('showLoginLink');
        if (showLoginLink) {
            showLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginForm();
            });
        }

         
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
             logoutButton.addEventListener('click', logout);
        }

         
        const viewBorrowedBtn = document.getElementById('viewBorrowedBtn');
        if (viewBorrowedBtn) {
            viewBorrowedBtn.addEventListener('click', viewBorrowedBooks);
        }

         
        const viewReservedBtn = document.getElementById('viewReservedBtn');
        if (viewReservedBtn) {
            viewReservedBtn.addEventListener('click', viewReservedBooks);
        }

         
        const viewFinesBtn = document.getElementById('viewFinesBtn');
        if (viewFinesBtn) {
            viewFinesBtn.addEventListener('click', viewFines);
        }
    });
}

if (document.URL.includes("books.html")) {
    document.addEventListener('DOMContentLoaded', function() {
        displayBooks(books);

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', searchBooks);
        }

        const genreFilter = document.getElementById('genreFilter');
        if (genreFilter) {
            genreFilter.addEventListener('change', filterBooks);

            const genres = ['All Genres', ...new Set(books.map(book => book.genre))];
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre === 'All Genres' ? '' : genre; 
                option.textContent = genre;
                genreFilter.appendChild(option);
            });
        }
    });
}