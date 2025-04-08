import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [
      'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 
      'PHP', 'GOLANG', 'Rust', 'Dart', 'R Lang', 'KOTLIN', 'SWIFT', 'Julia', 'XAML',
      'Node.js', 'React', 'ReactJS', 'Vue', 'Next.js', 'Next', 'SpringBoot', 'Flutter',
      'Django', 'FastAPI', 'NestJS', '.NET 6.0', '.NET MAUI', 'Unreal Engine', 'Blueprint',
      'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'SQLite', 'FireBase', 'Redis', 'Elasticsearch',
      'Git', 'Docker', 'Prometheus', 'Grafana', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit Learn',
      'Pandas', '1c', 'Android SDK', 'Figma', 'Photoshop', 'Selenium', 'Jest', 'Jupyter'
    ],
    unique: true
  })
  name: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @ManyToMany(() => User, user => user.technologies)
  users: User[];
}