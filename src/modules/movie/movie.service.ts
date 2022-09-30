import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOperator, Like } from 'typeorm';
import { User } from '../user/user.entity';
import { Movie } from './movie.entity';

@Injectable()
export class MovieService {
  async getMovies() {
    const movies = await Movie.find({ where: { type: 'movie' } });
    return movies;
  }

  async filterMovies(filter: any) {
    const { sortBy, orderBy, search, genre } = filter;
    let order = {};
    const where: {
      type: string;
      title?: FindOperator<string>;
      genre?: string;
    } = {
      type: 'movie',
    };
    if (sortBy && orderBy) {
      order = { [orderBy]: sortBy };
    }
    if (search) {
      where.title = Like(`%${search}%`);
    }
    if (genre) {
      where.genre = genre;
    }
    const movies = await Movie.find({
      where,
      order,
    });
    return movies;
  }

  async getSeries() {
    const movies = await Movie.find({ where: { type: 'series' } });
    return movies;
  }

  async filterSeries(filter: any) {
    const { sortBy, orderBy, search, genre } = filter;
    let order = {};
    const where: {
      type: string;
      title?: FindOperator<string>;
      genre?: string;
    } = {
      type: 'series',
    };
    if (sortBy && orderBy) {
      order = { [orderBy]: sortBy };
    }
    if (search) {
      where.title = Like(`%${search}%`);
    }
    if (genre) {
      where.genre = genre;
    }
    const series = await Movie.find({
      where,
      order,
    });
    return series;
  }

  async findMovieById(id: number) {
    const movie = await Movie.findOne(id);
    return movie;
  }

  async getRandomMovie(type: string) {
    const movie = await Movie.getRandomMovie(type);
    return movie;
  }

  async getPopularMovies() {
    const movies = await Movie.getRandomMovies('movies', 10);
    return movies;
  }

  async getPopularSeries() {
    const series = await Movie.getRandomMovies('series', 10);
    return series;
  }

  async getFavoriteMovies(id: number) {
    const user = await User.findOne(id, {
      relations: ['favorite_movies'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.favorite_movies;
  }

  async addToFavorite(movieId: number, userId: number) {
    const user = await User.findOne(userId);
    const movie = await Movie.findOne(movieId);
    user.addFavorites(movie);
    return await user.save();
  }

  async removeFromFavorite(movieId: number, userId: number) {
    const user = await User.findOne(userId, {
      relations: ['favorite_movies'],
    });
    const favoriteIndex = user.favorite_movies?.findIndex(
      (movie) => movie.id === movieId,
    );
    if (favoriteIndex > 0) {
      user.favorite_movies.splice(favoriteIndex, 1);
    }
    return user.save();
  }

  async checkIfFavorite(movieId: number, userId: number) {
    const user = await User.findOne(userId, {
      relations: ['favorite_movies'],
    });
    return Boolean(user.favorite_movies?.find((movie) => movie.id === movieId));
  }
}
