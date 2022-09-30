import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { FavoritesController } from './favorites/favorites.controller';
import { SeriesController } from './series/series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController, FavoritesController, SeriesController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
