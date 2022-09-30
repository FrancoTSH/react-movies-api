import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieService } from '../movie.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/')
  async getFavorites(@Request() request: any) {
    return await this.movieService.getFavoriteMovies(request.user.id);
  }
  @Get('/:id')
  async checkIfFavorite(@Param('id') id: number, @Request() request: any) {
    const isFavorite = await this.movieService.checkIfFavorite(
      Number(id),
      request.user.id,
    );
    return { favorite: isFavorite };
  }
  @Post('/')
  async addFavorite(@Request() request: any, @Body() body: any) {
    return await this.movieService.addToFavorite(
      body.movie_id,
      request.user.id,
    );
  }
  @Delete('/:id')
  async removeFavorite(@Request() request: any, @Param() id: number) {
    return await this.movieService.removeFromFavorite(id, request.user.id);
  }
}
