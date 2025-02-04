const db = require('../config/database');

class Movie {
  static async searchMovies(searchParams) {
    const { title, year, language } = searchParams;
    const isPortuguese = language === 'pt-BR';
    
    let query = `
      SELECT * FROM movies 
      WHERE year = ? 
      AND (
        title LIKE ? 
        OR title LIKE ? 
        OR title LIKE ?
      )
      ORDER BY 
        CASE 
          WHEN audio_type = ? THEN 1
          WHEN audio_type = ? THEN 2
          ELSE 3
        END
      LIMIT 1
    `;

    const searchTerm = `%${title}%`;
    const params = [
      year,
      searchTerm,
      searchTerm,
      searchTerm,
      isPortuguese ? 'Dublado' : 'Legendado',
      isPortuguese ? 'Nacional' : 'Dublado'
    ];

    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async getAllMovies() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM movies', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Movie;