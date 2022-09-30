import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieService } from '../movie.service';

@Controller('series')
@UseGuards(AuthGuard('jwt'))
export class SeriesController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/')
  async getSeries(@Query() query: { search?: string; genre?: string }) {
    if (query) {
      const { search, genre } = query;
      return await this.movieService.filterMovies({ search, genre });
    }
    return await this.movieService.getSeries();
  }

  @Get('/lastest')
  async getLastestSeries() {
    return await this.movieService.filterSeries({
      sortBy: 'release_date',
      orderBy: 'DESC',
    });
  }

  @Get('/popular')
  async getPopularSeries() {
    return await this.movieService.getPopularSeries();
  }

  @Get('/random')
  async getRandom() {
    return await this.movieService.getRandomMovie('series');
  }
}
