import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('movies')
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'date' })
  release_date: Date;

  @Column({ type: 'int', width: 100 })
  runtime: number;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  genre: string;

  @Column({ type: 'enum', enum: ['movie', 'series'], default: 'movie' })
  type: 'movie' | 'series';

  @Column({ type: 'varchar' })
  backdrop_img: string;

  @Column({ type: 'varchar' })
  poster_img: string;

  @ManyToMany(() => User)
  user_favorites: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  static getRandomMovies(type: string, number: number) {
    return this.createQueryBuilder()
      .where({ type })
      .orderBy('RANDOM()')
      .limit(number)
      .getMany();
  }

  static getRandomMovie(type: string) {
    return this.createQueryBuilder()
      .where({ type })
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();
  }
}
