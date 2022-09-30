import { hash } from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 128, select: false })
  password: string;

  @Column({ type: 'bool', default: true, select: false })
  status: boolean;

  @Column({ type: 'varchar', nullable: true })
  photo_url: string;

  @Column({ type: 'varchar', length: 128, select: false, nullable: true })
  refresh_token: string;

  @ManyToMany(() => Movie)
  @JoinTable({
    name: 'favorite_movies',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'movie_id',
      referencedColumnName: 'id',
    },
  })
  favorite_movies: Movie[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    if (!this.password) {
      return;
    }
    this.password = await hash(this.password, 10);
  }

  addFavorites(movie: Movie) {
    if (this.favorite_movies == null) {
      this.favorite_movies = new Array<Movie>();
    }
    this.favorite_movies.push(movie);
  }
  getRefreshToken() {
    return this.refresh_token;
  }
}
