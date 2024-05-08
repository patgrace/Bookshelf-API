const { nanoid } = require ('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (readPage === pageCount) ? true : false

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    if (name == undefined || name == "") {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            },
        });
        response.code(201);
        return response;
    } 
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(500);
        return response;
    
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query
    let filterBooks = [...books];
    

    if (name){
        const searchName = name.toLowerCase();
        filterBooks = filterBooks.filter ((book) => book.name.toLowerCase().includes(searchName));
    }

    if (reading === '0' || reading === '1'){
        const isReading = reading === '1';
        filterBooks = filterBooks.filter((book) => book.reading === isReading);
    }

    if (finished === '0' || finished === '1'){
        const isFinished = finished === '1';
        filterBooks = filterBooks.filter((book) => book.finished === isFinished);
    }

    let showBooks = [];

    if (filterBooks.length > 0){
        showBooks = filterBooks.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
    } else {
        const response = h.response({
            status: 'success',
            data: {
                books
            }
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: showBooks
        }
    });

    response.code(200);
    return response;
    
}

const getDetailBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((book) => book.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        })
        response.code(200)
        return response
    }
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
          });
          response.code(404);
          return response;
    };

const editBookHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
    
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }
    
        if (index !== -1) {
            books[index] = {
                ...books[index],
                name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
            };
    
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }
    
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    };
    

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params
    const index = books.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}


module.exports = {
    addBookHandler, 
    getAllBooksHandler,
    getDetailBookHandler,
    editBookHandler, 
    deleteBookHandler
};