import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieService } from './movie.service';

@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/')
  async getMovies(@Query() query: { search?: string; genre?: string }) {
    if (query) {
      const { search, genre } = query;
      return await this.movieService.filterMovies({ search, genre });
    }
    return await this.movieService.getMovies();
  }

  @Get('/lastest')
  async getLastestMovies() {
    return await this.movieService.filterMovies({
      sortBy: 'release_date',
      orderBy: 'DESC',
    });
  }

  @Get('/popular')
  async getPopularMovies() {
    return await this.movieService.getPopularMovies();
  }

  @Get('/random')
  async getRandom() {
    return await this.movieService.getRandomMovie('movie');
  }

  @Get('/:id')
  async getMovieById(@Param('id') id: number) {
    return await this.movieService.findMovieById(Number(id));
  }
}
